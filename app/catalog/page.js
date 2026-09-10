"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TierBadge from "@/components/TierBadge";
import { getAllCharacters, deleteCharacter } from "@/lib/db";

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

      <div className="mt-8 flex flex-col items-center gap-8">
        {characters.map((c) => (
          <CatalogPageCard key={c.id} character={c} onDelete={() => handleDelete(c.id)} />
        ))}
      </div>
    </main>
  );
}

function CatalogPageCard({ character, onDelete }) {
  const { name, subtitle, tier, lore, images } = character;
  const cols = images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div className="catalog-page relative flex flex-col bg-white text-neutral-900 shadow-lg" style={{ width: "210mm", height: "297mm", padding: "12mm" }}>
      <button
        onClick={onDelete}
        className="no-print absolute right-3 top-3 rounded border border-neutral-300 bg-white px-2 py-1 text-xs text-neutral-500 hover:border-red-400 hover:text-red-500"
      >
        Remove
      </button>

      <div className="mb-3 flex items-baseline justify-between border-b border-neutral-300 pb-2">
        <div>
          <h2 className="font-display text-3xl">{name}</h2>
          <p className="italic text-neutral-600">{subtitle}</p>
        </div>
        <TierBadge tier={tier} />
      </div>

      <div className={`grid gap-3 ${cols}`} style={{ height: "55%" }}>
        {images.map((img, idx) => (
          <img key={idx} src={img.dataUrl} alt={`${name} ${idx + 1}`} className="h-full w-full rounded object-cover" />
        ))}
      </div>

      <div className="mt-4 flex-1 overflow-hidden">
        <p className="whitespace-pre-wrap text-[10pt] leading-relaxed text-neutral-800">{lore}</p>
      </div>
    </div>
  );
}
