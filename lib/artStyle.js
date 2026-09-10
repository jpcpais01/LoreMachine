// The fixed Relics art-direction prompt. Each per-character description
// produced by the LLM is dropped in at the "main_character" line before
// being sent to the image model. Edit the fields below to adjust the style.

const TECHNICAL_INFO =
  "dynamic unique angle, composition and view, borderless, full art, no text overlays no card overlays, 3:4.";

const ART_STYLE =
  "beautiful alive, clean, lightweight, uncluttered, splashart, fun. Unique digital art masterpiece. Digital fantasy concept-art /oil digital illustration style. Perfectly harmonized composition and sizes. Effortless perfect composition of framed elements, there should be space for everything, achieving a great composition and unique angle that increases the feeling of distance and uses to it's advantage to create a more unique composition that utilizes both near and far planes. Nice alive color palette, clean modern digital. Clean sleek surfaces. Not overly intricate art style. Unclutter, more clean. More anime style.";

const NEGATIVE_PROMPT =
  "Micro-texture, high-frequency detail, repetitive destructive micro frequency texture.";

// Short, style-consistent aside per tier — kept brief so it doesn't fight the
// "clean, uncluttered" art direction above.
const TIER_FLAVOR = {
  normal: "a common denizen of their world, grounded presence",
  legend: "an ancient, immensely powerful presence, exuding a legendary aura",
  myth: "an enigmatic, almost unreal presence, an aura of overwhelming mysterious power",
};

export function buildImagePrompt(description, tier) {
  const flavor = TIER_FLAVOR[tier] || TIER_FLAVOR.normal;

  return [
    `type: a TCG card full artwork.`,
    ``,
    `main_character: a magical otherworldly species, very different otherworldly body, ${description} — ${flavor}.`,
    ``,
    `extra_info: fun, beautiful, clean, easy to like`,
    ``,
    `technical_info: ${TECHNICAL_INFO}`,
    ``,
    `art_style: ${ART_STYLE}`,
    ``,
    `avoid: ${NEGATIVE_PROMPT}`,
  ].join("\n");
}
