"use client";

import Link from "next/link";

const subjects = [
  { title: "English Revision", subtitle: "Grammar, vocabulary & reading", icon: "📖", href: "/challenge/demo-adjective-describing-word", label: "Revise English" },
  { title: "Maths Revision", subtitle: "Numbers, operations & problem solving", icon: "🔢", href: "/number-world-cbc", label: "Revise Maths" },
];

export default function PracticePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm font-bold text-slate-400 hover:text-white">← Home</Link>
        <header className="mt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">Revision room</p>
          <h1 className="mt-2 text-4xl font-black">Practice</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Revise skills you have already learned. Practice is for strengthening memory and confidence, not replacing your learning journey.</p>
        </header>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {subjects.map((subject) => (
            <Link key={subject.title} href={subject.href} className="group rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:bg-white/[0.07]">
              <div className="flex items-start justify-between"><span className="text-3xl">{subject.icon}</span><span className="text-white/30 group-hover:text-white">→</span></div>
              <h2 className="mt-5 text-lg font-black">{subject.title}</h2>
              <p className="mt-1 text-sm text-slate-400">{subject.subtitle}</p>
              <span className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 text-xs font-black text-slate-900">{subject.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
