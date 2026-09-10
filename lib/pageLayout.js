// Shared layout constants for the A4 compendium page — used by both the DOM
// component (RelicsPage) and the canvas-based PNG renderer, so the two never
// drift apart.

// A4 at 96 CSS px/inch.
export const PAGE_W = 793.7;
export const PAGE_H = 1122.5;

export const PADDING_PX = 12 * (96 / 25.4); // "12mm"
export const HEADER_HEIGHT = 96; // fixed so the image area's position never depends on name/subtitle length
export const HEADER_GAP = 12;
export const HALF_MARGIN = 20; // keep the image area at least this far above the page's true midline
export const LORE_GAP = 16;

// Everything below is measured relative to the padding box (i.e. the same
// origin normal-flow children use), not the page's outer border box.
export const contentHeight = PAGE_H - PADDING_PX * 2;
export const pageMidline = PAGE_H / 2 - PADDING_PX;
export const imageAreaTop = HEADER_HEIGHT + HEADER_GAP;
export const imageAreaBottom = pageMidline - HALF_MARGIN;
export const imageAreaHeight = imageAreaBottom - imageAreaTop;
export const loreTop = imageAreaBottom + LORE_GAP;
export const loreHeight = contentHeight - loreTop;
