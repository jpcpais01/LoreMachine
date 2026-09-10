"use client";

import { useEffect, useState } from "react";
import RelicsPage, { PAGE_W, PAGE_H } from "@/components/RelicsPage";
import { renderRelicsPagePng } from "@/lib/renderRelicsPagePng";

function useResponsiveScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      const available = Math.min(window.innerWidth - 32, PAGE_W);
      setScale(Math.max(0.1, available / PAGE_W));
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return scale;
}

export default function CatalogPageCard({ character, onDelete }) {
  const scale = useResponsiveScale();
  const [saving, setSaving] = useState(false);

  async function handleSavePng() {
    if (saving) return;
    setSaving(true);
    try {
      const filename = `${(character.name || "relic").replace(/\s+/g, "-").toLowerCase()}-page.png`;
      await renderRelicsPagePng(character, filename);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="catalog-page-wrapper mx-auto" style={{ width: PAGE_W * scale, height: PAGE_H * scale }}>
      <RelicsPage
        character={character}
        scale={scale}
        buttons={
          <div className="no-print absolute right-3 top-3 flex gap-2">
            <button
              onClick={handleSavePng}
              disabled={saving}
              className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-500 hover:border-amber-500 hover:text-amber-600 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save PNG"}
            </button>
            <button
              onClick={onDelete}
              className="rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-500 hover:border-red-400 hover:text-red-500"
            >
              Remove
            </button>
          </div>
        }
      />
    </div>
  );
}
