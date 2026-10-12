"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { LessonFlow } from "@/components/LessonFlow";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { usePlayer } from "@/hooks/usePlayer";
import { awardXP, getActivityResults, recordActivityResult } from "@/lib/player";
import { getUnit } from "@/content/units";
import { unitNodeId } from "@/lib/unit-path";

/** The "Discover" step of any learning unit: teaches the idea before practice starts. */
export default function UnitLessonPage() {
  const params = useParams<{ unitId: string }>();
  const unitId = Array.isArray(params.unitId) ? params.unitId[0] : params.unitId;
  const unit = getUnit(unitId);
  const { player, loading, refresh } = usePlayer();
  const [justCompleted, setJustCompleted] = useState(false);
  const playerId = player?.id ?? null;
  const lessonNodeId = unitNodeId(unitId, "learn");

  const alreadyCompleted = useMemo(
    () => Boolean(playerId && getActivityResults(playerId).some((result) => result.activityType === "lesson" && result.curriculumNodeId === unitNodeId(unitId, "learn"))),
    [playerId, unitId],
  );

  useEffect(() => {
    if (!loading && !player) window.location.href = "/players";
  }, [loading, player]);

  if (!unit) {
    return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><div className="text-center"><div className="text-6xl">🧭</div><h1 className="mt-6 text-3xl font-black">Lesson not found</h1><Link href="/" className="mt-8 inline-block rounded-2xl bg-white px-7 py-4 font-black text-slate-950">Back Home</Link></div></main>;
  }
  if (loading || !player) return null;

  const activeUnit = unit;
  const activePlayer = player;
  const completed = alreadyCompleted || justCompleted;
  const guidedNodeId = unitNodeId(unit.id, "guided");
  const practiceHref = `/challenge/${encodeURIComponent(`${unit.id}--guided`)}?node=${encodeURIComponent(guidedNodeId)}`;
  const subjectLabel = unit.subject === "mathematics" ? "Maths" : "English";

  function completeLesson() {
    if (!alreadyCompleted) {
      // A deterministic id means the lesson can only ever be recorded (and paid) once.
      const recorded = recordActivityResult({
        id: `lesson:${activePlayer.id}:${activeUnit.id}`,
        playerId: activePlayer.id,
        activityType: "lesson",
        activityId: activeUnit.lesson.id,
        curriculumNodeId: lessonNodeId,
        curriculumId: activeUnit.id,
        strand: activeUnit.strand,
        subStrand: activeUnit.subStrand,
        concept: activeUnit.concept,
        skills: [activeUnit.skill],
        correct: true,
        attempts: 1,
        hintsUsed: 0,
        xpAwarded: activeUnit.lesson.xp,
        timestamp: new Date().toISOString(),
      });
      if (recorded) {
        awardXP(activePlayer.id, activeUnit.lesson.xp);
        refresh();
      }
    }
    setJustCompleted(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl hover:bg-white/10" aria-label="Back home">←</Link>
          <div className="flex items-center gap-3"><PlayerAvatar avatar={player.avatar} size="sm" /><div className="hidden sm:block"><p className="text-xs text-slate-500">Learning</p><p className="text-sm font-black">{player.name}</p></div></div>
        </header>
        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3"><div><p className="text-xs font-black uppercase tracking-widest text-slate-500">Discover</p><p className="mt-1 text-sm font-bold">Grade {unit.grade} {subjectLabel} · {unit.title}</p></div><p className="font-black text-yellow-300">+{unit.lesson.xp} XP</p></div>
        <LessonFlow lesson={unit.lesson} completed={completed} onComplete={completeLesson} practiceHref={practiceHref} />
        {completed && <div className="mt-6 rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6 text-center"><p className="text-sm font-black uppercase tracking-widest text-emerald-300">Lesson complete</p><h2 className="mt-2 text-2xl font-black">Now let&apos;s try it together.</h2><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">You learned the idea first. Next, practise it with some help.</p><Link href={practiceHref} className="mt-5 inline-flex rounded-2xl bg-white px-7 py-4 font-black text-slate-950 hover:bg-yellow-300">Start Practice →</Link></div>}
      </div>
    </main>
  );
}
