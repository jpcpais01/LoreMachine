// Renders text where [[Name]] spans are wrapped in a distinct style, matching
// the highlight markup the LLM is instructed to emit around proper nouns.

const HIGHLIGHT_REGEX = /\[\[(.+?)\]\]/g;

export default function Highlighted({ text, highlightClassName = "text-amber-400 font-display font-semibold" }) {
  if (!text) return null;

  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  const regex = new RegExp(HIGHLIGHT_REGEX);

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <span key={key++} className={highlightClassName}>
        {match[1]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));

  return <>{parts}</>;
}
