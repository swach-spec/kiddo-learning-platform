import Link from "next/link";
import { Player } from "@/lib/kiddo";
import { Story } from "@/types/content";
import { ActivityResult } from "@/types/activity";
import { getChallengeById } from "@/lib/challenge";
import { PlayerAvatar } from "@/components/PlayerAvatar";

type Props = {
  player: Player;
  stories: Story[];
  activityResults: ActivityResult[];
};

const LESSON_ID_BY_GRADE: Record<string, string> = {
  "Grade 1": "english-g1-describing-words",
  "Grade 2": "english-g2-describing-words",
  "Grade 3": "english-g3-describing-words",
  "Grade 4": "english-g4-adjectives",
  "Grade 5": "english-g5-adjectives",
  "Grade 6": "english-g6-adjectives",
};

const PRACTICE_ID = "demo-adjective-describing-word";

export function LearningJourney({ player, stories: _stories, activityResults }: Props) {
  const lessonId = LESSON_ID_BY_GRADE[player.grade] ?? LESSON_ID_BY_GRADE["Grade 2"];
  const lessonDone = activityResults.some(
    (result) => result.activityType === "lesson" && result.activityId === lessonId
  );
  const practice = getChallengeById(PRACTICE_ID);
  const practiceDone = activityResults.some(
    (result) => result.activityType === "practice_challenge" && result.activityId === PRACTICE_ID
  );
  const gamesUnlocked = player.level >= 2;

  const completed = [lessonDone, practiceDone, practiceDone, gamesUnlocked].filter(Boolean).length;
  const progress = Math.round((completed / 4) * 100);

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
        <div className="grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          <JourneyNode
            number="01"
            icon="📚"
            eyebrow="LEARN"
            title="Describing Words"
            description="Learn the idea first with examples and a guided activity."
            state={lessonDone ? "done" : "current"}
            href="/learn/adjectives"
            action={lessonDone ? "Review lesson" : "Start learning"}
          />
          <Connector done={lessonDone} />

          <JourneyNode
            number="02"
            icon="🧠"
            eyebrow="PRACTISE"
            title={practice ? "Word Challenge" : "Practice"}
            description="Use the skill you just learned in a short challenge."
            state={practiceDone ? "done" : lessonDone ? "current" : "locked"}
            href={practice ? `/challenge/${practice.id}` : undefined}
            action="Try it"
          />
          <Connector done={practiceDone} />

          <JourneyNode
            number="03"
            icon="⭐"
            eyebrow="MASTER"
            title="Show what you know"
            description={practiceDone ? "You completed your first practice step. Keep building mastery." : "Complete practice to move this step forward."}
            state={practiceDone ? "current" : "locked"}
            href={practiceDone ? "/" : undefined}
            action="See progress"
          />
          <Connector done={gamesUnlocked} />

          <JourneyNode
            number="04"
            icon="🎮"
            eyebrow="PLAY"
            title="Game Room"
            description={gamesUnlocked ? "Play games you have unlocked and keep earning XP." : "Reach Level 2 to unlock your first games."}
            state={gamesUnlocked ? "current" : "locked"}
            href={gamesUnlocked ? "/games" : undefined}
            action={gamesUnlocked ? "Play Game Room" : "🔒 Level 2"}
          />
        </div>

        <div className="mt-7 rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-5">
          <div className="flex items-start gap-4">
            <div className="text-2xl">💡</div>
            <div>
              <p className="font-black">KIDDO tip</p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                You do not need to choose everything. Follow the glowing step and KIDDO will guide you forward.
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
          {state === "done" ? "✓ Complete" : state === "locked" ? action : action}
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
