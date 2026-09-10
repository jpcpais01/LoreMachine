// Renders a character's compendium page straight to a PNG using the Canvas
// 2D API, then triggers a download — no DOM capture involved at all.
//
// This replaced an html2canvas-based approach that kept failing in
// different ways (blank 0x0 captures, images stretched instead of cropped
// because html2canvas ignores object-fit, low-quality output). Drawing
// everything ourselves from the character data gives full control over
// resolution and exactly replicates object-fit:cover cropping using each
// image's real natural size, so quality is never worse than the source.
import {
  PAGE_W,
  PAGE_H,
  PADDING_PX,
  HEADER_HEIGHT,
  imageAreaTop,
  imageAreaHeight,
  loreTop,
  loreHeight,
} from "@/lib/pageLayout";

const SCALE = 3; // render at 3x CSS px for crisp text regardless of screen DPI
const GAP = 8; // matches Tailwind's gap-2

const SERIF = "Georgia, serif";
const SANS = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const COLORS = {
  name: "#171717", // neutral-900
  subtitle: "#525252", // neutral-600
  lore: "#262626", // neutral-800
  highlight: "#b45309", // amber-700
  border: "#d4d4d4", // neutral-300
  tier: {
    normal: "#475569", // slate-600
    legend: "#6d28d9", // violet-700
    myth: "#b45309", // amber-700
  },
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load an image for export."));
    img.src = src;
  });
}

// Draws `img` into the destination box exactly like CSS object-fit:cover
// would: crop to the destination's aspect ratio (from the image's own full
// resolution, not a downscaled copy) then scale to fill.
function drawImageCover(ctx, img, dx, dy, dw, dh) {
  const sw = img.naturalWidth;
  const sh = img.naturalHeight;
  const srcRatio = sw / sh;
  const dstRatio = dw / dh;
  let cropW, cropH, cropX, cropY;
  if (srcRatio > dstRatio) {
    cropH = sh;
    cropW = sh * dstRatio;
    cropX = (sw - cropW) / 2;
    cropY = 0;
  } else {
    cropW = sw;
    cropH = sw / dstRatio;
    cropX = 0;
    cropY = (sh - cropH) / 2;
  }
  ctx.drawImage(img, cropX, cropY, cropW, cropH, dx, dy, dw, dh);
}

// Mirrors ImageGrid's CSS layout (1 full box / 2 side-by-side / hero+stack).
function layoutImageBoxes(n, x, y, w, h) {
  if (n <= 1) return [{ x, y, w, h }];
  if (n === 2) {
    const boxW = (w - GAP) / 2;
    return [
      { x, y, w: boxW, h },
      { x: x + boxW + GAP, y, w: boxW, h },
    ];
  }
  const heroW = (w - GAP) * (1.5 / 2.5);
  const rightW = w - GAP - heroW;
  const rightX = x + heroW + GAP;
  const rightBoxH = (h - GAP) / 2;
  return [
    { x, y, w: heroW, h },
    { x: rightX, y, w: rightW, h: rightBoxH },
    { x: rightX, y: y + rightBoxH + GAP, w: rightW, h: rightBoxH },
  ];
}

// Turns raw text (possibly containing [[highlight]] markup and newlines)
// into a flat list of {word, hl} / {break:true} units for line-wrapping.
function tokenizeWords(text) {
  const units = [];
  const regex = /\[\[(.+?)\]\]/g;
  let last = 0;
  let m;
  const parts = [];
  const str = text || "";
  while ((m = regex.exec(str))) {
    if (m.index > last) parts.push({ text: str.slice(last, m.index), hl: false });
    parts.push({ text: m[1], hl: true });
    last = m.index + m[0].length;
  }
  if (last < str.length) parts.push({ text: str.slice(last), hl: false });

  for (const part of parts) {
    part.text.split("\n").forEach((line, i) => {
      if (i > 0) units.push({ break: true });
      for (const w of line.split(/\s+/)) {
        if (w) units.push({ word: w, hl: part.hl });
      }
    });
  }
  return units;
}

function layoutLines(ctx, units, maxWidth, normalFont, highlightFont) {
  ctx.font = normalFont;
  const spaceWidth = ctx.measureText(" ").width;
  const lines = [];
  let current = [];
  let currentWidth = 0;
  for (const u of units) {
    if (u.break) {
      lines.push(current);
      current = [];
      currentWidth = 0;
      continue;
    }
    ctx.font = u.hl ? highlightFont : normalFont;
    const w = ctx.measureText(u.word).width;
    const addWidth = (current.length > 0 ? spaceWidth : 0) + w;
    if (current.length > 0 && currentWidth + addWidth > maxWidth) {
      lines.push(current);
      current = [u];
      currentWidth = w;
    } else {
      current.push(u);
      currentWidth += addWidth;
    }
  }
  if (current.length > 0) lines.push(current);
  return lines;
}

function drawLines(ctx, lines, x, y, lineHeight, maxHeight, normalFont, highlightFont, normalColor, highlightColor) {
  ctx.font = normalFont;
  const spaceWidth = ctx.measureText(" ").width;
  ctx.textBaseline = "alphabetic";
  let cy = y;
  for (const line of lines) {
    if (cy - y + lineHeight > maxHeight + 0.001) break; // matches overflow:hidden clipping
    let cx = x;
    for (const u of line) {
      ctx.font = u.hl ? highlightFont : normalFont;
      ctx.fillStyle = u.hl ? highlightColor : normalColor;
      ctx.fillText(u.word, cx, cy);
      cx += ctx.measureText(u.word).width + spaceWidth;
    }
    cy += lineHeight;
  }
}

// Single-line rich text with a trailing "…" if it doesn't all fit — the
// canvas equivalent of the DOM's CSS truncate on the subtitle.
function drawRichSingleLine(ctx, units, x, y, maxWidth, normalFont, highlightFont, normalColor, highlightColor) {
  ctx.font = normalFont;
  const spaceWidth = ctx.measureText(" ").width;
  const ellipsisWidth = ctx.measureText("…").width;
  let cx = x;
  for (let i = 0; i < units.length; i++) {
    const u = units[i];
    if (u.break) break;
    ctx.font = u.hl ? highlightFont : normalFont;
    const w = ctx.measureText(u.word).width;
    if (cx + w > x + maxWidth) {
      ctx.font = normalFont;
      if (cx + ellipsisWidth <= x + maxWidth) {
        ctx.fillStyle = normalColor;
        ctx.fillText("…", cx, y);
      }
      return;
    }
    ctx.fillStyle = u.hl ? highlightColor : normalColor;
    ctx.fillText(u.word, cx, y);
    cx += w + spaceWidth;
  }
}

// Plain single-line ellipsis truncation (used for the name, which never
// contains highlight markup).
function truncateSingleLine(ctx, text, maxWidth, font) {
  ctx.font = font;
  if (!text || ctx.measureText(text).width <= maxWidth) return text || "";
  let lo = 0;
  let hi = text.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    const candidate = text.slice(0, mid).trimEnd() + "…";
    if (ctx.measureText(candidate).width <= maxWidth) lo = mid;
    else hi = mid - 1;
  }
  return text.slice(0, lo).trimEnd() + "…";
}

export async function renderRelicsPagePng(character, filename) {
  const { name, subtitle, tier, lore, images } = character;

  const loadedImages = await Promise.all((images || []).map((im) => loadImage(im.dataUrl)));

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PAGE_W * SCALE);
  canvas.height = Math.round(PAGE_H * SCALE);
  const ctx = canvas.getContext("2d");
  ctx.scale(SCALE, SCALE);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, PAGE_W, PAGE_H);

  const contentX = PADDING_PX;
  const contentW = PAGE_W - PADDING_PX * 2;

  // --- Header: name, subtitle, tier badge, underline ---
  const nameFont = `30px ${SERIF}`;
  const subtitleFont = `italic 16px ${SANS}`;
  const subtitleHighlightFont = `italic 600 16px ${SERIF}`;
  const tierFont = `600 14px ${SERIF}`;

  const tierText = (tier || "normal").toUpperCase();
  ctx.font = tierFont;
  const tierWidth = ctx.measureText(tierText).width;
  const headerTextMaxWidth = contentW - tierWidth - 16;

  const nameBaselineY = PADDING_PX + 26;
  const displayName = truncateSingleLine(ctx, name, headerTextMaxWidth, nameFont);
  ctx.font = nameFont;
  ctx.fillStyle = COLORS.name;
  ctx.fillText(displayName, contentX, nameBaselineY);

  const subtitleBaselineY = nameBaselineY + 26;
  drawRichSingleLine(
    ctx,
    tokenizeWords(subtitle),
    contentX,
    subtitleBaselineY,
    headerTextMaxWidth,
    subtitleFont,
    subtitleHighlightFont,
    COLORS.subtitle,
    COLORS.highlight
  );

  ctx.font = tierFont;
  ctx.fillStyle = COLORS.tier[tier] || COLORS.tier.normal;
  ctx.fillText(tierText, contentX + contentW - tierWidth, PADDING_PX + 14);

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  const underlineY = PADDING_PX + HEADER_HEIGHT - 8;
  ctx.beginPath();
  ctx.moveTo(contentX, underlineY);
  ctx.lineTo(contentX + contentW, underlineY);
  ctx.stroke();

  // --- Images, pinned to the upper half exactly like the DOM layout ---
  const boxes = layoutImageBoxes(loadedImages.length, contentX, PADDING_PX + imageAreaTop, contentW, imageAreaHeight);
  boxes.forEach((box, i) => {
    if (loadedImages[i]) drawImageCover(ctx, loadedImages[i], box.x, box.y, box.w, box.h);
  });

  // --- Lore ---
  const loreFont = `13.33px ${SANS}`; // 10pt
  const loreHighlightFont = `600 13.33px ${SERIF}`;
  const loreLineHeight = 13.33 * 1.625; // leading-relaxed
  const loreLines = layoutLines(ctx, tokenizeWords(lore), contentW, loreFont, loreHighlightFont);
  drawLines(
    ctx,
    loreLines,
    contentX,
    PADDING_PX + loreTop + loreLineHeight * 0.8,
    loreLineHeight,
    loreHeight,
    loreFont,
    loreHighlightFont,
    COLORS.lore,
    COLORS.highlight
  );

  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}
