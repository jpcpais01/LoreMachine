"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TierBadge from "@/components/TierBadge";
import ImageGrid from "@/components/ImageGrid";
import Highlighted from "@/components/Highlighted";
import { getAllCharacters, deleteCharacter } from "@/lib/db";

// A4 at 96 CSS px/inch.
const PAGE_W = 793.7;
const PAGE_H = 1122.5;

export default function CatalogPage() {
  const [characters, setCharacters] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAllCharacters().then((list) => {
      setCharacters(list);
      setLoaded(true);
    });
  }, []);

  async function handleDelete(id) {
    await deleteCharacter(id);
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <main className="min-h-screen bg-neutral-950 pb-16">
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/95 px-6 py-4">
        <Link href="/" className="text-sm text-amber-400 underline underline-offset-2">
          ← Back to generator
        </Link>
        <h1 className="font-display text-xl text-neutral-100">Relics Catalog</h1>
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
        >
          Print / Save as PDF
        </button>
      </div>

      {loaded && characters.length === 0 && (
        <p className="mt-12 text-center text-neutral-500">
          No characters saved yet. Generate one and hit &quot;Add to catalog&quot;.
        </p>
      )}

      <div className="catalog-list mt-8 flex flex-col items-center gap-8">
        {characters.map((c) => (
          <CatalogPageCard key={c.id} character={c} onDelete={() => handleDelete(c.id)} />
        ))}
      </div>
    </main>
  );
}

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

function CatalogPageCard({ character, onDelete }) {
  const { name, subtitle, tier, lore, images } = character;
  const scale = useResponsiveScale();
  const pageRef = useRef(null);
  const [saving, setSaving] = useState(false);

  async function handleSavePng() {
    const el = pageRef.current;
    if (!el || saving) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      // Render an offscreen clone instead of mutating the live element, so
      // the visible page never reflows/flashes during capture.
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff",
        onclone: (clonedDoc, clonedEl) => {
          clonedEl.style.transform = "none";
          clonedDoc.querySelectorAll(".no-print").forEach((node) => {
            node.style.display = "none";
          });
        },
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${(name || "relic").replace(/\s+/g, "-").toLowerCase()}-page.png`;
      link.click();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="catalog-page-wrapper mx-auto" style={{ width: PAGE_W * scale, height: PAGE_H * scale }}>
      <div
        ref={pageRef}
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

        <div className="mb-3 flex items-baseline justify-between border-b border-neutral-300 pb-2">
          <div>
            <h2 className="font-display text-3xl">{name}</h2>
            <p className="italic text-neutral-600">
              <Highlighted text={subtitle} highlightClassName="text-amber-700 font-display font-semibold" />
            </p>
          </div>
          <TierBadge tier={tier} />
        </div>

        <ImageGrid images={images} className="shrink-0" />

        <div className="mt-4 flex-1 overflow-hidden">
          <p className="whitespace-pre-wrap text-[10pt] leading-relaxed text-neutral-800">
            <Highlighted text={lore} highlightClassName="text-amber-700 font-display font-semibold" />
          </p>
        </div>
      </div>
    </div>
  );
}
