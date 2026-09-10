import { forwardRef } from "react";
import TierBadge from "@/components/TierBadge";
import ImageGrid from "@/components/ImageGrid";
import Highlighted from "@/components/Highlighted";

// A4 at 96 CSS px/inch.
export const PAGE_W = 793.7;
export const PAGE_H = 1122.5;

const PADDING_PX = 12 * (96 / 25.4); // "12mm"
const HEADER_HEIGHT = 70; // fixed so the image area's position never depends on name/subtitle length
const HEADER_GAP = 12;
const HALF_MARGIN = 20; // keep the image area at least this far above the page's true midline
const LORE_GAP = 16;

// Everything below is measured relative to the padding box (i.e. the same
// origin normal-flow children use), not the page's outer border box.
const contentHeight = PAGE_H - PADDING_PX * 2;
const pageMidline = PAGE_H / 2 - PADDING_PX;
const imageAreaTop = HEADER_HEIGHT + HEADER_GAP;
const imageAreaBottom = pageMidline - HALF_MARGIN;
const imageAreaHeight = imageAreaBottom - imageAreaTop;
const loreTop = imageAreaBottom + LORE_GAP;
const loreHeight = contentHeight - loreTop;

// The single-character compendium page: name/subtitle/tier header, then an
// image area pinned to the page's upper half (ending HALF_MARGIN above the
// true midline, independent of how tall the header or lore text are), then
// lore filling the rest. Used both in the catalog list and (offscreen) for
// a one-off PNG export straight from the generator's result — same layout
// either way. `buttons` renders as a ".no-print"/".png-hide" overlay so
// it's excluded from PNG exports and printed pages.
const RelicsPage = forwardRef(function RelicsPage({ character, scale = 1, buttons = null }, ref) {
  const { name, subtitle, tier, lore, images } = character;

  return (
    <div
      ref={ref}
      className="catalog-page relative bg-white text-neutral-900 shadow-lg"
      style={{
        width: PAGE_W,
        height: PAGE_H,
        padding: PADDING_PX,
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {buttons}

      <div
        className="flex items-start justify-between overflow-hidden border-b border-neutral-300 pb-2"
        style={{ height: HEADER_HEIGHT }}
      >
        <div className="min-w-0">
          <h2 className="truncate font-display text-3xl">{name}</h2>
          <p className="truncate italic text-neutral-600">
            <Highlighted text={subtitle} highlightClassName="text-amber-700 font-display font-semibold" />
          </p>
        </div>
        <TierBadge tier={tier} onLight />
      </div>

      {/* An absolutely positioned child's top:0 aligns with the parent's
          padding edge (i.e. before the parent's own padding), not with
          where normal-flow content starts — so PADDING_PX has to be added
          back in here even though the header above didn't need it. */}
      <div
        className="absolute left-0 right-0"
        style={{ top: PADDING_PX + imageAreaTop, height: imageAreaHeight, padding: `0 ${PADDING_PX}px` }}
      >
        <ImageGrid images={images} fillHeight />
      </div>

      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{ top: PADDING_PX + loreTop, height: loreHeight, padding: `0 ${PADDING_PX}px` }}
      >
        <p className="whitespace-pre-wrap text-[10pt] leading-relaxed text-neutral-800">
          <Highlighted text={lore} highlightClassName="text-amber-700 font-display font-semibold" />
        </p>
      </div>
    </div>
  );
});

export default RelicsPage;
