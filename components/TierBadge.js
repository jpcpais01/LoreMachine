const TIER_STYLES = {
  normal: "bg-slate-200 text-slate-800 border-slate-400",
  legend: "bg-violet-200 text-violet-900 border-violet-500",
  myth: "bg-amber-200 text-amber-900 border-amber-500",
};

export default function TierBadge({ tier }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${
        TIER_STYLES[tier] || TIER_STYLES.normal
      }`}
    >
      {tier}
    </span>
  );
}
