import { Working } from "@/types/working";

/**
 * Pure calculations behind every worked solution. Each function returns the
 * layout (what to draw) and the numbered steps (what to say), so the visual and
 * the explanation always come from the same arithmetic.
 */

export type Step = { text: string; /** columns (from the right, 0 = ones) or rows to highlight */ focus?: number[] };

const PLACE_NAMES = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands", "millions", "ten millions"];
const PLACE_SHORT = ["O", "T", "H", "Th", "TTh", "HTh", "M", "TM"];

function digitsOf(value: number): number[] {
  return String(Math.abs(value)).split("").map(Number);
}

function fmt(value: number): string {
  return value.toLocaleString("en-US");
}

// ───────────────────────── Column addition / subtraction ─────────────────────────

export type ColumnLayout = {
  width: number;
  op: "+" | "−";
  decimals: number;
  /** Digits right-aligned to `width`; null = empty cell. Index 0 is the LEFTMOST column. */
  top: (number | null)[];
  bottom: (number | null)[];
  result: (number | null)[];
  /** Small numbers written above a column: a carried 1 (addition) or the new regrouped digit (subtraction). */
  marks: (string | null)[];
  /** Subtraction: columns whose top digit was crossed out when regrouping. */
  crossed: boolean[];
  /** For each column, the index of the step that wrote its mark / crossing (so it can appear at the right moment). */
  markStep: (number | null)[];
  steps: Step[];
  answer: string;
};

function pad(digits: number[], width: number): (number | null)[] {
  return [...Array(width - digits.length).fill(null), ...digits];
}

function placeName(fromRight: number, decimals: number): string {
  if (fromRight < decimals) return ["tenths", "hundredths", "thousandths", "ten thousandths"][decimals - 1 - fromRight];
  return PLACE_NAMES[fromRight - decimals];
}

function withPoint(value: number, decimals: number): string {
  if (!decimals) return fmt(value);
  const text = String(value).padStart(decimals + 1, "0");
  return `${text.slice(0, -decimals)}.${text.slice(-decimals)}`;
}

export function columnWorking(op: "+" | "−", top: number, bottom: number, decimals = 0): ColumnLayout {
  const result = op === "+" ? top + bottom : top - bottom;
  const width = Math.max(digitsOf(top).length, digitsOf(bottom).length, digitsOf(result).length);
  const topCells = pad(digitsOf(top), width);
  const bottomCells = pad(digitsOf(bottom), width);
  const resultCells = pad(digitsOf(result), width);
  const marks: (string | null)[] = Array(width).fill(null);
  const crossed: boolean[] = Array(width).fill(false);
  const markStep: (number | null)[] = Array(width).fill(null);
  const steps: Step[] = [];
  const col = (fromRight: number) => width - 1 - fromRight;

  if (op === "+") {
    let carry = 0;
    for (let r = 0; r < width; r += 1) {
      const a = topCells[col(r)] ?? 0;
      const b = bottomCells[col(r)] ?? 0;
      if (topCells[col(r)] === null && bottomCells[col(r)] === null && !carry) break;
      const sum = a + b + carry;
      const parts = [a, b].filter((_, i) => (i === 0 ? topCells[col(r)] : bottomCells[col(r)]) !== null);
      const expression = `${parts.join(" + ")}${carry ? " + 1 (carried)" : ""}`;
      const name = placeName(r, decimals);
      if (parts.length === 0) {
        steps.push({ text: `Write the carried 1 in the ${name} place.`, focus: [r] });
      } else if (sum >= 10) {
        steps.push({ text: `${cap(name)}: ${expression} = ${sum}. Write ${sum % 10} and carry 1 to the ${placeName(r + 1, decimals)}.`, focus: [r] });
        if (r + 1 < width) { marks[col(r + 1)] = "1"; markStep[col(r + 1)] = steps.length - 1; }
      } else {
        steps.push({ text: `${cap(name)}: ${expression} = ${sum}. Write ${sum}.`, focus: [r] });
      }
      carry = sum >= 10 ? 1 : 0;
    }
  } else {
    const working = topCells.map((d) => d ?? 0);
    for (let r = 0; r < width; r += 1) {
      const c = col(r);
      if (topCells[c] === null) break;
      const b = bottomCells[c] ?? 0;
      const name = placeName(r, decimals);
      if (working[c] < b) {
        // Regroup from the next column that has something to lend; zeros on the way become 9.
        let lender = c - 1;
        while (lender >= 0 && working[lender] === 0) lender -= 1;
        working[lender] -= 1;
        crossed[lender] = true;
        marks[lender] = String(working[lender]);
        for (let k = lender + 1; k < c; k += 1) {
          working[k] = 9;
          crossed[k] = true;
          marks[k] = "9";
        }
        working[c] += 10;
        crossed[c] = true;
        marks[c] = String(working[c]);
        for (let k = lender; k <= c; k += 1) markStep[k] = steps.length;
        const from = placeName(width - 1 - lender, decimals);
        steps.push({ text: `${cap(name)}: ${working[c] - 10} is smaller than ${b}, so regroup 1 from the ${from}${lender < c - 1 ? " (the zeros on the way become 9)" : ""}. Now ${working[c]} − ${b} = ${working[c] - b}.`, focus: [r] });
      } else {
        steps.push({ text: `${cap(name)}: ${working[c]} − ${b} = ${working[c] - b}.`, focus: [r] });
      }
    }
  }
  const answer = withPoint(result, decimals);
  steps.push({ text: `Answer: ${withPoint(top, decimals)} ${op} ${withPoint(bottom, decimals)} = ${answer}` });
  // Leading zeros in the result are not written.
  const firstNonZero = resultCells.findIndex((d) => d !== null && d !== 0);
  const integerColumns = width - decimals;
  const cleaned = resultCells.map((d, i) => (i < firstNonZero && i < integerColumns - 1 ? null : d));
  return { width, op, decimals, top: topCells, bottom: bottomCells, result: cleaned, marks, crossed, markStep, steps, answer };
}

function cap(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ───────────────────────── Long multiplication ─────────────────────────

export type MultiplicationLayout = { width: number; rows: { label?: string; cells: (string | null)[]; ruleAbove?: boolean }[]; steps: Step[]; answer: string };

export function longMultiplication(a: number, b: number): MultiplicationLayout {
  const bDigits = digitsOf(b).reverse();
  const partials = bDigits.map((digit, place) => a * digit * 10 ** place);
  const total = a * b;
  const width = Math.max(String(total).length, String(a).length, String(b).length + 1, ...partials.map((p) => String(p).length)) + 1;
  const cellsOf = (value: number, prefix = "") => {
    const text = prefix + String(value);
    return [...Array(width - text.length).fill(null), ...text.split("")];
  };
  const rows: MultiplicationLayout["rows"] = [
    { cells: cellsOf(a) },
    { cells: cellsOf(b, "×") },
    ...partials.map((p, i) => ({ cells: cellsOf(p), ruleAbove: i === 0, label: i === 0 ? `${a} × ${bDigits[0]}` : `${a} × ${bDigits[i]}${"0".repeat(i)}` })),
  ];
  if (partials.length > 1) rows.push({ cells: cellsOf(total), ruleAbove: true, label: "add" });
  const steps: Step[] = partials.map((p, i) => ({
    text: i === 0
      ? `Multiply ${fmt(a)} by the ones digit ${bDigits[0]}: ${fmt(a)} × ${bDigits[0]} = ${fmt(p)}.`
      : `Multiply ${fmt(a)} by the ${PLACE_NAMES[i]} digit ${bDigits[i]}. It stands for ${bDigits[i]}${"0".repeat(i)}, so write ${i === 1 ? "a 0" : `${i} zeros`} on the right first: ${fmt(a)} × ${bDigits[i]}${"0".repeat(i)} = ${fmt(p)}.`,
    focus: [2 + i],
  }));
  if (partials.length > 1) steps.push({ text: `Add the rows: ${partials.map(fmt).join(" + ")} = ${fmt(total)}.`, focus: [rows.length - 1] });
  steps.push({ text: `Answer: ${fmt(a)} × ${fmt(b)} = ${fmt(total)}` });
  return { width, rows, steps, answer: fmt(total) };
}

// ───────────────────────── Long division ─────────────────────────

export type DivisionRow = { /** text right-aligned so that its last character sits under dividend digit `endsAt` */ text: string; endsAt: number; minus?: boolean; ruleBelow?: boolean };
export type DivisionLayout = { divisor: number; dividendDigits: number[]; quotientCells: (string | null)[]; rows: DivisionRow[]; steps: Step[]; quotient: number; remainder: number };

export function longDivision(dividend: number, divisor: number): DivisionLayout {
  const digits = digitsOf(dividend);
  const quotientCells: (string | null)[] = Array(digits.length).fill(null);
  const rows: DivisionRow[] = [];
  const steps: Step[] = [];
  let current = 0;
  let started = false;
  let remainder = 0;
  for (let i = 0; i < digits.length; i += 1) {
    current = current * 10 + digits[i];
    if (!started && current < divisor && i < digits.length - 1) continue;
    if (!started && i > 0) {
      steps.push({ text: `${digits.slice(0, i).join("")} is smaller than ${divisor}, so start with the first ${i + 1} digits: ${current}.` });
    }
    if (started) {
      // The remainder with the next digit brought down beside it.
      rows.push({ text: String(current), endsAt: i });
      steps.push({ text: `Bring down the ${digits[i]} to make ${current}.`, focus: [rows.length - 1] });
    }
    const q = Math.floor(current / divisor);
    const product = q * divisor;
    remainder = current - product;
    quotientCells[i] = String(q);
    rows.push({ text: String(product), endsAt: i, minus: true, ruleBelow: true });
    steps.push({
      text: q === 0
        ? `${divisor} does not go into ${current}, so write 0 on top.`
        : `How many ${divisor}s in ${current}? ${q}, because ${q} × ${divisor} = ${product}. Write ${q} on top, then ${current} − ${product} = ${remainder}.`,
      focus: [rows.length - 1],
    });
    current = remainder;
    started = true;
  }
  rows.push({ text: String(remainder), endsAt: digits.length - 1 });
  const quotient = Math.floor(dividend / divisor);
  steps.push({ text: remainder ? `Answer: ${fmt(dividend)} ÷ ${divisor} = ${fmt(quotient)} remainder ${remainder}` : `Answer: ${fmt(dividend)} ÷ ${divisor} = ${fmt(quotient)}. Check: ${fmt(quotient)} × ${divisor} = ${fmt(dividend)}.` });
  return { divisor, dividendDigits: digits, quotientCells, rows, steps, quotient, remainder };
}

// ───────────────────────── Groups and sharing (lower primary) ─────────────────────────

export function groupsWorking(groups: number, each: number) {
  const total = groups * each;
  const steps: Step[] = [
    { text: `${groups} × ${each} means ${groups} groups of ${each}.` },
    { text: `Add ${each}, ${groups} times: ${Array(groups).fill(each).join(" + ")} = ${total}.` },
    { text: `Answer: ${groups} × ${each} = ${total}` },
  ];
  return { groups, each, total, steps };
}

export function sharingWorking(total: number, groups: number) {
  const each = Math.floor(total / groups);
  const chain: string[] = [];
  let left = total;
  while (left >= each && each > 0 && chain.length < groups) {
    chain.push(`${left} − ${each} = ${left - each}`);
    left -= each;
  }
  const steps: Step[] = [
    { text: `Share ${total} equally into ${groups} groups.` },
    { text: `Each group gets ${each}. Check by taking away ${each} again and again: ${chain.join(", ")}. That is ${groups} times.` },
    { text: `Answer: ${total} ÷ ${groups} = ${each}` },
  ];
  return { total, groups, each, steps };
}

// ───────────────────────── Place value chart ─────────────────────────

export function placeValueWorking(value: number, place?: number) {
  const digits = digitsOf(value);
  const columns = digits.map((digit, index) => {
    const fromRight = digits.length - 1 - index;
    return { digit, fromRight, short: PLACE_SHORT[fromRight], name: PLACE_NAMES[fromRight], value: digit * 10 ** fromRight };
  });
  const steps: Step[] = [{ text: `Write each digit of ${fmt(value)} under its place, starting with ones on the right.` }];
  if (place !== undefined) {
    const column = columns.find((c) => c.fromRight === place)!;
    steps.push({ text: `The ${column.digit} is in the ${column.name} column.`, focus: [place] });
    steps.push({ text: `Its value is ${column.digit} × ${fmt(10 ** place)} = ${fmt(column.value)}.`, focus: [place] });
  } else {
    steps.push({ text: `${fmt(value)} = ${columns.filter((c) => c.digit).map((c) => fmt(c.value)).join(" + ")}.` });
  }
  return { columns, steps };
}

// ───────────────────────── Fractions with the LCM ─────────────────────────

type F = { n: number; d: number };
function gcd(a: number, b: number): number { return b === 0 ? Math.abs(a) : gcd(b, a % b); }
function parseFraction(text: string): { whole: number; n: number; d: number } {
  const parts = text.trim().split(" ");
  const [n, d] = parts[parts.length - 1].split("/").map(Number);
  return { whole: parts.length === 2 ? Number(parts[0]) : 0, n, d: d ?? 1 };
}
export function showFraction(f: F): string {
  const g = gcd(f.n, f.d);
  const n = f.n / g;
  const d = f.d / g;
  if (d === 1) return String(n);
  return n > d ? `${Math.floor(n / d)} ${n % d}/${d}` : `${n}/${d}`;
}

export function fractionWorking(op: "+" | "−", a: string, b: string) {
  const x = parseFraction(a);
  const y = parseFraction(b);
  const xi: F = { n: x.whole * x.d + x.n, d: x.d };
  const yi: F = { n: y.whole * y.d + y.n, d: y.d };
  const lcm = (x.d * y.d) / gcd(x.d, y.d);
  const multiples = (d: number) => Array.from({ length: lcm / d }, (_, i) => d * (i + 1)).join(", ");
  const xn = xi.n * (lcm / x.d);
  const yn = yi.n * (lcm / y.d);
  const resultN = op === "+" ? xn + yn : xn - yn;
  const steps: Step[] = [];
  if (x.whole || y.whole) {
    steps.push({ text: `Change the mixed numbers to improper fractions: ${a} = ${xi.n}/${xi.d}${y.whole ? ` and ${b} = ${yi.n}/${yi.d}` : ""}.` });
  }
  if (x.d === y.d) {
    steps.push({ text: `The denominators are already the same (${x.d}).` });
  } else {
    steps.push({ text: `Find the LCM of ${x.d} and ${y.d}. Multiples of ${x.d}: ${multiples(x.d)}. Multiples of ${y.d}: ${multiples(y.d)}. The LCM is ${lcm}.` });
    steps.push({ text: `Make both denominators ${lcm}: ${xi.n}/${xi.d} = ${xn}/${lcm} (× ${lcm / x.d}) and ${yi.n}/${yi.d} = ${yn}/${lcm} (× ${lcm / y.d}).` });
  }
  steps.push({ text: `${op === "+" ? "Add" : "Subtract"} the numerators and keep the denominator: ${xn}/${lcm} ${op} ${yn}/${lcm} = ${resultN}/${lcm}.` });
  const answer = showFraction({ n: resultN, d: lcm });
  if (answer !== `${resultN}/${lcm}`) steps.push({ text: `Simplify${resultN > lcm ? " and write as a mixed number" : ""}: ${resultN}/${lcm} = ${answer}.` });
  steps.push({ text: `Answer: ${a} ${op} ${b} = ${answer}` });
  return { lcm, rows: [{ left: a, right: b }, { left: `${xn}/${lcm}`, right: `${yn}/${lcm}` }], result: `${resultN}/${lcm}`, answer, steps };
}

/** Steps for any Working, used for the plain-text list and for tests. */
export function stepsFor(working: Working): Step[] {
  switch (working.kind) {
    case "column": return columnWorking(working.op, working.top, working.bottom, working.decimals ?? 0).steps;
    case "long-multiplication": return longMultiplication(working.a, working.b).steps;
    case "long-division": return longDivision(working.dividend, working.divisor).steps;
    case "groups": return groupsWorking(working.groups, working.each).steps;
    case "sharing": return sharingWorking(working.total, working.groups).steps;
    case "place-value": return placeValueWorking(working.value, working.place).steps;
    case "fraction": return fractionWorking(working.op, working.a, working.b).steps;
  }
}
