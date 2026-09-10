import { NextResponse } from "next/server";
import { callChat, generateImage } from "@/lib/openrouter";
import { buildSystemPrompt } from "@/lib/lore";
import { buildImagePrompt } from "@/lib/artStyle";
import { parseLlmJson } from "@/lib/parseLlmJson";

export const maxDuration = 120;

export async function POST(req) {
  try {
    const { name, description, tier, count, language } = await req.json();

    if (!description || !description.trim()) {
      return NextResponse.json({ error: "A character description is required." }, { status: 400 });
    }

    const safeTier = ["normal", "legend", "myth"].includes(tier) ? tier : "normal";
    const safeCount = Math.min(3, Math.max(1, Number(count) || 3));
    const safeLanguage = language === "pt" ? "pt" : "en";

    const system = buildSystemPrompt(safeLanguage);
    const user = [
      `Character name: ${name?.trim() || "(unnamed)"}`,
      `Tier: ${safeTier}`,
      `Output language for subtitle/lore: ${safeLanguage === "pt" ? "European Portuguese" : "English"}`,
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

    // Generate the first image alone, then use it as a visual reference for
    // the rest so the character stays consistent across variations.
    const [firstPrompt, ...restPrompts] = imagePrompts;
    const firstDataUrl = await generateImage(buildImagePrompt(firstPrompt, safeTier), { aspectRatio: "3:4" });
    const images = [{ prompt: firstPrompt, dataUrl: firstDataUrl }];

    if (restPrompts.length > 0) {
      const rest = await Promise.all(
        restPrompts.map(async (prompt) => {
          const finalPrompt = buildImagePrompt(prompt, safeTier);
          const dataUrl = await generateImage(finalPrompt, {
            aspectRatio: "3:4",
            referenceImages: [firstDataUrl],
          });
          return { prompt, dataUrl };
        })
      );
      images.push(...rest);
    }

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
