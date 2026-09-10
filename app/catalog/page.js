"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CatalogPageCard from "@/components/CatalogPageCard";
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

      <div className="catalog-list mt-8 flex flex-col items-center gap-8">
        {characters.map((c) => (
          <CatalogPageCard key={c.id} character={c} onDelete={() => handleDelete(c.id)} />
        ))}
      </div>
    </main>
  );
}
