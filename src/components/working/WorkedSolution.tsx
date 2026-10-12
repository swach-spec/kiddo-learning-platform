"use client";

import { ReactNode, useState } from "react";
import { Working } from "@/types/working";
import { columnWorking, fractionWorking, groupsWorking, longDivision, longMultiplication, placeValueWorking, sharingWorking, Step, stepsFor } from "@/lib/working";

/**
 * Shows HOW to solve a maths question, laid out the way it is written in a
 * Kenyan exercise book, one step at a time. The child taps "Next step"; the
 * active column or row lights up and the explanation for that step appears.
 */
export function WorkedSolution({ working, startOpen = false, title = "See how to solve it" }: { working: Working; startOpen?: boolean; title?: string }) {
  const [open, setOpen] = useState(startOpen);
  const steps = stepsFor(working);
  const [shown, setShown] = useState(1);
  const revealed = Math.min(shown, steps.length);
  const current = steps[revealed - 1];
  const done = revealed >= steps.length;

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-200 transition hover:bg-cyan-300/20">
        🧮 {title}
      </button>
    );
  }

  return (
    <section aria-label="Worked solution" className="mt-5 rounded-3xl border border-cyan-300/20 bg-slate-950/60 p-4 sm:p-6">
      <p className="text-xs font-black uppercase tracking-widest text-cyan-300">🧮 How to solve it</p>
      <div className="mt-4 overflow-x-auto pb-1">
        <div className="mx-auto w-fit max-w-full">
          <Visual working={working} revealed={revealed} steps={steps} />
        </div>
      </div>
      <ol className="mt-5 space-y-2">
        {steps.slice(0, revealed).map((step, index) => (
          <li key={index} className={`flex gap-3 rounded-2xl px-3 py-2 text-sm leading-6 ${index === revealed - 1 ? "bg-cyan-300/10 text-white" : "text-slate-400"}`}>
            <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-black ${index === revealed - 1 ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-300"}`}>{index + 1}</span>
            <span className={step.text.startsWith("Answer") ? "font-black text-emerald-300" : ""}>{step.text}</span>
          </li>
        ))}
      </ol>
      <div className="mt-4 flex flex-wrap gap-3">
        {!done && <button type="button" onClick={() => setShown((value) => value + 1)} className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-200">Next step →</button>}
        {!done && <button type="button" onClick={() => setShown(steps.length)} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">Show all steps</button>}
        {done && <button type="button" onClick={() => setShown(1)} className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5">↺ Watch again</button>}
      </div>
      <span className="sr-only" aria-live="polite">{current?.text}</span>
    </section>
  );
}

const CELL = "flex h-11 w-9 items-center justify-center font-mono text-2xl font-black";

function Visual({ working, revealed, steps }: { working: Working; revealed: number; steps: Step[] }) {
  const focus = new Set(steps[revealed - 1]?.focus ?? []);
  switch (working.kind) {
    case "column": return <ColumnVisual working={working} revealed={revealed} focus={focus} />;
    case "long-multiplication": return <MultiplicationVisual a={working.a} b={working.b} revealed={revealed} focus={focus} />;
    case "long-division": return <DivisionVisual dividend={working.dividend} divisor={working.divisor} revealed={revealed} focus={focus} />;
    case "groups": return <GroupsVisual groups={working.groups} each={working.each} />;
    case "sharing": return <SharingVisual total={working.total} groups={working.groups} />;
    case "place-value": return <PlaceValueVisual value={working.value} place={working.place} focus={focus} />;
    case "fraction": return <FractionVisual op={working.op} a={working.a} b={working.b} revealed={revealed} total={steps.length} />;
  }
}

// ── Column addition / subtraction ──
function ColumnVisual({ working, revealed, focus }: { working: Extract<Working, { kind: "column" }>; revealed: number; focus: Set<number> }) {
  const w = columnWorking(working.op, working.top, working.bottom, working.decimals ?? 0);
  const columnSteps = w.steps.length - 1;
  const doneColumns = Math.min(revealed, columnSteps);
  const index = (c: number) => w.width - 1 - c; // column index → place from the right
  const pointAfter = w.decimals ? w.width - w.decimals - 1 : -1;
  const cells = (row: (number | string | null)[], render: (value: number | string | null, c: number) => ReactNode, showPoint = true) =>
    row.flatMap((value, c) => {
      const cell = <div key={c} className={`${CELL} rounded-lg ${focus.has(index(c)) ? "bg-cyan-300/20" : ""}`}>{render(value, c)}</div>;
      return c === pointAfter ? [cell, <div key={`p${c}`} className="flex h-11 w-3 items-end justify-center pb-1 text-2xl font-black">{showPoint ? "." : ""}</div>] : [cell];
    });
  return (
    <div className="inline-grid gap-y-1">
      <div className="flex"><div className="w-8" />{cells(w.marks, (mark, c) => (mark && w.markStep[c] !== null && (w.markStep[c] as number) < revealed ? <span className="text-sm text-yellow-300">{mark}</span> : null), false)}</div>
      <div className="flex"><div className="w-8" />{cells(w.top, (d, c) => (d === null ? null : <span className={w.crossed[c] && w.markStep[c] !== null && (w.markStep[c] as number) < revealed ? "text-slate-500 line-through decoration-red-400 decoration-2" : "text-white"}>{d}</span>))}</div>
      <div className="flex"><div className={`${CELL} w-8 text-cyan-300`}>{working.op}</div>{cells(w.bottom, (d) => <span className="text-white">{d}</span>)}</div>
      <div className="ml-8 border-t-2 border-white/60" />
      <div className="flex"><div className="w-8" />{cells(w.result, (d, c) => (d !== null && index(c) < doneColumns ? <span className="text-emerald-300">{d}</span> : null))}</div>
      <div className="ml-8 border-t-2 border-white/60" />
      {working.unit && <p className="mt-1 text-center text-xs text-slate-400">{working.unit}</p>}
    </div>
  );
}

// ── Long multiplication ──
function MultiplicationVisual({ a, b, revealed, focus }: { a: number; b: number; revealed: number; focus: Set<number> }) {
  const w = longMultiplication(a, b);
  return (
    <div className="inline-grid gap-y-1">
      {w.rows.map((row, r) => {
        const visible = r < 2 || r - 2 < revealed;
        return (
          <div key={r}>
            {row.ruleAbove && <div className="border-t-2 border-white/60" />}
            <div className={`flex items-center rounded-lg ${focus.has(r) ? "bg-cyan-300/20" : ""}`}>
              {row.cells.map((cell, c) => <div key={c} className={`${CELL} ${cell === "×" ? "text-cyan-300" : r >= 2 ? "text-emerald-300" : "text-white"}`}>{visible ? cell : ""}</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Long division ──
function DivisionVisual({ dividend, divisor, revealed, focus }: { dividend: number; divisor: number; revealed: number; focus: Set<number> }) {
  const w = longDivision(dividend, divisor);
  const n = w.dividendDigits.length;
  // A row is visible once a revealed step has focused on it (or on a later row).
  const lastRow = Math.max(-1, ...[...Array(revealed).keys()].flatMap((i) => longDivisionSteps(w)[i] ?? []));
  const showAll = revealed >= w.steps.length;
  const rowVisible = (r: number) => showAll || r <= lastRow;
  const productRowFor = (i: number) => w.rows.findIndex((row) => row.minus && row.endsAt === i);
  const divisorWidth = String(divisor).length;
  const pad = (text: string, endsAt: number) => {
    const cells: (string | null)[] = Array(n).fill(null);
    text.split("").forEach((ch, k) => { cells[endsAt - text.length + 1 + k] = ch; });
    return cells;
  };
  const gutter = { width: `${divisorWidth * 1.4 + 1.2}rem` };
  const row = (cells: (string | null)[], className: string, key: string | number, highlight = false, minus = false, underline = false) => (
    <div key={key} className={`flex rounded-lg ${highlight ? "bg-cyan-300/20" : ""}`}>
      <div className={`${CELL} justify-end pr-1 text-cyan-300`} style={gutter}>{minus ? "−" : ""}</div>
      {cells.map((cell, c) => <div key={c} className={`${CELL} ${className} ${underline && cell !== null ? "border-b-2 border-white/60" : ""}`}>{cell}</div>)}
    </div>
  );
  return (
    <div className="inline-grid gap-y-1">
      {row(w.quotientCells.map((q, i) => (q !== null && rowVisible(productRowFor(i)) ? q : null)), "text-emerald-300", "q")}
      <div className="flex">
        <div className={`${CELL} justify-end pr-1 text-white`} style={gutter}>{divisor})</div>
        <div className="flex border-t-2 border-white/70">{w.dividendDigits.map((d, c) => <div key={c} className={`${CELL} text-white`}>{d}</div>)}</div>
      </div>
      {w.rows.map((r, index) => row(rowVisible(index) ? pad(r.text, r.endsAt) : Array(n).fill(null), r.minus ? "text-slate-300" : "text-white", index, focus.has(index), r.minus && rowVisible(index), Boolean(r.ruleBelow) && rowVisible(index)))}
    </div>
  );
}

function longDivisionSteps(w: ReturnType<typeof longDivision>): number[][] {
  return w.steps.map((step) => step.focus ?? []);
}

// ── Groups and sharing ──
function Dots({ count, tone }: { count: number; tone: string }) {
  return <div className="grid grid-cols-5 gap-1">{Array.from({ length: count }, (_, i) => <span key={i} className={`h-3 w-3 rounded-full ${tone}`} />)}</div>;
}

function GroupsVisual({ groups, each }: { groups: number; each: number }) {
  const w = groupsWorking(groups, each);
  return (
    <div className="flex w-[17rem] max-w-full flex-wrap justify-center gap-2">
      {Array.from({ length: Math.min(groups, 10) }, (_, g) => (
        <div key={g} className="rounded-xl border border-white/15 bg-white/5 p-2"><Dots count={Math.min(each, 10)} tone="bg-orange-300" /></div>
      ))}
      <p className="w-full text-center font-mono text-base font-black leading-7 text-white">{Array(groups).fill(each).join(" + ")} = <span className="text-emerald-300">{w.total}</span></p>
    </div>
  );
}

function SharingVisual({ total, groups }: { total: number; groups: number }) {
  const w = sharingWorking(total, groups);
  return (
    <div className="flex w-[17rem] max-w-full flex-wrap justify-center gap-2">
      {Array.from({ length: Math.min(groups, 10) }, (_, g) => (
        <div key={g} className="rounded-xl border border-white/15 bg-white/5 p-2 text-center"><Dots count={Math.min(w.each, 10)} tone="bg-sky-300" /><p className="mt-1 text-xs font-black text-slate-300">{w.each}</p></div>
      ))}
      <p className="w-full text-center font-mono text-lg font-black text-white">{total} ÷ {groups} = <span className="text-emerald-300">{w.each}</span></p>
    </div>
  );
}

// ── Place value chart ──
function PlaceValueVisual({ value, place, focus }: { value: number; place?: number; focus: Set<number> }) {
  const w = placeValueWorking(value, place);
  const compact = w.columns.length > 5;
  return (
    <table className="border-separate border-spacing-1 text-center">
      <thead>
        <tr>{w.columns.map((c) => <th key={c.fromRight} className={`rounded-lg ${compact ? "px-1 text-[10px]" : "px-2 text-xs"} py-1 font-black ${focus.has(c.fromRight) ? "bg-cyan-300 text-slate-950" : "bg-white/10 text-slate-300"}`} title={c.name}>{c.short}</th>)}</tr>
      </thead>
      <tbody>
        <tr>{w.columns.map((c) => <td key={c.fromRight} className={`h-12 ${compact ? "w-8 text-xl" : "w-10 text-2xl"} rounded-lg font-mono font-black ${focus.has(c.fromRight) ? "bg-cyan-300/20 text-white" : "text-white"}`}>{c.digit}</td>)}</tr>
        {place !== undefined && focus.has(place) && (
          <tr><td colSpan={w.columns.length} className="pt-2 text-sm font-bold text-emerald-300">{w.columns.find((c) => c.fromRight === place)?.value.toLocaleString("en-US")}</td></tr>
        )}
      </tbody>
      <caption className="max-w-[17rem] caption-bottom pt-2 text-xs text-slate-500">{w.columns.map((c) => `${c.short} = ${c.name}`).join(" · ")}</caption>
    </table>
  );
}

// ── Fractions ──
function Frac({ text, tone = "text-white" }: { text: string; tone?: string }) {
  const parts = text.trim().split(" ");
  const fraction = parts[parts.length - 1];
  const [n, d] = fraction.split("/");
  return (
    <span className={`inline-flex items-center gap-1 font-mono font-black ${tone}`}>
      {parts.length === 2 && <span className="text-2xl">{parts[0]}</span>}
      {d ? <span className="inline-flex flex-col items-center text-lg leading-tight"><span>{n}</span><span className="w-full border-t-2 border-current" /><span>{d}</span></span> : <span className="text-2xl">{n}</span>}
    </span>
  );
}

function FractionVisual({ op, a, b, revealed, total }: { op: "+" | "−"; a: string; b: string; revealed: number; total: number }) {
  const w = fractionWorking(op, a, b);
  const showConverted = revealed >= Math.max(2, total - 3);
  const showResult = revealed >= total - 1;
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-3"><Frac text={a} /><span className="text-2xl font-black text-cyan-300">{op}</span><Frac text={b} /></div>
      {showConverted && <div className="flex items-center justify-center gap-3"><span className="text-xl text-slate-500">=</span><Frac text={w.rows[1].left} tone="text-yellow-200" /><span className="text-2xl font-black text-cyan-300">{op}</span><Frac text={w.rows[1].right} tone="text-yellow-200" /></div>}
      {showResult && <div className="flex items-center justify-center gap-3"><span className="text-xl text-slate-500">=</span><Frac text={w.result} tone="text-slate-300" />{w.answer !== w.result && <><span className="text-xl text-slate-500">=</span><Frac text={w.answer} tone="text-emerald-300" /></>}</div>}
      <p className="text-center text-xs text-slate-500">LCM = {w.lcm}</p>
    </div>
  );
}
