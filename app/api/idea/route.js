import { NextResponse } from "next/server";
import { callChat } from "@/lib/openrouter";
import { buildNamePrompt, buildDescriptionPrompt } from "@/lib/lore";
import { parseLlmJson } from "@/lib/parseLlmJson";

export async function POST(req) {
  try {
    const { kind, tier, name, description } = await req.json();
    const safeTier = ["normal", "legend", "myth"].includes(tier) ? tier : "normal";

    if (kind === "name") {
      const system = buildNamePrompt();
      const user = [
        `Tier: ${safeTier}`,
        description?.trim()
          ? `Existing character description for context:\n${description.trim()}`
          : `No description given yet — invent freely within the universe.`,
      ].join("\n");

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
      const user = [
        `Tier: ${safeTier}`,
        name?.trim() ? `Character name: ${name.trim()}` : `No name given yet — invent freely within the universe.`,
      ].join("\n");

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
