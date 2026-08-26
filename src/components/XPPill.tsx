type XPPillProps = {
  xp: number;
  label?: string;
};

/** The "⭐ XP" glass pill used in page headers (Home, Story Forest, reader). */
export function XPPill({ xp, label }: XPPillProps) {
  if (label) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-black">⭐ {xp.toLocaleString()}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
      ⭐ {xp.toLocaleString()} XP
    </div>
  );
}
