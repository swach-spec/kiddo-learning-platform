"use client";

import Link from "next/link";

const paths = [
  { title: "Grammar", subtitle: "Stories, words & language", icon: "📖", href: "/story", label: "Story Forest" },
  { title: "STEM", subtitle: "Numbers, patterns & solving", icon: "🔢", href: "/number-world-cbc", label: "Number World" },
  { title: "Game World", subtitle: "Play, unlock & master", icon: "🎮", href: "/games", label: "Game Room" },
  { title: "Practice", subtitle: "Revise English & Maths", icon: "🧠", href: "/practice", label: "Revision" },
];

export function AdventurePaths() {
  return (
    <section className="mt-5 rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-300">Choose your path</p>
          <h3 className="mt-1 text-lg font-black">Where will you go?</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {paths.map((path) => (
          <Link
            key={path.title}
            href={path.href}
            className="group rounded-2xl border border-white/10 bg-white/[0.045] p-3 transition hover:-translate-y-0.5 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-yellow-300/60"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">{path.icon}</span>
              <span className="text-xs text-white/30 transition group-hover:text-white/70">→</span>
            </div>
            <p className="mt-2 text-sm font-black">{path.title}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-400">{path.subtitle}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
