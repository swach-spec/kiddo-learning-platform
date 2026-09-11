"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdjectiveLesson } from "@/content/lessons/adjectives";
import { LessonFlow } from "@/components/LessonFlow";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { usePlayer } from "@/hooks/usePlayer";
import { getActivityResults, recordActivityResult } from "@/lib/player";

export default function AdjectivesLessonPage() {
  const { player, loading, awardXP } = usePlayer();
  const [completed, setCompleted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!player) {
      window.location.href = "/players";
      return;
    }

    const lesson = getAdjectiveLesson(player.grade as 1 | 2 | 3 | 4 | 5 | 6);
    const alreadyCompleted = getActivityResults(player.id).some(
      (result) => result.activityType === "lesson" && result.activityId === lesson.id
    );
    setCompleted(alreadyCompleted);
    setSaved(alreadyCompleted);
  }, [loading, player]);

  if (loading || !player) return null;

  const grade = Number(player.grade.replace(/\D/g, "")) as 1 | 2 | 3 | 4 | 5 | 6;
  const lesson = getAdjectiveLesson(grade);

  function completeLesson() {
    if (!player || saved) {
      setCompleted(true);
      return;
    }

    recordActivityResult({
      id: crypto.randomUUID(),
      playerId: player.id,
      activityType: "lesson",
      activityId: lesson.id,
      skills: [lesson.skill],
      correct: true,
      attempts: 1,
      hintsUsed: 0,
      xpAwarded: lesson.xp,
      timestamp: new Date().toISOString(),
    });

    awardXP(lesson.xp);
    setSaved(true);
    setCompleted(true);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl hover:bg-white/10"
          >
            ←
          </Link>

          <div className="flex items-center gap-3">
            <PlayerAvatar avatar={player.avatar} size="sm" />
            <div className="hidden sm:block">
              <p className="text-xs text-slate-500">Learning</p>
              <p className="text-sm font-black">{player.name}</p>
            </div>
          </div>
        </header>

        <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">Today&apos;s lesson</p>
            <p className="mt-1 text-sm font-bold">Grade {grade} English</p>
          </div>
          <p className="font-black text-yellow-300">+{lesson.xp} XP</p>
        </div>

        <LessonFlow lesson={lesson} completed={completed} onComplete={completeLesson} />

        {completed && (
          <div className="mt-6 rounded-[2rem] border border-emerald-400/20 bg-emerald-500/10 p-6 text-center">
            <p className="text-sm font-black uppercase tracking-widest text-emerald-300">Lesson complete</p>
            <h2 className="mt-2 text-2xl font-black">Now let&apos;s practise it.</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
              You learned the idea first. Your next step is to use it in a challenge.
            </p>
            <Link
              href={`/challenge/${lesson.challengeId ?? "demo-adjective-describing-word"}`}
              className="mt-5 inline-flex rounded-2xl bg-white px-7 py-4 font-black text-slate-950 hover:bg-yellow-300"
            >
              Start Practice →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
