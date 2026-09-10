const CHAT_URL = "https://openrouter.ai/api/v1/chat/completions";
const IMAGE_URL = "https://openrouter.ai/api/v1/images";

function apiKey() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set on the server.");
  return key;
}

export async function callChat(messages, { temperature = 0.9 } = {}) {
  const res = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-3.8-flash",
      messages,
      temperature,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter chat error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter chat returned no content.");
  return content;
}

export async function generateImage(prompt, { aspectRatio = "3:4", quality = "high", referenceImages = [] } = {}) {
  const body = {
    model: "openai/gpt-image-2.5-flare",
    prompt,
    aspect_ratio: aspectRatio,
    quality,
    n: 1,
  };

  if (referenceImages.length > 0) {
    body.input_references = referenceImages.map((url) => ({
      type: "image_url",
      image_url: { url },
    }));
  }

  const res = await fetch(IMAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter image error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const item = data.data?.[0];
  if (!item?.b64_json) throw new Error("OpenRouter image call returned no image.");
  const mediaType = item.media_type || "image/png";
  return `data:${mediaType};base64,${item.b64_json}`;
}
