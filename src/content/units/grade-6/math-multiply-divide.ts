import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, fmt, Q, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g6-math-multiply-divide",
  grade: 6,
  subject: "mathematics",
  skill: "multiplication_division",
  strand: "Numbers",
  subStrand: "Multiplication and Division",
  concept: "long multiplication, long division, estimation and combined operations",
};

/** Up to 4-digit × 2-digit, with the partial products shown. */
function multiply(a: number, b: number): Q {
  const answer = a * b;
  const tens = Math.floor(b / 10);
  const ones = b % 10;
  // Typical mistakes: forgetting the 0 in the tens row; a slip in one partial product.
  const forgotZero = a * ones + a * tens;
  return {
    prompt: `${fmt(a)} × ${b} = ?`,
    answer: fmt(answer),
    wrong: distinct(fmt(answer), [fmt(forgotZero), fmt(answer + 10 * a), fmt(answer - a), fmt(answer + 100)]),
    why: `Multiply by the ones (${fmt(a)} × ${ones} = ${fmt(a * ones)}), then by the tens (${fmt(a)} × ${tens}0 = ${fmt(a * tens * 10)}), then add: ${fmt(answer)}.`,
    working: { kind: "long-multiplication", a, b },
  };
}

/** Long division with an exact answer. */
function divide(dividend: number, divisor: number): Q {
  const answer = dividend / divisor;
  const droppedZero = Number(String(answer).replace(/0/g, "")) || answer + 1;
  return {
    prompt: `${fmt(dividend)} ÷ ${divisor} = ?`,
    answer: fmt(answer),
    wrong: distinct(fmt(answer), [fmt(droppedZero), fmt(answer + 1), fmt(answer + 10), fmt(answer - 1)]),
    why: `Divide, multiply, subtract, bring down — from left to right. ${fmt(dividend)} ÷ ${divisor} = ${fmt(answer)}. Check: ${fmt(answer)} × ${divisor} = ${fmt(dividend)}.`,
    working: { kind: "long-division", dividend, divisor },
  };
}

const round10 = (value: number) => Math.round(value / 10) * 10;

function estimateProduct(a: number, b: number): Q {
  const answer = round10(a) * round10(b);
  return {
    prompt: `Estimate ${a} × ${b} by rounding each number to the nearest ten.`,
    answer: fmt(answer),
    wrong: distinct(fmt(answer), [fmt(a * b), fmt(round10(a) * b), fmt(answer * 10), fmt(answer + 100)]),
    why: `${a} ≈ ${round10(a)} and ${b} ≈ ${round10(b)}. ${round10(a)} × ${round10(b)} = ${fmt(answer)}.`,
  };
}

function estimateQuotient(dividend: number, divisor: number): Q {
  const answer = Math.round(round10(dividend) / round10(divisor));
  return {
    prompt: `Estimate ${fmt(dividend)} ÷ ${divisor} by rounding both numbers to the nearest ten.`,
    answer: fmt(answer),
    wrong: distinct(fmt(answer), [fmt(answer * 10), fmt(answer + 10), fmt(Math.max(1, answer - 5))]),
    why: `${fmt(dividend)} ≈ ${fmt(round10(dividend))} and ${divisor} ≈ ${round10(divisor)}. ${fmt(round10(dividend))} ÷ ${round10(divisor)} ≈ ${fmt(answer)}.`,
  };
}

function combined(prompt: string, answer: number, wrong: number[], why: string): Q {
  return { prompt, answer: fmt(answer), wrong: distinct(fmt(answer), wrong.map(fmt)), why };
}

export const g6MathMultiplyDivide: LearningUnit = {
  id: meta.unitId,
  grade: 6,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Multiply up to a 4-digit number by a 2-digit number, and estimate products by rounding to the nearest ten.",
    "Divide up to a 4-digit number by up to a 3-digit number, and estimate quotients by rounding.",
    "Perform combined operations involving addition, subtraction, multiplication and division.",
  ],
  source: { document: "KICD Grade 6 Mathematics curriculum design", subStrand: "1.2 Multiplication; 1.3 Division", verified: true },
  title: "Long Multiplication and Division",
  description: "Multiply and divide big numbers step by step, and estimate to check your answers.",
  icon: "🧮",
  skill: "multiplication_division",
  lesson: {
    id: "g6-math-multiply-divide-lesson",
    subject: "mathematics",
    grade: 6,
    title: "Long Multiplication and Division",
    subtitle: "Work step by step, and estimate to check.",
    skill: "multiplication_division",
    icon: "🧮",
    estimatedMinutes: 10,
    xp: 20,
    steps: [
      { id: "g6md-teach", type: "teach", title: "Long multiplication", body: "To multiply by a 2-digit number, multiply by the ones digit, then by the tens digit (remember the 0), then add the two rows." },
      { id: "g6md-example", type: "example", title: "2,345 × 23", body: "Multiply by 3, then by 20, then add.", example: "7,035 + 46,900 = 53,935", explanation: "The second row starts with a 0 because the 2 in 23 stands for 20.", working: { kind: "long-multiplication", a: 2345, b: 23 } },
      { id: "g6md-try", type: "try", title: "Try it", body: "In 456 × 32, what do you multiply 456 by in the second row?", options: ["30", "3", "32"], correctOption: "30", explanation: "The 3 in 32 is in the tens place, so it stands for 30." },
      { id: "g6md-teach-2", type: "teach", title: "Long division", body: "Long division repeats four steps from left to right: Divide, Multiply, Subtract, Bring down." },
      { id: "g6md-example-2", type: "example", title: "7,392 ÷ 24", body: "Start with 73, because 7 is smaller than 24.", example: "7,392 ÷ 24 = 308", explanation: "When the divisor does not go into the number, write 0 in the answer and bring down the next digit.", working: { kind: "long-division", dividend: 7392, divisor: 24 } },
      { id: "g6md-try-2", type: "try", title: "Try it", body: "What is the order of steps in long division?", options: ["Divide, Multiply, Subtract, Bring down", "Multiply, Divide, Add, Bring down", "Subtract, Divide, Multiply, Bring down"], correctOption: "Divide, Multiply, Subtract, Bring down", explanation: "Divide, Multiply, Subtract, Bring down — then repeat." },
      { id: "g6md-master", type: "master", title: "Ready to practise?", body: "You can multiply and divide big numbers step by step. Let's practise." },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      multiply(23, 12),
      multiply(14, 21),
      divide(96, 4),
      divide(144, 12),
      { prompt: "In long multiplication, why does the second row start with a 0?", answer: "Because we are multiplying by tens", wrong: ["Because the answer is small", "To make the rows the same length"], why: "The tens digit stands for a number of tens, so the row is ten times bigger and ends in 0." },
      { prompt: "In long division, what do you do after subtracting?", answer: "Bring down the next digit", wrong: ["Multiply again", "Start again from the left"], why: "Divide, Multiply, Subtract, then Bring down." },
    ]),
    guided: bank(meta, "guided", [
      multiply(456, 32),
      multiply(1208, 15),
      multiply(375, 24),
      divide(8432, 4),
      divide(7392, 24),
      divide(5016, 12),
      estimateProduct(48, 31),
      combined("Work out: 24 + 36 ÷ 6", 30, [10, 60, 66], "Divide before adding: 36 ÷ 6 = 6, then 24 + 6 = 30."),
    ]),
    independent: bank(meta, "independent", [
      multiply(2345, 23),
      multiply(4072, 46),
      multiply(689, 57),
      divide(9135, 15),
      divide(6075, 25),
      divide(8820, 105),
      estimateQuotient(4812, 39),
      combined("Work out: 120 − 8 × 12 + 4", 28, [1348, 1340, 20], "Multiply first: 8 × 12 = 96. Then work left to right: 120 − 96 = 24, 24 + 4 = 28."),
    ]),
    apply: bank(meta, "apply", [
      { prompt: "A school bought 36 desks at sh. 1,250 each. What was the total cost?", answer: "sh. 45,000", wrong: ["sh. 11,250", "sh. 44,000", "sh. 46,250"], why: "1,250 × 36 = 45,000.", working: { kind: "long-multiplication", a: 1250, b: 36 } },
      { prompt: "A lorry carries 2,475 kg of maize in each trip. How much does it carry in 18 trips?", answer: "44,550 kg", wrong: ["22,275 kg", "44,500 kg", "4,455 kg"], why: "2,475 × 18 = 44,550 kg.", working: { kind: "long-multiplication", a: 2475, b: 18 } },
      { prompt: "4,368 bottles of water are packed into crates of 24. How many crates are filled?", answer: "182", wrong: ["18", "192", "172"], why: "4,368 ÷ 24 = 182.", working: { kind: "long-division", dividend: 4368, divisor: 24 } },
      { prompt: "A farmer shares 7,500 seedlings equally among 125 farmers. How many does each get?", answer: "60", wrong: ["6", "600", "61"], why: "7,500 ÷ 125 = 60.", working: { kind: "long-division", dividend: 7500, divisor: 125 } },
      { prompt: "About how much do 29 bags cost at sh. 412 each? (Round both to the nearest ten.)", answer: "sh. 12,300", wrong: ["sh. 11,948", "sh. 12,000", "sh. 1,230"], why: "412 ≈ 410 and 29 ≈ 30. 410 × 30 = 12,300." },
      { prompt: "Kamau had sh. 500. He bought 3 books at sh. 120 each. How much was left?", answer: "sh. 140", wrong: ["sh. 1,140", "sh. 380", "sh. 260"], why: "3 × 120 = 360, then 500 − 360 = 140." },
    ]),
    mastery: bank(meta, "mastery", [
      multiply(3056, 27),
      multiply(1984, 35),
      multiply(807, 64),
      divide(6912, 32),
      divide(9472, 74),
      divide(5525, 221),
      estimateProduct(62, 49),
      estimateQuotient(3590, 61),
      combined("Work out: (45 + 15) ÷ 6 × 3", 30, [10, 60, 15], "Brackets first: 45 + 15 = 60. Then left to right: 60 ÷ 6 = 10, 10 × 3 = 30."),
      combined("Work out: 200 − 150 ÷ 5 + 7 × 4", 198, [38, 9, 208], "Divide and multiply first: 150 ÷ 5 = 30 and 7 × 4 = 28. Then 200 − 30 + 28 = 198."),
    ]),
  },
};
