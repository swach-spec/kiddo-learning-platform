import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, fmt, Q, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g6-math-whole-numbers",
  grade: 6,
  subject: "mathematics",
  skill: "number_sense",
  strand: "Numbers",
  subStrand: "Whole Numbers",
  concept: "place value to millions, rounding, squares and square roots",
};

const PLACES = ["ones", "tens", "hundreds", "thousands", "ten thousands", "hundred thousands", "millions", "ten millions"];

function digitAt(value: number, place: number): number {
  return Math.floor(value / 10 ** place) % 10;
}

function placeOf(value: number, place: number): Q {
  const digit = digitAt(value, place);
  return {
    prompt: `What is the place value of ${digit} in ${fmt(value)}?`,
    answer: PLACES[place],
    wrong: distinct(PLACES[place], [PLACES[place + 1], PLACES[place - 1], PLACES[place + 2], PLACES[place - 2]].filter(Boolean)),
    why: `Counting places from the right (ones, tens, hundreds, thousands, …), the ${digit} is in the ${PLACES[place]} place.`,
    working: { kind: "place-value", value, place },
  };
}

function totalValue(value: number, place: number): Q {
  const digit = digitAt(value, place);
  const total = digit * 10 ** place;
  return {
    prompt: `What is the total value of the digit ${digit} in ${fmt(value)}?`,
    answer: fmt(total),
    wrong: distinct(fmt(total), [fmt(total * 10), fmt(total / 10), String(digit), fmt(total * 100)]),
    why: `${digit} is in the ${PLACES[place]} place, so its total value is ${digit} × ${fmt(10 ** place)} = ${fmt(total)}.`,
    working: { kind: "place-value", value, place },
  };
}

function roundThousand(value: number): Q {
  const answer = Math.round(value / 1000) * 1000;
  const down = Math.floor(value / 1000) * 1000;
  const up = down + 1000;
  return {
    prompt: `Round ${fmt(value)} to the nearest thousand.`,
    answer: fmt(answer),
    wrong: distinct(fmt(answer), [fmt(answer === down ? up : down), fmt(Math.round(value / 100) * 100), fmt(Math.round(value / 10000) * 10000)]),
    why: `Look at the hundreds digit (${digitAt(value, 2)}). ${digitAt(value, 2) >= 5 ? "5 or more rounds up" : "Less than 5 rounds down"}, so ${fmt(value)} ≈ ${fmt(answer)}.`,
  };
}

function square(n: number): Q {
  const answer = n * n;
  return {
    prompt: `What is ${n}²?`,
    answer: fmt(answer),
    wrong: distinct(fmt(answer), [fmt(n * 2), fmt((n + 1) * (n + 1)), fmt(n * 10), fmt((n - 1) * (n - 1))]),
    why: `${n}² means ${n} × ${n} = ${fmt(answer)}.`,
    ...(n >= 10 ? { working: { kind: "long-multiplication" as const, a: n, b: n } } : {}),
  };
}

function squareRoot(n: number): Q {
  const value = n * n;
  return {
    prompt: `What is the square root of ${fmt(value)}?`,
    answer: String(n),
    wrong: distinct(String(n), [fmt(value / 2), String(n + 1), String(n * 10), String(n - 1)]),
    why: `${n} × ${n} = ${fmt(value)}, so √${fmt(value)} = ${n}.`,
  };
}

function biggest(values: number[]): Q {
  const answer = Math.max(...values);
  return {
    prompt: `Which number is the greatest? ${values.map(fmt).join(", ")}`,
    answer: fmt(answer),
    wrong: values.filter((value) => value !== answer).map(fmt),
    why: `Compare from the highest place value. ${fmt(answer)} is the greatest.`,
  };
}

export const g6MathWholeNumbers: LearningUnit = {
  id: meta.unitId,
  grade: 6,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Use place value and total value of digits up to millions.",
    "Read, write and order numbers up to 100,000, and round off to the nearest thousand.",
    "Apply squares of whole numbers up to 100 and square roots of perfect squares up to 10,000.",
  ],
  source: { document: "KICD Grade 6 Mathematics curriculum design", subStrand: "1.1 Whole Numbers", verified: true },
  title: "Big Numbers",
  description: "Work with numbers up to millions: place value, rounding, squares and square roots.",
  icon: "🔭",
  skill: "number_sense",
  lesson: {
    id: "g6-math-whole-numbers-lesson",
    subject: "mathematics",
    grade: 6,
    title: "Big Numbers",
    subtitle: "Place value up to millions, rounding, squares and square roots.",
    skill: "number_sense",
    icon: "🔭",
    estimatedMinutes: 8,
    xp: 20,
    steps: [
      { id: "g6wn-teach", type: "teach", title: "Place value to millions", body: "Digits are grouped in threes from the right: ones, thousands, millions. In 4,256,310 the 4 is in the millions place, so its total value is 4,000,000." },
      { id: "g6wn-try", type: "try", title: "Try it", body: "What is the total value of 7 in 3,725,104?", options: ["700,000", "70,000", "7,000,000"], correctOption: "700,000", explanation: "7 is in the hundred thousands place: 7 × 100,000 = 700,000." },
      { id: "g6wn-example", type: "example", title: "Rounding to the nearest thousand", body: "Round 46,728 to the nearest thousand. Look at the hundreds digit: 7 is 5 or more, so round up.", example: "46,728 → 47,000", explanation: "If the hundreds digit is 5 or more, round up; otherwise round down." },
      { id: "g6wn-example-2", type: "example", title: "Squares and square roots", body: "12² = 12 × 12 = 144. The square root of 144 is 12, because 12 × 12 = 144.", example: "12² = 144 • √144 = 12", explanation: "Squaring and finding the square root undo each other.", working: { kind: "long-multiplication", a: 12, b: 12 } },
      { id: "g6wn-try-2", type: "try", title: "Try it", body: "What is √2,500?", options: ["50", "250", "500"], correctOption: "50", explanation: "50 × 50 = 2,500." },
      { id: "g6wn-master", type: "master", title: "Ready to practise?", body: "You can use place value, round numbers, and work with squares and square roots. Let's practise." },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      placeOf(4_582, 3),
      totalValue(36_204, 4),
      roundThousand(5_380),
      square(6),
      squareRoot(9),
      { prompt: "How do we write 25,000 in words?", answer: "twenty-five thousand", wrong: ["two hundred and fifty thousand", "two thousand five hundred"], why: "25,000 is twenty-five thousand." },
    ]),
    guided: bank(meta, "guided", [
      placeOf(3_725_104, 5),
      placeOf(8_461_250, 6),
      totalValue(5_946_302, 4),
      totalValue(2_318_475, 3),
      roundThousand(46_728),
      roundThousand(81_294),
      square(15),
      squareRoot(30),
    ]),
    independent: bank(meta, "independent", [
      placeOf(7_405_813, 6),
      totalValue(6_073_918, 4),
      roundThousand(99_516),
      roundThousand(30_450),
      square(24),
      squareRoot(64),
      biggest([45_098, 45_980, 45_809]),
      { prompt: "How do we write 70,406 in words?", answer: "seventy thousand, four hundred and six", wrong: ["seven thousand, four hundred and six", "seventy thousand, forty-six"], why: "70,406 = 70 thousands + 4 hundreds + 6 ones." },
    ]),
    apply: bank(meta, "apply", [
      { prompt: "A county has 1,452,893 people. What is this number rounded to the nearest thousand?", answer: "1,453,000", wrong: ["1,452,000", "1,450,000", "1,500,000"], why: "The hundreds digit is 8, so round up: 1,453,000." },
      { prompt: "A square garden has 49 m² of grass. How long is one side?", answer: "7 m", wrong: ["24.5 m", "12 m", "49 m"], why: "Area of a square = side × side. 7 × 7 = 49, so a side is 7 m." },
      { prompt: "A square classroom floor has sides of 9 m. What is its area?", answer: "81 m²", wrong: ["18 m²", "36 m²", "90 m²"], why: "9² = 9 × 9 = 81 m²." },
      { prompt: "Which is the correct order from smallest to largest?", answer: "65,309; 65,390; 65,903", wrong: ["65,903; 65,390; 65,309", "65,390; 65,309; 65,903"], why: "Compare the hundreds, then the tens: 309 < 390 < 903." },
      { prompt: "A stadium sold 38,602 tickets. About how many is that to the nearest thousand?", answer: "39,000", wrong: ["38,000", "38,600", "40,000"], why: "The hundreds digit is 6, so round up to 39,000." },
      { prompt: "Mr Kamau stacks boxes in a square of 12 rows and 12 columns. How many boxes?", answer: "144", wrong: ["24", "122", "1,212"], why: "12² = 12 × 12 = 144." },
    ]),
    mastery: bank(meta, "mastery", [
      placeOf(9_314_027, 4),
      totalValue(4_708_216, 6),
      totalValue(3_870_142, 2),
      roundThousand(72_501),
      roundThousand(18_499),
      square(19),
      square(100),
      squareRoot(85),
      biggest([108_745, 180_745, 108_754]),
      { prompt: "How do we write 93,015 in words?", answer: "ninety-three thousand and fifteen", wrong: ["nine thousand, three hundred and fifteen", "ninety-three thousand, one hundred and five"], why: "93,015 = 93 thousands + 15 ones." },
    ]),
  },
};
