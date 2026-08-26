type ProgressBarProps = {
  /** 0-100 */
  progress: number;
  gradientClassName?: string;
};

export function ProgressBar({
  progress,
  gradientClassName = "from-emerald-400 to-green-500",
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradientClassName} transition-all`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
