import { NextResponse } from "next/server";
import { callChat, generateImage } from "@/lib/openrouter";
import { buildSystemPrompt } from "@/lib/lore";
import { buildImagePrompt } from "@/lib/artStyle";

export const maxDuration = 120;

function parseLlmJson(raw) {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  return JSON.parse(cleaned);
}

export async function POST(req) {
  try {
    const { name, description, tier, count } = await req.json();

    if (!description || !description.trim()) {
      return NextResponse.json({ error: "A character description is required." }, { status: 400 });
    }

    const safeTier = ["normal", "legend", "myth"].includes(tier) ? tier : "normal";
    const safeCount = Math.min(3, Math.max(1, Number(count) || 3));

    const system = buildSystemPrompt();
    const user = [
      `Character name: ${name?.trim() || "(unnamed)"}`,
      `Tier: ${safeTier}`,
      `Number of image_prompts variations requested: ${safeCount}`,
      `User's character description:`,
      description.trim(),
    ].join("\n");

    const raw = await callChat([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);

    let parsed;
    try {
      parsed = parseLlmJson(raw);
    } catch {
      throw new Error("Failed to parse the lore model's response as JSON.");
    }

    let imagePrompts = Array.isArray(parsed.image_prompts) ? parsed.image_prompts.filter(Boolean) : [];
    imagePrompts = imagePrompts.slice(0, safeCount);
    if (imagePrompts.length === 0) {
      throw new Error("The lore model did not return any image prompts.");
    }

    const images = await Promise.all(
      imagePrompts.map(async (prompt) => {
        const finalPrompt = buildImagePrompt(prompt, safeTier);
        const dataUrl = await generateImage(finalPrompt, { aspectRatio: "3:4" });
        return { prompt, dataUrl };
      })
    );

    return NextResponse.json({
      name: name?.trim() || "",
      subtitle: parsed.subtitle || "",
      lore: parsed.lore || "",
      tier: safeTier,
      images,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Generation failed." }, { status: 500 });
  }
}
