import { NextResponse } from "next/server";
import { callChat } from "@/lib/openrouter";
import { buildNamePrompt, buildDescriptionPrompt } from "@/lib/lore";
import { parseLlmJson } from "@/lib/parseLlmJson";

export async function POST(req) {
  try {
    const { kind, tier, name, description, archetype } = await req.json();
    const safeTier = ["normal", "legend", "myth"].includes(tier) ? tier : "normal";
    const archetypeLine = archetype?.trim()
      ? `Archetype seed — build the character around this concept, weaving it into the Relics universe (don't just restate it verbatim): ${archetype.trim()}`
      : null;

    if (kind === "name") {
      const system = buildNamePrompt();
      const user = [
        `Tier: ${safeTier}`,
        archetypeLine,
        description?.trim()
          ? `Existing character description for context:\n${description.trim()}`
          : `No description given yet — invent freely within the universe.`,
      ]
        .filter(Boolean)
        .join("\n");

      const raw = await callChat(
        [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        { temperature: 1.1 }
      );
      const parsed = parseLlmJson(raw);
      return NextResponse.json({ name: parsed.name || "" });
    }

    if (kind === "description") {
      const system = buildDescriptionPrompt();
      const draft = description?.trim();
      const user = [
        `Tier: ${safeTier}`,
        // Only inject the archetype seed when inventing fresh — an
        // existing draft should be improved on its own terms, not pulled
        // toward an unrelated random concept.
        !draft ? archetypeLine : null,
        name?.trim() ? `Character name: ${name.trim()}` : `No name given yet — invent freely within the universe.`,
        draft
          ? `The user already wrote this draft description — rewrite and improve it per your instructions:\n${draft}`
          : `No draft provided — invent a new character concept freely.`,
      ]
        .filter(Boolean)
        .join("\n");

      const raw = await callChat(
        [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        { temperature: 1.1 }
      );
      const parsed = parseLlmJson(raw);
      return NextResponse.json({ description: parsed.description || "" });
    }

    return NextResponse.json({ error: "Invalid kind." }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Idea generation failed." }, { status: 500 });
  }
}
