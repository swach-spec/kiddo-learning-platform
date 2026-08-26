import Link from "next/link";
import { Story } from "@/types/content";
import { Button } from "@/components/Button";

type StoryCardProps = {
  story: Story;
  /** Level-based unlock — only meaningful for "ready" stories. */
  unlocked: boolean;
};

export function StoryCard({ story, unlocked }: StoryCardProps) {
  const comingSoon = story.status === "coming_soon";
  const playable = story.status === "ready" && unlocked;

  return (
    <div
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition ${
        playable ? "hover:-translate-y-2 hover:bg-white/10" : "opacity-50"
      }`}
    >
      {/* Illustration */}
      <div
        className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${story.gradient}`}
      >
        <div className="text-8xl transition duration-300 group-hover:scale-110">
          {story.icon}
        </div>

        {comingSoon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-4xl">🚧</div>
              <p className="mt-2 text-sm font-bold">Coming Soon</p>
            </div>
          </div>
        )}

        {!comingSoon && !unlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-4xl">🔒</div>
              <p className="mt-2 text-sm font-bold">
                Unlock at Level {story.unlocksAtLevel}
              </p>
            </div>
          </div>
        )}

        <div className="absolute left-4 top-4 rounded-full bg-black/20 px-3 py-1 text-xs font-bold backdrop-blur">
          {story.levelLabel}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-black">{story.title}</h3>

        <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-400">
          {story.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-500">⏱ {story.estimatedMinutes} min</span>
          <span className="font-bold text-yellow-400">⭐ +{story.xp} XP</span>
        </div>

        {playable ? (
          <Link href={`/story/${story.id}`} className="mt-5 block">
            <Button variant="primary" className="w-full">
              Start Story →
            </Button>
          </Link>
        ) : (
          <Button variant="secondary" className="mt-5 w-full" disabled>
            {comingSoon ? "🚧 Coming Soon" : "🔒 Locked"}
          </Button>
        )}
      </div>
    </div>
  );
}
