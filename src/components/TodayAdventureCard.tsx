import Link from "next/link";
import { TodayAdventure, AdventureStep, AdventureStepType } from "@/types/adventure";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

const STEP_ICON: Record<AdventureStepType, string> = {
  reading: "📖",
  practice: "🧠",
  challenge: "🎯",
  reward: "🎁",
};

export function TodayAdventureCard({ adventure }: { adventure: TodayAdventure }) {
  const currentStep = adventure.steps.find((step) => step.status === "available");

  return (
    <Card className="p-7 backdrop-blur sm:p-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            Today&apos;s Adventure
          </p>

          <h2 className="mt-1 text-2xl font-black sm:text-3xl">
            Continue your learning journey
          </h2>
        </div>
      </div>

      {/* Step checklist */}
      <div className="mt-6 flex flex-wrap gap-3">
        {adventure.steps.map((step) => (
          <StepPill key={step.id} step={step} />
        ))}
      </div>

      {/* Current actionable step */}
      <div className="mt-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
        {currentStep ? (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 text-2xl">
                {STEP_ICON[currentStep.type]}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {currentStep.type}
                </p>
                <h3 className="text-lg font-black">{currentStep.title}</h3>
              </div>
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {currentStep.description}
            </p>

            {currentStep.storyId && (
              <Link href={`/story/${currentStep.storyId}`} className="mt-5 block">
                <Button variant="primary" className="w-full sm:w-auto sm:px-8">
                  Continue →
                </Button>
              </Link>
            )}
          </>
        ) : (
          <div className="text-center">
            <div className="text-4xl">✨</div>
            <p className="mt-3 font-black">
              Today&apos;s Adventure complete for now!
            </p>
            <p className="mt-1 text-sm text-slate-400">
              More stories are on their way — check back soon.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

function StepPill({ step }: { step: AdventureStep }) {
  const isComplete = step.status === "completed";
  const isComingSoon = step.status === "coming_soon";

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${
        isComplete
          ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300"
          : isComingSoon
            ? "border-white/10 bg-white/[0.03] text-slate-500"
            : "border-white/10 bg-white/5 text-white"
      }`}
    >
      <span>{isComplete ? "✓" : isComingSoon ? "🚧" : "○"}</span>
      <span>{STEP_ICON[step.type]}</span>
      <span className="capitalize">{step.type}</span>
    </div>
  );
}
