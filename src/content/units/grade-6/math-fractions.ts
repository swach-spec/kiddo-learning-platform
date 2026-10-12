import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, Q, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g6-math-fractions",
  grade: 6,
  subject: "mathematics",
  skill: "fractions_decimals",
  strand: "Numbers",
  subStrand: "Fractions",
  concept: "adding and subtracting fractions using LCM, mixed numbers, reciprocals and percentages",
};

type F = { n: number; d: number };

function gcd(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

function simplify(f: F): F {
  const g = gcd(f.n, f.d);
  return { n: f.n / g, d: f.d / g };
}

/** Writes a fraction in simplest form, as a mixed number when it is improper: "1 3/4". */
function show(f: F): string {
  const s = simplify(f);
  if (s.d === 1) return String(s.n);
  if (s.n > s.d) return `${Math.floor(s.n / s.d)} ${s.n % s.d}/${s.d}`;
  return `${s.n}/${s.d}`;
}

/** Keeps only distractors whose VALUE differs from the answer, so no option is "also right". */
function distinctByValue(answer: string, candidates: string[], count = 3): string[] {
  const value = (text: string) => { const f = frac(text.replace(/ m$/, "")); return f.n / f.d; };
  const target = value(answer);
  const out: string[] = [];
  for (const candidate of candidates) {
    if (Math.abs(value(candidate) - target) > 1e-9 && !out.some((item) => Math.abs(value(item) - value(candidate)) < 1e-9)) out.push(candidate);
    if (out.length === count) break;
  }
  return out;
}

const frac = (text: string): F => {
  const parts = text.trim().split(" ");
  if (parts.length === 2) {
    const [whole, rest] = parts;
    const [n, d] = rest.split("/").map(Number);
    return { n: Number(whole) * d + n, d };
  }
  const [n, d] = text.split("/").map(Number);
  return { n, d: d ?? 1 };
};

function op(a: string, b: string, sign: "+" | "−"): Q {
  const x = frac(a);
  const y = frac(b);
  const denominator = lcm(x.d, y.d);
  const xn = x.n * (denominator / x.d);
  const yn = y.n * (denominator / y.d);
  const result: F = { n: sign === "+" ? xn + yn : xn - yn, d: denominator };
  const answer = show(result);
  // Typical mistakes: adding/subtracting tops and bottoms; doing the opposite operation; being one part out.
  const topsAndBottoms = show({ n: Math.max(1, sign === "+" ? x.n + y.n : Math.abs(x.n - y.n)), d: x.d + y.d });
  const opposite = show({ n: Math.abs(sign === "+" ? xn - yn : xn + yn), d: denominator });
  const onePartMore = show({ n: result.n + 1, d: denominator });
  const onePartLess = show({ n: Math.max(1, result.n - 1), d: denominator });
  return {
    prompt: `${a} ${sign} ${b} = ?`,
    answer,
    wrong: distinctByValue(answer, [topsAndBottoms, opposite, onePartMore, onePartLess]),
    why: `The LCM of ${x.d} and ${y.d} is ${denominator}. ${a} = ${xn}/${denominator} and ${b} = ${yn}/${denominator}. ${xn} ${sign} ${yn} = ${result.n}, so the answer is ${result.n}/${denominator} = ${answer}.`,
    working: { kind: "fraction", op: sign, a, b },
  };
}

function reciprocal(text: string): Q {
  const f = frac(text);
  // Reciprocals are written as improper fractions (8/3), or a whole number when the numerator is 1.
  const answer = f.n === 1 ? String(f.d) : `${f.d}/${f.n}`;
  return {
    prompt: `What is the reciprocal of ${text}?`,
    answer,
    wrong: distinctByValue(answer, [text, `1/${f.d}`, `${f.n}/${f.d + f.n}`, `${f.d}/${f.n + 1}`]),
    why: `To find the reciprocal, turn the fraction upside down: ${text} → ${answer}. Check: ${text} × ${answer} = 1.`,
  };
}

function squareOf(text: string): Q {
  const f = frac(text);
  const answer = show({ n: f.n * f.n, d: f.d * f.d });
  return {
    prompt: `What is (${text})²?`,
    answer,
    wrong: distinctByValue(answer, [`${f.n * 2}/${f.d * 2}`, `${f.n * f.n}/${f.d}`, `${f.n}/${f.d * f.d}`, `${f.n * 2}/${f.d * f.d}`]),
    why: `Square the top and the bottom: ${f.n}² / ${f.d}² = ${f.n * f.n}/${f.d * f.d}.`,
  };
}

function toPercent(text: string): Q {
  const f = frac(text);
  const percent = (f.n / f.d) * 100;
  const answer = `${percent}%`;
  return {
    prompt: `Express ${text} as a percentage.`,
    answer,
    wrong: distinct(answer, [`${f.n}${f.d}%`, `${f.d}%`, `${percent / 10}%`, `${percent * 2}%`]),
    why: `Multiply by 100%: ${text} × 100% = ${answer}.`,
  };
}

function fromPercent(percent: number): Q {
  const answer = show({ n: percent, d: 100 });
  return {
    prompt: `Write ${percent}% as a fraction in its simplest form.`,
    answer,
    wrong: distinctByValue(answer, [`1/${percent}`, show({ n: 100 - percent, d: 100 }), `${percent}/10`, show({ n: percent, d: 1000 })]),
    why: `${percent}% means ${percent}/100. Simplified, that is ${answer}.`,
  };
}

export const g6MathFractions: LearningUnit = {
  id: meta.unitId,
  grade: 6,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Add and subtract fractions and mixed numbers using LCM.",
    "Identify reciprocals of proper fractions and work out squares of fractions.",
    "Express a fraction as a percentage and convert a percentage to a fraction.",
  ],
  source: { document: "KICD Grade 6 Mathematics curriculum design", subStrand: "1.4 Fractions", verified: true },
  title: "Fractions",
  description: "Add and subtract fractions with different denominators, and turn fractions into percentages.",
  icon: "🍕",
  skill: "fractions_decimals",
  lesson: {
    id: "g6-math-fractions-lesson",
    subject: "mathematics",
    grade: 6,
    title: "Fractions",
    subtitle: "Use the LCM to add and subtract fractions.",
    skill: "fractions_decimals",
    icon: "🍕",
    estimatedMinutes: 8,
    xp: 20,
    steps: [
      { id: "g6fr-teach", type: "teach", title: "Same-sized pieces", body: "You can only add or subtract fractions when the pieces are the same size, which means the same denominator. Use the LCM (lowest common multiple) of the denominators." },
      { id: "g6fr-example", type: "example", title: "Adding with the LCM", body: "1/4 + 1/6. The LCM of 4 and 6 is 12. 1/4 = 3/12 and 1/6 = 2/12. 3/12 + 2/12 = 5/12.", example: "1/4 + 1/6 = 5/12", explanation: "Change both fractions to twelfths, then add the tops.", working: { kind: "fraction", op: "+", a: "1/4", b: "1/6" } },
      { id: "g6fr-try", type: "try", title: "Try it", body: "What is 2/3 + 1/4?", options: ["11/12", "3/7", "3/12"], correctOption: "11/12", explanation: "LCM is 12: 8/12 + 3/12 = 11/12." },
      { id: "g6fr-example-2", type: "example", title: "Fractions as percentages", body: "To change a fraction to a percentage, multiply by 100%. 3/4 × 100% = 75%.", example: "3/4 = 75% • 1/5 = 20%", explanation: "Per cent means 'out of 100'." },
      { id: "g6fr-try-2", type: "try", title: "Try it", body: "What is the reciprocal of 3/8?", options: ["8/3", "3/8", "1/8"], correctOption: "8/3", explanation: "Turn it upside down: 8/3. Check: 3/8 × 8/3 = 1." },
      { id: "g6fr-master", type: "master", title: "Ready to practise?", body: "You can add and subtract fractions using the LCM and change fractions to percentages. Let's practise." },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      op("1/5", "2/5", "+"),
      op("5/7", "2/7", "−"),
      { prompt: "What is the LCM of 4 and 6?", answer: "12", wrong: ["24", "2", "10"], why: "Multiples of 4: 4, 8, 12. Multiples of 6: 6, 12. The lowest common one is 12." },
      { prompt: "Which fraction is the same as 1/2?", answer: "3/6", wrong: ["2/3", "1/4", "2/6"], why: "Multiply top and bottom by 3: 1/2 = 3/6." },
      toPercent("1/2"),
      reciprocal("1/4"),
    ]),
    guided: bank(meta, "guided", [
      op("1/3", "1/6", "+"),
      op("3/4", "1/8", "+"),
      op("5/6", "1/4", "−"),
      op("2/5", "1/3", "+"),
      op("7/8", "1/2", "−"),
      reciprocal("2/7"),
      toPercent("3/5"),
      fromPercent(25),
    ]),
    independent: bank(meta, "independent", [
      op("3/4", "2/3", "+"),
      op("4/5", "3/10", "−"),
      op("1 1/2", "2 1/3", "+"),
      op("3 3/4", "1 5/6", "−"),
      reciprocal("5/12"),
      squareOf("2/15"),
      toPercent("7/20"),
      fromPercent(60),
    ]),
    apply: bank(meta, "apply", [
      { prompt: "Wanjiku ate 1/4 of a cake and her brother ate 1/3. What fraction did they eat altogether?", answer: "7/12", wrong: ["2/7", "1/12", "5/12"], why: "LCM of 4 and 3 is 12: 3/12 + 4/12 = 7/12.", working: { kind: "fraction", op: "+", a: "1/4", b: "1/3" } },
      { prompt: "A tank was 5/6 full. 1/3 of the tank was used. What fraction is left?", answer: "1/2", wrong: ["4/3", "4/6", "1/6"], why: "1/3 = 2/6. 5/6 − 2/6 = 3/6 = 1/2.", working: { kind: "fraction", op: "−", a: "5/6", b: "1/3" } },
      { prompt: "A farmer planted maize on 2 1/4 acres and beans on 1 2/3 acres. How many acres altogether?", answer: "3 11/12", wrong: ["3 3/7", "3 1/2", "4 1/12"], why: "2 1/4 = 2 3/12 and 1 2/3 = 1 8/12. Add: 3 11/12 acres.", working: { kind: "fraction", op: "+", a: "2 1/4", b: "1 2/3" } },
      { prompt: "In a class, 3/5 of the pupils are girls. What percentage are girls?", answer: "60%", wrong: ["35%", "3.5%", "40%"], why: "3/5 × 100% = 60%." },
      { prompt: "A shop gives a discount of 20%. What fraction of the price is the discount?", answer: "1/5", wrong: ["1/20", "1/4", "4/5"], why: "20% = 20/100 = 1/5." },
      { prompt: "Otieno ran 3 1/2 km and walked 1 3/4 km. How much further did he run than walk?", answer: "1 3/4 km", wrong: ["2 1/4 km", "1 1/4 km", "5 1/4 km"], why: "3 1/2 = 3 2/4. 3 2/4 − 1 3/4 = 1 3/4 km.", working: { kind: "fraction", op: "−", a: "3 1/2", b: "1 3/4" } },
    ]),
    mastery: bank(meta, "mastery", [
      op("5/8", "1/6", "+"),
      op("9/10", "1/4", "−"),
      op("2 2/3", "1 3/4", "+"),
      op("4 1/6", "2 3/4", "−"),
      reciprocal("7/9"),
      squareOf("3/10"),
      toPercent("9/25"),
      fromPercent(75),
      { prompt: "Which is the largest: 2/3, 3/5 or 5/8?", answer: "2/3", wrong: ["3/5", "5/8"], why: "With the LCM 120: 2/3 = 80/120, 3/5 = 72/120, 5/8 = 75/120. So 2/3 is largest." },
      { prompt: "A rope is 4 1/2 m long. 2 2/3 m is cut off. How much is left?", answer: "1 5/6 m", wrong: ["2 1/6 m", "1 1/6 m", "7 1/6 m"], why: "4 1/2 = 4 3/6 and 2 2/3 = 2 4/6. 4 3/6 − 2 4/6 = 1 5/6 m.", working: { kind: "fraction", op: "−", a: "4 1/2", b: "2 2/3" } },
    ]),
  },
};
