const TIER_STYLES = {
  dark: {
    normal: "text-slate-300",
    legend: "text-violet-400",
    myth: "text-amber-400",
  },
  light: {
    normal: "text-slate-600",
    legend: "text-violet-700",
    myth: "text-amber-700",
  },
};

export default function TierBadge({ tier, onLight = false }) {
  const styles = onLight ? TIER_STYLES.light : TIER_STYLES.dark;

  return (
    <span className={`font-display text-sm font-semibold uppercase tracking-wider ${styles[tier] || styles.normal}`}>
      {tier}
    </span>
  );
}
