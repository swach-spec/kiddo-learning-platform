import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, Q, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g3-math-multiply-divide",
  grade: 3,
  subject: "mathematics",
  skill: "multiplication_division",
  strand: "Numbers",
  subStrand: "Multiplication and Division",
  concept: "multiplication as repeated addition and division as sharing",
};

/** Multiplication shown as equal groups and repeated addition. */
function times(groups: number, each: number): Q {
  const answer = groups * each;
  return {
    prompt: `${groups} × ${each} = ?`,
    answer: String(answer),
    wrong: distinct(String(answer), [groups + each, answer + each, answer - each, answer + 1].map(String)),
    why: `${groups} groups of ${each}: ${Array(groups).fill(each).join(" + ")} = ${answer}.`,
    working: { kind: "groups", groups, each },
  };
}

function groupsStory(prompt: string, groups: number, each: number, unit: string): Q {
  const answer = groups * each;
  return {
    prompt,
    answer: `${answer} ${unit}`,
    wrong: distinct(`${answer} ${unit}`, [groups + each, answer + each, answer - each].map((value) => `${value} ${unit}`)),
    why: `${groups} groups of ${each}: ${groups} × ${each} = ${answer}.`,
    working: { kind: "groups", groups, each },
  };
}

/** Division shown as sharing equally / repeated subtraction. */
function share(total: number, groups: number): Q {
  const answer = total / groups;
  return {
    prompt: `${total} ÷ ${groups} = ?`,
    answer: String(answer),
    wrong: distinct(String(answer), [total - groups, answer + 1, answer - 1, groups].map(String)),
    why: `Share ${total} into ${groups} equal groups: each group gets ${answer}. Check: ${groups} × ${answer} = ${total}.`,
    working: { kind: "sharing", total, groups },
  };
}

/** A 2-digit number divided by a 1-digit number, laid out as long division. */
function divide(dividend: number, divisor: number): Q {
  const answer = dividend / divisor;
  const reversed = Number(String(answer).split("").reverse().join(""));
  return {
    prompt: `${dividend} ÷ ${divisor} = ?`,
    answer: String(answer),
    wrong: distinct(String(answer), [reversed, answer + 1, answer + 10, answer - 1].map(String)),
    why: `Divide the tens first, then the ones. ${dividend} ÷ ${divisor} = ${answer}, because ${answer} × ${divisor} = ${dividend}.`,
    working: { kind: "long-division", dividend, divisor },
  };
}

function sharingStory(prompt: string, total: number, groups: number, unit: string): Q {
  const answer = total / groups;
  return {
    prompt,
    answer: `${answer} ${unit}`,
    wrong: distinct(`${answer} ${unit}`, [total - groups, answer + 1, groups].map((value) => `${value} ${unit}`)),
    why: `${total} shared equally into ${groups}: ${total} ÷ ${groups} = ${answer}.`,
    working: { kind: "sharing", total, groups },
  };
}

export const g3MathMultiplyDivide: LearningUnit = {
  id: meta.unitId,
  grade: 3,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Model multiplication as repeated addition; multiply single-digit numbers and multiply by 10.",
    "Represent division as repeated subtraction; divide a 2-digit number by a single-digit number or by 10 without a remainder.",
  ],
  source: { document: "KICD Grade 3 Mathematical Activities curriculum design", subStrand: "1.5 Multiplication; 1.6 Division", verified: true },
  title: "Times and Sharing",
  description: "Multiply by making equal groups, and divide by sharing equally.",
  icon: "✖️",
  skill: "multiplication_division",
  lesson: {
    id: "g3-math-multiply-divide-lesson",
    subject: "mathematics",
    grade: 3,
    title: "Times and Sharing",
    subtitle: "Multiplying is adding equal groups. Dividing is sharing equally.",
    skill: "multiplication_division",
    icon: "✖️",
    estimatedMinutes: 8,
    xp: 20,
    steps: [
      { id: "g3md-teach", type: "teach", title: "Equal groups", body: "3 × 4 means 3 groups of 4. You can add: 4 + 4 + 4 = 12. Multiplying is a quick way to add equal groups." },
      { id: "g3md-example", type: "example", title: "3 groups of 4", body: "Mama puts 4 mandazi on each of 3 plates.", example: "4 + 4 + 4 = 12 → 3 × 4 = 12", explanation: "Count the groups, then how many in each group.", working: { kind: "groups", groups: 3, each: 4 } },
      { id: "g3md-try", type: "try", title: "Try it", body: "What is 5 × 4?", options: ["20", "9", "54"], correctOption: "20", explanation: "5 groups of 4: 4 + 4 + 4 + 4 + 4 = 20." },
      { id: "g3md-example-2", type: "example", title: "Sharing equally", body: "Share 20 sweets equally among 4 children.", example: "20 ÷ 4 = 5", explanation: "Each child gets 5. Check: 4 × 5 = 20.", working: { kind: "sharing", total: 20, groups: 4 } },
      { id: "g3md-example-3", type: "example", title: "Dividing bigger numbers", body: "To divide 84 by 4, divide the tens first, then the ones.", example: "84 ÷ 4 = 21", explanation: "8 tens ÷ 4 = 2 tens. 4 ones ÷ 4 = 1 one. So 21.", working: { kind: "long-division", dividend: 84, divisor: 4 } },
      { id: "g3md-try-2", type: "try", title: "Try it", body: "What is 30 ÷ 10?", options: ["3", "20", "300"], correctOption: "3", explanation: "30 shared into 10 equal groups gives 3 in each." },
      { id: "g3md-master", type: "master", title: "Ready to practise?", body: "You can multiply with equal groups and divide by sharing. Let's practise together." },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      times(2, 3),
      times(3, 5),
      share(10, 2),
      share(12, 3),
      { prompt: "Which is the same as 4 × 2?", answer: "2 + 2 + 2 + 2", wrong: ["4 + 2", "4 + 4 + 4 + 4"], why: "4 × 2 means 4 groups of 2: 2 + 2 + 2 + 2." },
      { prompt: "What is 6 × 10?", answer: "60", wrong: ["16", "6", "610"], why: "Multiplying by 10 puts a 0 on the end: 6 × 10 = 60." },
    ]),
    guided: bank(meta, "guided", [
      times(4, 5),
      times(5, 4),
      times(3, 4),
      times(7, 3),
      share(20, 5),
      share(16, 4),
      divide(48, 4),
      { prompt: "What is 50 ÷ 10?", answer: "5", wrong: ["40", "500", "10"], why: "50 shared into 10 equal groups gives 5 in each.", working: { kind: "sharing", total: 50, groups: 10 } },
    ]),
    independent: bank(meta, "independent", [
      times(6, 4),
      times(8, 5),
      times(9, 3),
      { prompt: "What is 7 × 10?", answer: "70", wrong: ["17", "77", "700"], why: "7 × 10 = 70." },
      share(45, 5),
      share(36, 4),
      divide(69, 3),
      divide(96, 8),
    ]),
    apply: bank(meta, "apply", [
      groupsStory("There are 5 benches. 4 pupils sit on each bench. How many pupils is that?", 5, 4, "pupils"),
      groupsStory("A hen lays 3 eggs every day. How many eggs in 6 days?", 6, 3, "eggs"),
      sharingStory("Baraka shares 24 oranges equally among 4 friends. How many does each friend get?", 24, 4, "oranges"),
      sharingStory("40 pupils line up in 5 equal lines. How many pupils are in each line?", 40, 5, "pupils"),
      { prompt: "A box holds 10 pencils. How many pencils are in 8 boxes?", answer: "80 pencils", wrong: ["18 pencils", "10 pencils", "800 pencils"], why: "8 × 10 = 80.", working: { kind: "groups", groups: 8, each: 10 } },
      { prompt: "66 mangoes are packed equally into 3 baskets. How many in each basket?", answer: "22 mangoes", wrong: ["63 mangoes", "23 mangoes", "33 mangoes"], why: "66 ÷ 3: 6 tens ÷ 3 = 2 tens, 6 ones ÷ 3 = 2 ones. So 22.", working: { kind: "long-division", dividend: 66, divisor: 3 } },
    ]),
    mastery: bank(meta, "mastery", [
      times(4, 4),
      times(5, 5),
      times(9, 4),
      times(6, 5),
      { prompt: "What is 9 × 10?", answer: "90", wrong: ["19", "99", "900"], why: "9 × 10 = 90." },
      share(35, 5),
      share(28, 4),
      divide(84, 4),
      divide(75, 5),
      { prompt: "Which number sentence matches: 15 − 5 − 5 − 5 = 0?", answer: "15 ÷ 5 = 3", wrong: ["15 × 5 = 75", "15 + 5 = 20"], why: "Taking away 5 three times from 15 leaves 0, so 15 ÷ 5 = 3." },
    ]),
  },
};
