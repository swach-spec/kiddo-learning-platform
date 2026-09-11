import Link from "next/link";
import { Player } from "@/lib/kiddo";
import { Story } from "@/types/content";
import { ActivityResult } from "@/types/activity";
import { getTargetedChallenge } from "@/lib/challenge";
import { PlayerAvatar } from "@/components/PlayerAvatar";

type Props = {
  player: Player;
  stories: Story[];
  activityResults: ActivityResult[];
};

export function LearningJourney({ player, stories, activityResults }: Props) {
  const readyStory = stories.find((story) => story.status === "ready");
  const storyDone = readyStory ? player.completedStoryIds.includes(readyStory.id) : false;
  const targeted = getTargetedChallenge(stories, activityResults);
  const challengeReady = storyDone && Boolean(targeted);
  const gamesUnlocked = player.level >= 2;

  const completed = [storyDone, challengeReady, gamesUnlocked].filter(Boolean).length;
  const progress = Math.round((completed / 3) * 100);

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl">
      <div className="border-b border-white/10 bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-cyan-500/10 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <PlayerAvatar avatar={player.avatar} size="sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Your learning journey</p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">Here&apos;s what to do next</h2>
            </div>
          </div>
          <div className="hidden rounded-2xl bg-white/5 px-4 py-3 text-right sm:block">
            <p className="text-xs text-slate-400">Journey progress</p>
            <p className="text-xl font-black">{progress}%</p>
          </div>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
          <JourneyNode
            number="01"
            icon="📚"
            eyebrow="LEARN"
            title={readyStory?.title ?? "Your next lesson"}
            description={readyStory ? `Read, listen and discover ${readyStory.title}.` : "A new lesson is coming soon."}
            state={storyDone ? "done" : readyStory ? "current" : "locked"}
            href={readyStory ? `/story/${readyStory.id}` : undefined}
            action={storyDone ? "Review lesson" : "Start learning"}
          />
          <Connector done={storyDone} />
          <JourneyNode
            number="02"
            icon="🧠"
            eyebrow="PRACTISE"
            title={targeted ? `${targeted.signal.partOfSpeech} Challenge` : "Practice what you learned"}
            description={targeted ? `Use what you learned about ${targeted.signal.word ?? "words"}.` : "Practice activities will appear here as your learning journey grows."}
            state={challengeReady ? "current" : "locked"}
            href={targeted ? `/challenge/${targeted.challenge.id}` : undefined}
            action="Try it"
          />
          <Connector done={challengeReady} />
          <JourneyNode
            number="03"
            icon="⭐"
            eyebrow="PLAY & MASTER"
            title="Earn your next unlock"
            description={gamesUnlocked ? "Your Game Room is ready. Keep learning to unlock more." : "Master your learning and unlock your first games."}
            state={gamesUnlocked ? "current" : "locked"}
            href={gamesUnlocked ? "/games" : undefined}
            action={gamesUnlocked ? "Play Game Room" : "Keep learning"}
          />
        </div>

        <div className="mt-7 rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-5">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-black">KIDDO tip</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Learn first. Then practise. Every step helps you become better before you move to the next adventure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function JourneyNode({
  number,
  icon,
  eyebrow,
  title,
  description,
  state,
  href,
  action,
}: {
  number: string;
  icon: string;
  eyebrow: string;
  title: string;
  description: string;
  state: "done" | "current" | "locked";
  href?: string;
  action: string;
}) {
  const content = (
    <div className={`h-full rounded-[1.75rem] border p-5 transition sm:p-6 ${
      state === "current"
        ? "border-cyan-400/40 bg-cyan-400/10 shadow-lg shadow-cyan-950/20"
        : state === "done"
          ? "border-emerald-400/25 bg-emerald-400/5"
          : "border-white/10 bg-white/[0.03]"
    }`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-black tracking-widest text-slate-500">{number}</span>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className={`mt-5 text-xs font-black tracking-[0.18em] ${state === "current" ? "text-cyan-300" : "text-slate-500"}`}>{eyebrow}</p>
      <h3 className="mt-2 text-xl font-black">{title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className={`text-sm font-bold ${state === "done" ? "text-emerald-300" : state === "current" ? "text-white" : "text-slate-600"}`}>
          {state === "done" ? "✓ Complete" : state === "locked" ? "🔒 Not yet" : action}
        </span>
        {state === "current" && href && <span className="text-lg">→</span>}
      </div>
    </div>
  );

  return state === "current" && href ? <Link href={href} className="block h-full">{content}</Link> : content;
}

function Connector({ done }: { done: boolean }) {
  return (
    <div className="flex items-center justify-center py-2 lg:px-3">
      <div className="flex items-center gap-1 text-slate-700 lg:flex-col">
        <div className={`h-px w-8 lg:h-8 lg:w-px ${done ? "bg-emerald-400/50" : "bg-white/10"}`} />
        <span className={done ? "text-emerald-300" : "text-slate-600"}>{done ? "✓" : "›"}</span>
      </div>
    </div>
  );
}
