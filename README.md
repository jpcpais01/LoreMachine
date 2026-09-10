# Relics Generator

A lore & image machine for character concepts in the **Relics** TCG. Describe a
character, pick a tier (Normal / Legend / Myth), and it:

1. Sends your description to an LLM (`google/gemini-3.8-flash` via OpenRouter)
   that knows the Relics universe (planets, regions, tiers) and returns a
   subtitle, up to 500 words of lore, and 1-3 improved image prompts (each a
   different pose/environment).
2. Sends each improved prompt, wrapped in a fixed art-style template, to an
   image model (`openai/gpt-image-2.5-flare` via OpenRouter) at a 3:4 aspect
   ratio.
3. Lets you download any image, copy the full text, and add the character to
   a local catalog.
4. The catalog page (`/catalog`) lays each saved character out on its own
   printable A4 page (image grid + name/subtitle/lore) — use "Print / Save as
   PDF" for a print-ready catalog.

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill in OPENROUTER_API_KEY
npm run dev
```

## Editing the art style

The fixed "art direction" prompt that every generated image is wrapped in
lives in `lib/artStyle.js` (`ART_STYLE_TEMPLATE`). Swap it for your own style
prompt whenever you're ready — nothing else needs to change.

## Editing the lore/universe rules

The system prompt that teaches the LLM about planets, regions, and the
Normal/Legend/Myth tiers lives in `lib/lore.js`. Update it as the game's
canon grows.

## Notes

- The catalog is stored in the browser's IndexedDB (per-browser, not
  synced). Nothing is persisted server-side.
- No API key is bundled; each request reads `OPENROUTER_API_KEY` from the
  server environment.
