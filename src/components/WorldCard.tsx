import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";

export type World = {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  progress: number;
  unlocked: boolean;
  href: string;
};

export function WorldCard({ world }: { world: World }) {
  return (
    <Link
      href={world.unlocked ? world.href : "#"}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 p-5 text-left transition ${
        world.unlocked
          ? "bg-white/5 hover:-translate-y-1 hover:bg-white/10"
          : "cursor-not-allowed bg-white/[0.025] opacity-50"
      }`}
    >
      <div
        className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${world.color} text-3xl shadow-lg`}
      >
        {world.icon}
      </div>

      <h3 className="text-lg font-black">{world.title}</h3>

      <p className="mt-1 text-sm text-slate-400">{world.subtitle}</p>

      {world.unlocked ? (
        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-slate-500">Progress</span>
            <span className="font-bold">{world.progress}%</span>
          </div>

          <ProgressBar progress={world.progress} gradientClassName={world.color} />
        </div>
      ) : (
        <div className="mt-5 text-xs font-bold text-slate-500">
          🚧 Coming soon
        </div>
      )}

      <div className="absolute right-5 top-5 text-slate-600 transition group-hover:text-white">
        →
      </div>
    </Link>
  );
}
