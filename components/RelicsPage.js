import { forwardRef } from "react";
import TierBadge from "@/components/TierBadge";
import ImageGrid from "@/components/ImageGrid";
import Highlighted from "@/components/Highlighted";

// A4 at 96 CSS px/inch.
export const PAGE_W = 793.7;
export const PAGE_H = 1122.5;

// The single-character compendium page: name/subtitle/tier header, images
// filling the top half, lore filling the rest. Used both in the catalog
// list and (offscreen) for a one-off PNG export straight from the
// generator's result — same layout either way. `buttons` renders as a
// ".no-print" overlay so it's excluded from PNG exports and printed pages.
const RelicsPage = forwardRef(function RelicsPage({ character, scale = 1, buttons = null }, ref) {
  const { name, subtitle, tier, lore, images } = character;

  return (
    <div
      ref={ref}
      className="catalog-page relative flex flex-col bg-white text-neutral-900 shadow-lg"
      style={{
        width: PAGE_W,
        height: PAGE_H,
        padding: "12mm",
        boxSizing: "border-box",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      {buttons}

      <div className="mb-3 flex items-baseline justify-between border-b border-neutral-300 pb-2">
        <div>
          <h2 className="font-display text-3xl">{name}</h2>
          <p className="italic text-neutral-600">
            <Highlighted text={subtitle} highlightClassName="text-amber-700 font-display font-semibold" />
          </p>
        </div>
        <TierBadge tier={tier} />
      </div>

      <div className="shrink-0" style={{ height: "50%" }}>
        <ImageGrid images={images} fillHeight />
      </div>

      <div className="mt-4 flex-1 overflow-hidden">
        <p className="whitespace-pre-wrap text-[10pt] leading-relaxed text-neutral-800">
          <Highlighted text={lore} highlightClassName="text-amber-700 font-display font-semibold" />
        </p>
      </div>
    </div>
  );
});

export default RelicsPage;
