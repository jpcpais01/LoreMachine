import TierBadge from "@/components/TierBadge";
import ImageGrid from "@/components/ImageGrid";
import Highlighted from "@/components/Highlighted";
import { PAGE_W, PAGE_H, PADDING_PX, HEADER_HEIGHT, imageAreaTop, imageAreaHeight, loreTop, loreHeight } from "@/lib/pageLayout";

export { PAGE_W, PAGE_H };

// The single-character compendium page: name/subtitle/tier header, then an
// image area pinned to the page's upper half (ending HALF_MARGIN above the
// true midline, independent of how tall the header or lore text are), then
// lore filling the rest. Used for the on-screen catalog list — PNG export
// is rendered separately straight from the character data via
// lib/renderRelicsPagePng.js, not by capturing this DOM. `buttons` renders
// as a ".no-print" overlay so it's excluded from printed pages.
export default function RelicsPage({ character, scale = 1, buttons = null }) {
  const { name, subtitle, tier, lore, images } = character;

  return (
    <div
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
}
