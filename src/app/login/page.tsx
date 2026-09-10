"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createAccount, getAccount, isLoggedIn, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) router.replace("/players");
    else if (!getAccount()) setMode("signup");
  }, [router]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !/^\d{4}$/.test(pin)) {
      setError("Please enter an email and a 4-digit PIN.");
      return;
    }

    if (mode === "signup") {
      if (!familyName.trim()) {
        setError("Please enter a family name.");
        return;
      }
      createAccount(familyName, email, pin);
      router.push("/players?welcome=1");
      return;
    }

    if (!login(email, pin)) {
      setError("That email or PIN does not match this KIDDO account.");
      return;
    }

    router.push("/players");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-8">
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-yellow-300 to-orange-500 text-4xl shadow-2xl shadow-orange-500/20">
            ⭐
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight">KIDDO</h1>
          <p className="mt-2 text-sm font-medium text-slate-400">Learn • Play • Discover</p>
        </div>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              {mode === "signup" ? "Start your adventure" : "Welcome back"}
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {mode === "signup" ? "Create your KIDDO account" : "Log in to KIDDO"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {mode === "signup"
                ? "Set up your family space, then choose an explorer."
                : "Your explorers and their progress are waiting."}
            </p>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-300">Family name</span>
                <input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="e.g. The Kamau Family" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none transition placeholder:text-slate-600 focus:border-emerald-400" />
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="parent@example.com" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 outline-none transition placeholder:text-slate-600 focus:border-emerald-400" />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-slate-300">4-digit PIN</span>
              <input inputMode="numeric" maxLength={4} type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="••••" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-center tracking-[0.5em] outline-none transition placeholder:text-slate-600 focus:border-emerald-400" />
            </label>

            {error && <p className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm font-semibold text-red-300">{error}</p>}

            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-4 font-black text-slate-950 shadow-xl transition hover:-translate-y-0.5 active:translate-y-0">
              {mode === "signup" ? "Create Account →" : "Enter KIDDO →"}
            </button>
          </form>

          <button onClick={() => { setError(""); setMode(mode === "signup" ? "login" : "signup"); }} className="mt-5 w-full text-center text-sm font-bold text-slate-400 transition hover:text-white">
            {mode === "signup" ? "Already have an account? Log in" : "New to KIDDO? Create an account"}
          </button>
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-slate-600">V1 account mode is stored on this device for tomorrow&apos;s family testing. We&apos;ll move this to secure cloud authentication when we add the production backend.</p>
      </div>
    </main>
  );
}
