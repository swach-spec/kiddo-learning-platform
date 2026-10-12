import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, Q, sh, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g3-math-money",
  grade: 3,
  subject: "mathematics",
  skill: "problem_solving",
  strand: "Measurement",
  subStrand: "Money",
  concept: "Kenyan money up to sh. 1,000",
};

/** Counting a set of coins and notes. */
function count(items: number[]): Q {
  const total = items.reduce((sum, value) => sum + value, 0);
  const listed = items.map((value) => sh(value)).join(" + ");
  return {
    prompt: `How much money is this altogether? ${listed}`,
    answer: sh(total),
    wrong: distinct(sh(total), [sh(total + 10), sh(total - 10), sh(items.length * 10), sh(total + 50)]),
    why: `Add them up: ${listed} = ${sh(total)}.`,
  };
}

/** Buying items and finding the balance (change). */
function balance(paid: number, prices: number[], itemNames: string): Q {
  const cost = prices.reduce((sum, value) => sum + value, 0);
  const change = paid - cost;
  return {
    prompt: `You buy ${itemNames} for ${prices.map(sh).join(", ")}. You pay with ${sh(paid)}. What is your balance?`,
    answer: sh(change),
    wrong: distinct(sh(change), [sh(cost), sh(change + 10), sh(paid + cost), sh(change - 10)]),
    why: `First add the prices: ${sh(cost)}. Then subtract from what you paid: ${sh(paid)} − ${sh(cost)} = ${sh(change)}.`,
  };
}

/** How many smaller notes or coins make one bigger one. */
function convert(big: number, small: number): Q {
  const answer = big / small;
  return {
    prompt: `How many ${sh(small)} ${small >= 50 ? "notes" : "coins"} make ${sh(big)}?`,
    answer: String(answer),
    wrong: distinct(String(answer), [String(answer * 2), String(answer + 1), String(answer - 1), String(small)].filter((value) => Number(value) > 0)),
    why: `${sh(big)} ÷ ${sh(small)} = ${answer}, so ${answer} of them make ${sh(big)}.`,
  };
}

export const g3MathMoney: LearningUnit = {
  id: meta.unitId,
  grade: 3,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Identify Kenyan currency notes up to sh. 1,000 and count money in different denominations.",
    "Add and subtract money, represent the same amount in different denominations, and use money to buy up to 3 items involving balance.",
  ],
  source: { document: "KICD Grade 3 Mathematical Activities curriculum design", subStrand: "2.5 Money", verified: true },
  title: "Money",
  description: "Count shillings, buy things at the market and work out your balance.",
  icon: "💵",
  skill: "problem_solving",
  lesson: {
    id: "g3-math-money-lesson",
    subject: "mathematics",
    grade: 3,
    title: "Money",
    subtitle: "Kenyan coins and notes, and how to work out change.",
    skill: "problem_solving",
    icon: "💵",
    estimatedMinutes: 6,
    xp: 20,
    steps: [
      { id: "g3m-teach", type: "teach", title: "Kenyan money", body: "Kenyan coins include sh. 1, sh. 5, sh. 10 and sh. 20. Kenyan notes are sh. 50, sh. 100, sh. 200, sh. 500 and sh. 1,000." },
      { id: "g3m-example", type: "example", title: "Counting money", body: "A sh. 100 note, a sh. 50 note and two sh. 10 coins.", example: "100 + 50 + 10 + 10 = sh. 170", explanation: "Start with the biggest note, then add the smaller ones." },
      { id: "g3m-try", type: "try", title: "Try it", body: "How many sh. 50 notes make sh. 200?", options: ["4", "2", "5"], correctOption: "4", explanation: "50 + 50 + 50 + 50 = 200, so 4 notes." },
      { id: "g3m-example-2", type: "example", title: "Balance", body: "You buy bread for sh. 65 and pay with a sh. 100 note.", example: "100 − 65 = sh. 35 balance", explanation: "The balance (change) is what you paid minus what it cost." },
      { id: "g3m-try-2", type: "try", title: "Try it", body: "A pencil costs sh. 15. You pay sh. 50. What is your balance?", options: ["sh. 35", "sh. 65", "sh. 45"], correctOption: "sh. 35", explanation: "50 − 15 = 35." },
      { id: "g3m-master", type: "master", title: "Ready to practise?", body: "You can count money and work out a balance. Let's go to the market!" },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      { prompt: "Which of these is a Kenyan NOTE?", answer: "sh. 100", wrong: ["sh. 10", "sh. 5"], why: "sh. 100 is a note. sh. 10 and sh. 5 are coins." },
      { prompt: "Which of these is a Kenyan COIN?", answer: "sh. 20", wrong: ["sh. 200", "sh. 500"], why: "sh. 20 is a coin. sh. 200 and sh. 500 are notes." },
      count([10, 10, 5]),
      count([50, 20]),
      convert(20, 10),
      { prompt: "Which is more money: sh. 50 or sh. 20?", answer: "sh. 50", wrong: ["sh. 20", "They are the same"], why: "50 is more than 20." },
    ]),
    guided: bank(meta, "guided", [
      count([100, 50, 20]),
      count([200, 100, 10, 5]),
      count([500, 200, 50]),
      convert(100, 50),
      convert(1000, 500),
      balance(100, [45], "a mango"),
      balance(200, [120], "a book"),
      { prompt: "Which set makes sh. 300?", answer: "sh. 200 + sh. 100", wrong: ["sh. 200 + sh. 50", "sh. 100 + sh. 100"], why: "200 + 100 = 300." },
    ]),
    independent: bank(meta, "independent", [
      count([500, 100, 100, 50]),
      count([200, 200, 20, 20, 1]),
      convert(500, 100),
      convert(200, 20),
      balance(500, [250, 125], "rice and sugar"),
      balance(1000, [450, 300], "shoes and a sweater"),
      { prompt: "Achieng has sh. 350. She is given sh. 400 more. How much does she have now?", answer: "sh. 750", wrong: ["sh. 50", "sh. 700", "sh. 850"], why: "350 + 400 = 750." },
      { prompt: "Which set does NOT make sh. 500?", answer: "sh. 200 + sh. 200 + sh. 50", wrong: ["sh. 200 + sh. 200 + sh. 100", "sh. 100 × 5"], why: "200 + 200 + 50 = 450, not 500." },
    ]),
    apply: bank(meta, "apply", [
      balance(100, [30, 25, 20], "a pencil, a rubber and a sharpener"),
      balance(500, [180, 95, 60], "a bag of maize flour, milk and bread"),
      { prompt: "Mutua saves sh. 50 every week. How much has he saved after 4 weeks?", answer: "sh. 200", wrong: ["sh. 54", "sh. 150", "sh. 250"], why: "50 + 50 + 50 + 50 = 200." },
      { prompt: "A book costs sh. 380. Njeri has sh. 250. How much more does she need?", answer: "sh. 130", wrong: ["sh. 630", "sh. 120", "sh. 230"], why: "380 − 250 = 130." },
      { prompt: "Two pencils cost sh. 15 each. What do they cost together?", answer: "sh. 30", wrong: ["sh. 15", "sh. 25", "sh. 35"], why: "15 + 15 = 30." },
      { prompt: "Which is the best way to pay exactly sh. 260?", answer: "sh. 200 + sh. 50 + sh. 10", wrong: ["sh. 200 + sh. 100", "sh. 100 + sh. 50 + sh. 10"], why: "200 + 50 + 10 = 260. The other choices make 300 and 160." },
    ]),
    mastery: bank(meta, "mastery", [
      count([500, 200, 200, 50, 20]),
      count([100, 100, 50, 20, 5, 1]),
      convert(1000, 100),
      convert(100, 20),
      convert(50, 10),
      balance(1000, [520, 175], "a school bag and a water bottle"),
      balance(200, [65, 70, 40], "tomatoes, onions and sukuma wiki"),
      { prompt: "Wafula had sh. 900. He spent sh. 425. How much is left?", answer: "sh. 475", wrong: ["sh. 525", "sh. 1,325", "sh. 485"], why: "900 − 425 = 475." },
      { prompt: "A sh. 1,000 note is changed into sh. 200 notes. How many notes?", answer: "5", wrong: ["2", "10", "4"], why: "200 × 5 = 1,000." },
      { prompt: "Which is cheaper: 2 sodas at sh. 60 each, or 1 juice at sh. 110?", answer: "1 juice at sh. 110", wrong: ["2 sodas at sh. 60 each", "They cost the same"], why: "2 sodas cost 60 + 60 = sh. 120, which is more than sh. 110." },
    ]),
  },
};
