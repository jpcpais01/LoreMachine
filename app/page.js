"use client";

import { useState } from "react";
import Link from "next/link";
import TierToggle from "@/components/TierToggle";
import TierBadge from "@/components/TierBadge";
import ImageGrid from "@/components/ImageGrid";
import Highlighted from "@/components/Highlighted";
import { addCharacter } from "@/lib/db";

export default function Home() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tier, setTier] = useState("normal");
  const [count, setCount] = useState(3);
  const [language, setLanguage] = useState("en");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSaved(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, tier, count, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAutoName() {
    setNameLoading(true);
    setError("");
    try {
      const res = await fetch("/api/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "name", tier, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate a name.");
      setName(data.name || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setNameLoading(false);
    }
  }

  async function handleAutoDescription() {
    setDescLoading(true);
    setError("");
    try {
      const res = await fetch("/api/idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "description", tier, name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate a description.");
      setDescription(data.description || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setDescLoading(false);
    }
  }

  async function handleCopyText() {
    if (!result) return;
    const text = `${name || "(unnamed)"}\n${result.subtitle}\n\n${result.lore}`;
    await navigator.clipboard.writeText(text);
  }

  function handleDownload(dataUrl, idx) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${(name || "relic").replace(/\s+/g, "-").toLowerCase()}-${idx + 1}.png`;
    a.click();
  }

  async function handleAddToCatalog() {
    if (!result) return;
    await addCharacter({
      id: crypto.randomUUID(),
      name: name || "(unnamed)",
      subtitle: result.subtitle,
      lore: result.lore,
      tier: result.tier,
      images: result.images,
      createdAt: Date.now(),
    });
    setSaved(true);
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl tracking-wide">RELICS GENERATOR</h1>
        <p className="mt-1 text-sm text-neutral-400">Lore & image machine for the Relics TCG</p>
        <Link href="/catalog" className="mt-3 inline-block text-sm text-amber-400 underline underline-offset-2">
          View catalog →
        </Link>
      </header>

      <form onSubmit={handleGenerate} className="space-y-5 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm text-neutral-400">Character name</label>
            <button
              type="button"
              onClick={handleAutoName}
              disabled={nameLoading}
              className="text-xs text-amber-400 underline underline-offset-2 disabled:opacity-50"
            >
              {nameLoading ? "Thinking…" : "✨ Auto-generate"}
            </button>
          </div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Korrun Ashblade"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm text-neutral-400">Describe the character</label>
            <button
              type="button"
              onClick={handleAutoDescription}
              disabled={descLoading}
              className="text-xs text-amber-400 underline underline-offset-2 disabled:opacity-50"
            >
              {descLoading ? "Thinking…" : "✨ Auto-generate"}
            </button>
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            placeholder="e.g. a stern female warrior from a volcanic tech planet, wields a plasma spear, obsidian armor..."
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-400">Tier</label>
          <TierToggle value={tier} onChange={setTier} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Image variations</label>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setCount(n)}
                  className={`flex-1 rounded-lg border px-3 py-2 ${
                    count === n
                      ? "border-amber-500 bg-amber-500/20 text-amber-300"
                      : "border-neutral-700 bg-neutral-950 text-neutral-400"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-neutral-400">Lore language</label>
            <div className="flex gap-2">
              {[
                { code: "en", label: "English" },
                { code: "pt", label: "Português (PT)" },
              ].map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                    language === l.code
                      ? "border-amber-500 bg-amber-500/20 text-amber-300"
                      : "border-neutral-700 bg-neutral-950 text-neutral-400"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 px-4 py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Generate"}
        </button>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>

      {result && (
        <section className="mt-8 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl">{name || "(unnamed)"}</h2>
              <p className="italic text-neutral-400">
                <Highlighted text={result.subtitle} />
              </p>
            </div>
            <TierBadge tier={result.tier} />
          </div>

          <ImageGrid
            images={result.images}
            onDownload={(idx) => handleDownload(result.images[idx].dataUrl, idx)}
          />

          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm text-neutral-400">Lore</label>
              <button onClick={handleCopyText} className="text-xs text-amber-400 underline underline-offset-2">
                Copy name + subtitle + lore
              </button>
            </div>
            <p className="whitespace-pre-wrap rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-sm leading-relaxed text-neutral-200">
              <Highlighted text={result.lore} />
            </p>
          </div>

          <button
            onClick={handleAddToCatalog}
            className="mt-5 w-full rounded-lg border border-amber-500 px-4 py-2 text-amber-400 hover:bg-amber-500/10"
          >
            {saved ? "Added to catalog ✓" : "Add to catalog"}
          </button>
        </section>
      )}
    </main>
  );
}
