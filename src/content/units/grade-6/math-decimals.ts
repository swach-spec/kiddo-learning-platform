import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, Q, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g6-math-decimals",
  grade: 6,
  subject: "mathematics",
  skill: "fractions_decimals",
  strand: "Numbers",
  subStrand: "Decimals",
  concept: "decimals to ten thousandths: place value, rounding, conversion, adding and subtracting",
};

/**
 * Decimals are handled as whole numbers of ten-thousandths (scale 10,000) so
 * every answer is exact — no floating-point surprises like 0.1 + 0.2.
 */
const SCALE = 10_000;
const toUnits = (text: string): number => {
  const [whole, fraction = ""] = text.split(".");
  return Number(whole) * SCALE + Number(fraction.padEnd(4, "0").slice(0, 4));
};
const fromUnits = (units: number): string => {
  const sign = units < 0 ? "-" : "";
  const abs = Math.abs(units);
  const whole = Math.floor(abs / SCALE);
  const fraction = String(abs % SCALE).padStart(4, "0").replace(/0+$/, "");
  return `${sign}${whole}${fraction ? `.${fraction}` : ""}`;
};

const PLACES = ["tenths", "hundredths", "thousandths", "ten thousandths"];

function placeOf(text: string, position: number): Q {
  const digit = text.split(".")[1][position];
  return {
    prompt: `What is the place value of the digit ${digit} in ${text}?`,
    answer: PLACES[position],
    wrong: PLACES.filter((name) => name !== PLACES[position]).concat("tens").slice(0, 3),
    why: `After the decimal point the places are tenths, hundredths, thousandths, ten thousandths. The ${digit} is in the ${PLACES[position]} place.`,
  };
}

function round3(text: string): Q {
  const units = toUnits(text);
  const rounded = Math.round(units / 10) * 10;
  const truncated = Math.floor(units / 10) * 10;
  // Rounded answers always show exactly 3 decimal places (5.100, not 5.1).
  const three = (value: number) => (value / SCALE).toFixed(3);
  const answer = three(rounded);
  return {
    prompt: `Round ${text} to 3 decimal places.`,
    answer,
    wrong: distinct(answer, [three(truncated === rounded ? truncated + 10 : truncated), fromUnits(Math.round(units / 100) * 100), three(rounded + 10), text].filter((option) => Number(option) !== Number(answer))),
    why: `Look at the 4th decimal place (${text.split(".")[1][3]}). ${Number(text.split(".")[1][3]) >= 5 ? "5 or more rounds up" : "Less than 5 rounds down"}, so ${text} ≈ ${answer}.`,
  };
}

function addOrSubtract(a: string, b: string, sign: "+" | "−"): Q {
  const result = sign === "+" ? toUnits(a) + toUnits(b) : toUnits(a) - toUnits(b);
  const answer = fromUnits(result);
  // Typical mistake: lining up the last digits instead of the decimal points
  // (e.g. 4.25 + 1.375 treated as 425 + 1375, then given 3 decimal places).
  const width = Math.max((a.split(".")[1] ?? "").length, (b.split(".")[1] ?? "").length);
  const digitsA = Number(a.replace(".", ""));
  const digitsB = Number(b.replace(".", ""));
  const misalignedValue = sign === "+" ? digitsA + digitsB : digitsA - digitsB;
  const misaligned = misalignedValue > 0 ? fromUnits(Math.round((misalignedValue * SCALE) / 10 ** width)) : fromUnits(result + 1000);
  return {
    prompt: `${a} ${sign} ${b} = ?`,
    answer,
    wrong: distinct(answer, [misaligned, fromUnits(result + 100), fromUnits(result - 10), fromUnits(sign === "+" ? toUnits(a) - toUnits(b) : toUnits(a) + toUnits(b))].filter((value) => !value.startsWith("-"))),
    why: `Line up the decimal points, fill empty places with zeros, then ${sign === "+" ? "add" : "subtract"}: ${a} ${sign} ${b} = ${answer}.`,
    working: { kind: "column", op: sign === "+" ? "+" : "−", top: Math.round(toUnits(a) / 10 ** (4 - width)), bottom: Math.round(toUnits(b) / 10 ** (4 - width)), decimals: width },
  };
}

function toFraction(text: string, answer: string, wrong: string[]): Q {
  return { prompt: `Write ${text} as a fraction in its simplest form.`, answer, wrong, why: `${text} = ${toUnits(text)}/${SCALE} in ten-thousandths. Simplified, that is ${answer}.` };
}

function toPercent(text: string): Q {
  const answer = `${fromUnits(toUnits(text) * 100)}%`;
  return {
    prompt: `Express ${text} as a percentage.`,
    answer,
    wrong: distinct(answer, [`${fromUnits(toUnits(text) * 10)}%`, `${text}%`, `${fromUnits(toUnits(text) * 1000)}%`]),
    why: `Multiply by 100: ${text} × 100 = ${answer}.`,
  };
}

function fromPercent(percent: string): Q {
  const answer = fromUnits(Math.round(toUnits(percent) / 100));
  return {
    prompt: `Write ${percent}% as a decimal.`,
    answer,
    wrong: distinct(answer, [fromUnits(Math.round(toUnits(percent) / 10)), percent, fromUnits(Math.round(toUnits(percent) / 1000))]),
    why: `Divide by 100: ${percent}% = ${percent} ÷ 100 = ${answer}.`,
  };
}

export const g6MathDecimals: LearningUnit = {
  id: meta.unitId,
  grade: 6,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Identify decimals up to ten thousandths and round off decimals to 3 decimal places.",
    "Convert between decimals, fractions and percentages.",
    "Add and subtract decimals up to 4 decimal places.",
  ],
  source: { document: "KICD Grade 6 Mathematics curriculum design", subStrand: "1.5 Decimals", verified: true },
  title: "Decimals",
  description: "Read, round, convert, add and subtract decimals up to ten thousandths.",
  icon: "🎯",
  skill: "fractions_decimals",
  lesson: {
    id: "g6-math-decimals-lesson",
    subject: "mathematics",
    grade: 6,
    title: "Decimals",
    subtitle: "Every place after the point is ten times smaller.",
    skill: "fractions_decimals",
    icon: "🎯",
    estimatedMinutes: 8,
    xp: 20,
    steps: [
      { id: "g6dc-teach", type: "teach", title: "Places after the point", body: "After the decimal point come tenths, hundredths, thousandths and ten thousandths. In 3.4721, the 4 is tenths, 7 is hundredths, 2 is thousandths and 1 is ten thousandths." },
      { id: "g6dc-try", type: "try", title: "Try it", body: "In 0.5836, which place is the 3 in?", options: ["thousandths", "hundredths", "tenths"], correctOption: "thousandths", explanation: "5 tenths, 8 hundredths, 3 thousandths, 6 ten thousandths." },
      { id: "g6dc-example", type: "example", title: "Line up the points", body: "4.25 + 1.375: write 4.250 + 1.375 with the points in line.", example: "4.250 + 1.375 = 5.625", explanation: "Always line up the decimal points, not the last digits.", working: { kind: "column", op: "+", top: 4250, bottom: 1375, decimals: 3 } },
      { id: "g6dc-example-2", type: "example", title: "Decimals, fractions, percentages", body: "0.75 = 75/100 = 3/4 = 75%.", example: "0.75 → 3/4 → 75%", explanation: "To make a percentage, multiply the decimal by 100." },
      { id: "g6dc-try-2", type: "try", title: "Try it", body: "Round 2.4567 to 3 decimal places.", options: ["2.457", "2.456", "2.46"], correctOption: "2.457", explanation: "The 4th decimal digit is 7, so round the 6 up to 7: 2.457." },
      { id: "g6dc-master", type: "master", title: "Ready to practise?", body: "You can read, round, convert and add decimals. Let's practise." },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      placeOf("0.25", 0),
      placeOf("0.25", 1),
      addOrSubtract("0.4", "0.3", "+"),
      addOrSubtract("1.5", "0.2", "−"),
      toPercent("0.5"),
      toFraction("0.5", "1/2", ["1/5", "5/1", "2/5"]),
    ]),
    guided: bank(meta, "guided", [
      placeOf("3.4721", 2),
      placeOf("12.0596", 3),
      round3("2.4567"),
      round3("0.1234"),
      addOrSubtract("4.25", "1.375", "+"),
      addOrSubtract("7.6", "2.45", "−"),
      toPercent("0.35"),
      toFraction("0.75", "3/4", ["7/5", "75/10", "1/4"]),
    ]),
    independent: bank(meta, "independent", [
      placeOf("6.0183", 1),
      round3("5.0996"),
      round3("9.3005"),
      addOrSubtract("3.0625", "2.81", "+"),
      addOrSubtract("10.5", "4.1275", "−"),
      toPercent("0.08"),
      fromPercent("45"),
      toFraction("0.125", "1/8", ["1/125", "125/100", "1/4"]),
    ]),
    apply: bank(meta, "apply", [
      { prompt: "Akinyi bought 2.5 kg of rice and 1.75 kg of sugar. What is the total mass?", answer: "4.25 kg", wrong: ["3.25 kg", "1.95 kg", "4.3 kg"], why: "Line up the points: 2.50 + 1.75 = 4.25 kg.", working: { kind: "column", op: "+", top: 250, bottom: 175, decimals: 2, unit: "kg" } },
      { prompt: "A water bottle holds 1.5 litres. Juma drank 0.625 litres. How much is left?", answer: "0.875 litres", wrong: ["0.975 litres", "1.125 litres", "0.88 litres"], why: "1.500 − 0.625 = 0.875 litres.", working: { kind: "column", op: "−", top: 1500, bottom: 625, decimals: 3, unit: "litres" } },
      { prompt: "A runner's time was 12.3486 seconds. What is it to 3 decimal places?", answer: "12.349 seconds", wrong: ["12.348 seconds", "12.35 seconds", "12.3486 seconds"], why: "The 4th decimal digit is 6, so round up: 12.349." },
      { prompt: "In a test, Chebet scored 0.85 of the marks. What percentage is that?", answer: "85%", wrong: ["8.5%", "0.85%", "850%"], why: "0.85 × 100 = 85%." },
      { prompt: "A shop gives 0.2 of the price as discount. As a fraction in simplest form, that is…", answer: "1/5", wrong: ["2/100", "1/2", "2/5"], why: "0.2 = 2/10 = 1/5." },
      { prompt: "A field is 45.6 m long and 28.75 m wide. How much longer is the length than the width?", answer: "16.85 m", wrong: ["17.15 m", "16.95 m", "74.35 m"], why: "45.60 − 28.75 = 16.85 m.", working: { kind: "column", op: "−", top: 4560, bottom: 2875, decimals: 2, unit: "m" } },
    ]),
    mastery: bank(meta, "mastery", [
      placeOf("0.9072", 3),
      placeOf("15.3409", 1),
      round3("4.0625"),
      round3("8.9999"),
      addOrSubtract("6.208", "3.7945", "+"),
      addOrSubtract("9.05", "6.1275", "−"),
      toPercent("0.625"),
      fromPercent("7.5"),
      toFraction("0.04", "1/25", ["4/10", "1/4", "4/1000"]),
      { prompt: "Which is the largest: 0.7, 0.68 or 0.705?", answer: "0.705", wrong: ["0.7", "0.68"], why: "Write them with 3 places: 0.700, 0.680, 0.705. 0.705 is the largest." },
    ]),
  },
};
