"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Player } from "@/lib/kiddo";
import { getPlayers, setCurrentPlayer } from "@/lib/player";
import { getAccount, isLoggedIn, logout } from "@/lib/auth";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { WordHelper } from "@/components/WordHelper";

const AVATARS = ["🧑🏾‍🚀", "👧🏾‍🚀", "👦🏾‍🚀", "🧒🏾‍🚀", "🦸🏾‍♂️", "🦸🏾‍♀️", "🧙🏾‍♂️", "🧙🏾‍♀️"];
const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];

function createExplorer(name: string, grade: string, avatar: string): Player {
  return {
    id: `player-${Date.now()}`,
    name: name.trim(),
    avatar,
    grade,
    level: 1,
    xp: 0,
    streak: 0,
    storiesCompleted: 0,
    badges: 0,
    completedStoryIds: [],
  };
}

export default function PlayersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("Grade 3");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState("");
  const [familyName, setFamilyName] = useState("");

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setPlayers(getPlayers());
    setFamilyName(getAccount()?.familyName ?? "");
    if (searchParams.get("welcome")) setShowCreate(true);
  }, [router, searchParams]);

  function selectPlayer(player: Player) {
    setCurrentPlayer(player);
    router.push("/");
  }

  function addExplorer() {
    setError("");
    if (!name.trim()) {
      setError("Give your explorer a name first.");
      return;
    }

    const explorer = createExplorer(name, grade, avatar);
    const nextPlayers = [...players, explorer];
    window.localStorage.setItem("kiddo-players", JSON.stringify(nextPlayers));
    setPlayers(nextPlayers);
    setName("");
    setShowCreate(false);
    selectPlayer(explorer);
  }

  function signOut() {
    logout();
    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-2xl shadow-xl">⭐</div>
            <div><h1 className="text-2xl font-black">KIDDO</h1><p className="text-xs text-slate-500">Learn • Play • Discover</p></div>
          </div>
          <div className="flex items-center gap-2">
            {familyName && <span className="hidden rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 sm:block">🏠 {familyName}</span>}
            <button onClick={signOut} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-400 transition hover:bg-white/10 hover:text-white">Log out</button>
          </div>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">{familyName ? `Welcome, ${familyName}` : "Welcome"}</p>
            <h2 className="mt-2 text-4xl font-black sm:text-5xl">Who&apos;s playing?</h2>
            <p className="mt-3 text-slate-400">Choose your explorer and continue their adventure.</p>
          </div>

          <div className="mt-10 grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {players.map((player) => (
              <button key={player.id} onClick={() => selectPlayer(player)} className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center transition duration-200 hover:-translate-y-2 hover:border-emerald-400/50 hover:bg-white/10">
                <div className="mx-auto transition group-hover:scale-110"><PlayerAvatar avatar={player.avatar} size="lg" /></div>
                <h3 className="mt-5 text-2xl font-black">{player.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{player.grade}</p>
                <div className="mt-5 rounded-2xl bg-black/20 p-4">
                  <div className="flex items-center justify-between text-xs"><span className="text-slate-500">LEVEL</span><span className="font-black text-yellow-400">{player.level}</span></div>
                  <div className="mt-2 flex items-center justify-between text-xs"><span className="text-slate-500">XP</span><span className="font-bold">⭐ {player.xp}</span></div>
                </div>
                <div className="mt-4 text-sm font-black text-emerald-400 opacity-0 transition group-hover:opacity-100">Continue Adventure →</div>
              </button>
            ))}

            <button onClick={() => setShowCreate(true)} className="group min-h-[260px] rounded-[2rem] border border-dashed border-white/20 bg-white/[0.02] p-6 text-center transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-white/5">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-slate-600 text-4xl text-slate-500 transition group-hover:border-cyan-400 group-hover:text-cyan-400">＋</div>
              <h3 className="mt-5 text-xl font-black">New Explorer</h3>
              <p className="mt-1 text-sm text-slate-500">Create a path of your own</p>
            </button>
          </div>

          {showCreate && (
            <div className="mt-8 w-full max-w-xl rounded-[2rem] border border-cyan-400/20 bg-cyan-400/5 p-6 shadow-2xl sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-cyan-400">New explorer</p><h3 className="mt-1 text-2xl font-black">Build your character</h3></div><button onClick={() => setShowCreate(false)} className="rounded-full bg-white/10 px-3 py-1 text-slate-400">✕</button></div>
              <label className="mt-6 block"><span className="mb-2 block text-sm font-bold text-slate-300">Explorer name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none focus:border-cyan-400" /></label>
              <div className="mt-5"><span className="mb-2 block text-sm font-bold text-slate-300">Choose an avatar</span><div className="grid grid-cols-4 gap-3">{AVATARS.map((item) => <button key={item} onClick={() => setAvatar(item)} className={`rounded-2xl border p-3 text-3xl transition ${avatar === item ? "border-cyan-400 bg-cyan-400/15" : "border-white/10 bg-black/20 hover:bg-white/10"}`}>{item}</button>)}</div></div>
              <label className="mt-5 block"><span className="mb-2 block text-sm font-bold text-slate-300">School grade</span><select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3.5 outline-none focus:border-cyan-400">{GRADES.map((item) => <option key={item}>{item}</option>)}</select></label>
              {error && <p className="mt-4 rounded-2xl bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</p>}
              <button onClick={addExplorer} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5">Start My Adventure 🚀</button>
            </div>
          )}

          <WordHelper className="mt-8" />
        </section>
        <footer className="py-6 text-center text-xs text-slate-600">KIDDO • Every child has an adventure waiting.</footer>
      </div>
    </main>
  );
}
