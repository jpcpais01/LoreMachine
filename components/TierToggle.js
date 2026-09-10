"use client";

const TIERS = ["normal", "legend", "myth"];

const TIER_STYLES = {
  normal: "bg-slate-700 border-slate-500 text-slate-100",
  legend: "bg-violet-800 border-violet-400 text-violet-100",
  myth: "bg-amber-700 border-amber-400 text-amber-100",
};

export default function TierToggle({ value, onChange }) {
  function cycle() {
    const idx = TIERS.indexOf(value);
    onChange(TIERS[(idx + 1) % TIERS.length]);
  }

  return (
    <button
      type="button"
      onClick={cycle}
      className={`w-full rounded-lg border-2 px-4 py-3 text-center font-display text-lg tracking-wide uppercase transition-colors ${TIER_STYLES[value]}`}
    >
      {value}
      <span className="ml-2 text-xs opacity-70 normal-case">(click to change · {TIERS.join(" / ")})</span>
    </button>
  );
}
