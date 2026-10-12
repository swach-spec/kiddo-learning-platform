import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, Q, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g3-math-add-subtract",
  grade: 3,
  subject: "mathematics",
  skill: "addition_subtraction",
  strand: "Numbers",
  subStrand: "Addition and Subtraction",
  concept: "adding and subtracting up to 1000 with single regrouping",
};

/** The classic mistake: adding each column but forgetting to carry. */
function addNoCarry(a: number, b: number): number {
  let result = 0;
  for (let place = 1; place <= 1000; place *= 10) result += ((Math.floor(a / place) % 10 + Math.floor(b / place) % 10) % 10) * place;
  return result;
}

/** The classic mistake: taking the smaller digit from the larger in each column instead of regrouping. */
function subNoBorrow(a: number, b: number): number {
  let result = 0;
  for (let place = 1; place <= 1000; place *= 10) result += Math.abs(Math.floor(a / place) % 10 - Math.floor(b / place) % 10) * place;
  return result;
}

function add(a: number, b: number): Q {
  const answer = a + b;
  return {
    prompt: `${a} + ${b} = ?`,
    answer: String(answer),
    wrong: distinct(String(answer), [addNoCarry(a, b), answer + 10, answer - 10, answer + 100].map(String)),
    why: `Add the ones, then the tens, then the hundreds. Remember to carry when a column makes 10 or more. ${a} + ${b} = ${answer}.`,
    working: { kind: "column", op: "+", top: a, bottom: b },
  };
}

function sub(a: number, b: number): Q {
  const answer = a - b;
  return {
    prompt: `${a} − ${b} = ?`,
    answer: String(answer),
    wrong: distinct(String(answer), [subNoBorrow(a, b), answer + 10, answer - 10, answer + 100].map(String)),
    why: `Subtract the ones first. If the top digit is smaller, regroup one ten into ten ones. ${a} − ${b} = ${answer}.`,
    working: { kind: "column", op: "−", top: a, bottom: b },
  };
}

function missingAddend(a: number, total: number): Q {
  const answer = total - a;
  return {
    prompt: `${a} + ___ = ${total}`,
    answer: String(answer),
    wrong: distinct(String(answer), [total + a, answer + 10, answer - 10, subNoBorrow(total, a)].map(String)),
    why: `To find the missing number, subtract: ${total} − ${a} = ${answer}.`,
    working: { kind: "column", op: "−", top: total, bottom: a },
  };
}

function wordAdd(prompt: string, a: number, b: number, unit: string): Q {
  const answer = a + b;
  return {
    prompt,
    answer: `${answer} ${unit}`,
    wrong: distinct(`${answer} ${unit}`, [addNoCarry(a, b), Math.abs(a - b), answer + 10].map((value) => `${value} ${unit}`)),
    why: `"Altogether" means add: ${a} + ${b} = ${answer}.`,
    working: { kind: "column", op: "+", top: a, bottom: b, unit: unit },
  };
}

function wordSub(prompt: string, a: number, b: number, unit: string): Q {
  const answer = a - b;
  return {
    prompt,
    answer: `${answer} ${unit}`,
    wrong: distinct(`${answer} ${unit}`, [subNoBorrow(a, b), a + b, answer + 10].map((value) => `${value} ${unit}`)),
    why: `To find what is left, subtract: ${a} − ${b} = ${answer}.`,
    working: { kind: "column", op: "−", top: a, bottom: b, unit: unit },
  };
}

export const g3MathAddSubtract: LearningUnit = {
  id: meta.unitId,
  grade: 3,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Add a 3-digit number to a 2- or 3-digit number with single regrouping, with the sum not exceeding 1000.",
    "Subtract up to 3-digit numbers with single regrouping, including missing numbers.",
  ],
  source: { document: "KICD Grade 3 Mathematical Activities curriculum design", subStrand: "1.3 Addition; 1.4 Subtraction", verified: true },
  title: "Adding and Taking Away",
  description: "Add and subtract numbers up to 1000, carrying and regrouping when you need to.",
  icon: "➕",
  skill: "addition_subtraction",
  lesson: {
    id: "g3-math-add-subtract-lesson",
    subject: "mathematics",
    grade: 3,
    title: "Adding and Taking Away",
    subtitle: "Work column by column, starting with the ones.",
    skill: "addition_subtraction",
    icon: "➕",
    estimatedMinutes: 7,
    xp: 20,
    steps: [
      { id: "g3as-teach", type: "teach", title: "Start with the ones", body: "Line the numbers up: ones under ones, tens under tens, hundreds under hundreds. Always start with the ones column." },
      { id: "g3as-example", type: "example", title: "Carrying", body: "247 + 35: 7 + 5 = 12. Write 2 in the ones and carry 1 ten. Then 4 + 3 + 1 = 8 tens. Then 2 hundreds.", example: "247 + 35 = 282", explanation: "When a column makes 10 or more, carry the ten to the next column.", working: { kind: "column", op: "+", top: 247, bottom: 35 } },
      { id: "g3as-try", type: "try", title: "Try it", body: "What is 128 + 46?", options: ["174", "164", "184"], correctOption: "174", explanation: "8 + 6 = 14: write 4, carry 1. 2 + 4 + 1 = 7. 1 hundred. So 174." },
      { id: "g3as-example-2", type: "example", title: "Regrouping", body: "352 − 27: you cannot take 7 from 2, so regroup one ten into ten ones. 12 − 7 = 5. Then 4 − 2 = 2 tens. Then 3 hundreds.", example: "352 − 27 = 325", explanation: "Regrouping means changing one ten into ten ones so you can subtract.", working: { kind: "column", op: "−", top: 352, bottom: 27 } },
      { id: "g3as-try-2", type: "try", title: "Try it", body: "What is 64 − 19?", options: ["45", "55", "53"], correctOption: "45", explanation: "Regroup: 14 − 9 = 5. Then 5 − 1 = 4 tens. So 45." },
      { id: "g3as-master", type: "master", title: "Ready to practise?", body: "You can add with carrying and subtract with regrouping. Let's practise together." },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      add(23, 14),
      add(38, 5),
      sub(47, 12),
      sub(30, 6),
      { prompt: "In 247 + 35, which column do you add first?", answer: "The ones", wrong: ["The hundreds", "The tens"], why: "We always start with the ones column." },
      { prompt: "7 + 5 = 12. In a sum, what do you write and what do you carry?", answer: "Write 2, carry 1 ten", wrong: ["Write 1, carry 2", "Write 12"], why: "12 is 1 ten and 2 ones, so write 2 and carry the 1 ten." },
    ]),
    guided: bank(meta, "guided", [
      add(243, 36),
      add(318, 47),
      add(526, 263),
      add(457, 328),
      sub(486, 53),
      sub(372, 45),
      sub(653, 218),
      missingAddend(150, 380),
    ]),
    independent: bank(meta, "independent", [
      add(609, 84),
      add(375, 418),
      add(268, 591),
      sub(745, 38),
      sub(961, 527),
      sub(830, 214),
      missingAddend(406, 675),
      { prompt: "Find the missing number: 900, 850, 800, ___, 700", answer: "750", wrong: ["650", "780", "760"], why: "The pattern takes away 50 each time: 800 − 50 = 750." },
    ]),
    apply: bank(meta, "apply", [
      wordAdd("A school planted 248 trees in March and 136 trees in April. How many trees did it plant altogether?", 248, 136, "trees"),
      wordSub("A farmer had 625 mangoes. She sold 318. How many mangoes were left?", 625, 318, "mangoes"),
      wordAdd("A matatu carried 175 passengers in the morning and 209 in the evening. How many passengers altogether?", 175, 209, "passengers"),
      wordSub("A water tank holds 860 litres. 245 litres were used. How many litres are left?", 860, 245, "litres"),
      wordSub("Kibet has 456 marbles. Cheruto has 92. How many more marbles does Kibet have?", 456, 92, "marbles"),
      wordAdd("A library has 386 English books and 421 Kiswahili books. How many books is that altogether?", 386, 421, "books"),
    ]),
    mastery: bank(meta, "mastery", [
      add(564, 27),
      add(139, 452),
      add(283, 345),
      add(716, 58),
      sub(593, 68),
      sub(470, 135),
      sub(812, 406),
      missingAddend(275, 490),
      wordAdd("A shop sold 167 loaves on Monday and 215 on Tuesday. How many loaves did it sell in the two days?", 167, 215, "loaves"),
      wordSub("There were 734 pupils in a school. 118 went on a trip. How many stayed at school?", 734, 118, "pupils"),
    ]),
  },
};
