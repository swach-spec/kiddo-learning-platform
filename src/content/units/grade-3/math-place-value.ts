import { LearningUnit } from "@/types/learning-unit";
import { bank, distinct, fmt, Q, UnitMeta } from "@/content/units/builders";

const meta: UnitMeta = {
  unitId: "g3-math-place-value",
  grade: 3,
  subject: "mathematics",
  skill: "number_sense",
  strand: "Numbers",
  subStrand: "Whole Numbers",
  concept: "place value up to hundreds",
};

const PLACE = ["ones", "tens", "hundreds"] as const;
const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

/** Number words up to 100, as the design requires ("read and write numbers 1 to 100 in words"). */
function words(value: number): string {
  if (value === 100) return "one hundred";
  if (value < 20) return ONES[value];
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return ones ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens];
}

function digitAt(value: number, place: 0 | 1 | 2): number {
  return Math.floor(value / 10 ** place) % 10;
}

/** "What is the place value of 7 in 472?" → tens */
function placeOf(value: number, place: 0 | 1 | 2): Q {
  const digit = digitAt(value, place);
  return {
    prompt: `What is the place value of ${digit} in ${value}?`,
    answer: PLACE[place],
    wrong: [...PLACE.filter((name) => name !== PLACE[place]), "thousands"],
    why: `In ${value}, the digit ${digit} is in the ${PLACE[place]} place.`,
  };
}

/** "What is the value of 4 in 472?" → 400 */
function valueOf(value: number, place: 0 | 1 | 2): Q {
  const digit = digitAt(value, place);
  const total = digit * 10 ** place;
  return {
    prompt: `What is the value of the digit ${digit} in ${value}?`,
    answer: String(total),
    wrong: distinct(String(total), [String(digit), String(digit * 10), String(digit * 100), String(digit * 1000)]),
    why: `${digit} is in the ${PLACE[place]} place, so its value is ${digit} × ${10 ** place} = ${total}.`,
  };
}

/** "Which number has 3 hundreds, 0 tens and 6 ones?" → 306 */
function build(hundreds: number, tens: number, ones: number): Q {
  const answer = hundreds * 100 + tens * 10 + ones;
  return {
    prompt: `Which number has ${hundreds} hundreds, ${tens} tens and ${ones} ones?`,
    answer: String(answer),
    wrong: distinct(String(answer), [`${hundreds}${ones}${tens}`, `${ones}${tens}${hundreds}`, String(hundreds + tens + ones), `${tens}${hundreds}${ones}`]),
    why: `${hundreds} hundreds = ${hundreds * 100}, ${tens} tens = ${tens * 10}, ${ones} ones = ${ones}. Together that makes ${answer}.`,
  };
}

/** Reading numbers in words (1–100). */
function inWords(value: number): Q {
  return {
    prompt: `How do we write ${value} in words?`,
    answer: words(value),
    wrong: distinct(words(value), [words((value % 10) * 10 + Math.floor(value / 10) || 1), words(Math.max(1, value - 10)), words(Math.min(100, value + 1)), words(Math.min(99, value + 10))]),
    why: `${value} is written as "${words(value)}".`,
  };
}

function fromWords(value: number): Q {
  return {
    prompt: `Which number is "${words(value)}"?`,
    answer: String(value),
    wrong: distinct(String(value), [String((value % 10) * 10 + Math.floor(value / 10)), String(value + 10), String(value - 1), String(value + 100)]),
    why: `"${words(value)}" is the number ${value}.`,
  };
}

/** Missing number in a counting pattern up to 1000. */
function pattern(start: number, step: number, missingIndex: number): Q {
  const terms = [0, 1, 2, 3, 4].map((index) => start + index * step);
  const answer = terms[missingIndex];
  const shown = terms.map((term, index) => (index === missingIndex ? "___" : String(term))).join(", ");
  const direction = step > 0 ? "adds" : "takes away";
  return {
    prompt: `Find the missing number: ${shown}`,
    answer: String(answer),
    wrong: distinct(String(answer), [String(answer + step), String(answer - step), String(answer + 1), String(answer + 10)]),
    why: `The pattern ${direction} ${Math.abs(step)} each time, so the missing number is ${answer}.`,
  };
}

/** Compare two numbers using place value. */
function bigger(a: number, b: number): Q {
  const answer = Math.max(a, b);
  const smaller = Math.min(a, b);
  return {
    prompt: `Which number is greater: ${a} or ${b}?`,
    answer: String(answer),
    wrong: [String(smaller), "They are equal"],
    why: `Compare the hundreds first, then the tens, then the ones. ${answer} is greater than ${smaller}.`,
  };
}

/** Real-life use of whole numbers. */
function story(prompt: string, answer: number, wrong: number[], why: string): Q {
  return { prompt, answer: fmt(answer), wrong: distinct(fmt(answer), wrong.map(fmt)), why };
}

export const g3MathPlaceValue: LearningUnit = {
  id: meta.unitId,
  grade: 3,
  subject: "mathematics",
  strand: meta.strand,
  subStrand: meta.subStrand,
  concept: meta.concept,
  objectives: [
    "Identify the place value of numbers up to hundreds.",
    "Read numbers 1 to 1000 in symbols, and read and write numbers 1 to 100 in words.",
    "Identify missing numbers in number patterns up to 1000.",
  ],
  source: { document: "KICD Grade 3 Mathematical Activities curriculum design", subStrand: "1.2 Whole Numbers", verified: true },
  title: "Place Value",
  description: "Find out what each digit in a number is worth, up to 1000.",
  icon: "🔢",
  skill: "number_sense",
  lesson: {
    id: "g3-math-place-value-lesson",
    subject: "mathematics",
    grade: 3,
    title: "Place Value",
    subtitle: "Every digit has a place, and every place has a value.",
    skill: "number_sense",
    icon: "🔢",
    estimatedMinutes: 6,
    xp: 20,
    steps: [
      { id: "g3pv-teach", type: "teach", title: "Hundreds, tens and ones", body: "In a 3-digit number, each digit sits in a place. From the right, the places are ones, tens and hundreds." },
      { id: "g3pv-example", type: "example", title: "Look at 352", body: "352 has 3 hundreds, 5 tens and 2 ones.", example: "3 hundreds = 300 • 5 tens = 50 • 2 ones = 2", explanation: "300 + 50 + 2 = 352. The place tells us what each digit is worth." },
      { id: "g3pv-try", type: "try", title: "Try it", body: "In 461, which place is the 6 in?", options: ["tens", "ones", "hundreds"], correctOption: "tens", explanation: "4 is hundreds, 6 is tens and 1 is ones." },
      { id: "g3pv-example-2", type: "example", title: "The value of a digit", body: "In 528, the 5 is in the hundreds place, so it is worth 500.", example: "5 → 500 • 2 → 20 • 8 → 8", explanation: "To find a digit's value, multiply it by its place: 5 × 100 = 500." },
      { id: "g3pv-try-2", type: "try", title: "Try it", body: "What is the value of 7 in 274?", options: ["70", "7", "700"], correctOption: "70", explanation: "7 is in the tens place, so its value is 7 × 10 = 70." },
      { id: "g3pv-master", type: "master", title: "Ready to practise?", body: "You can find the place and the value of each digit. Let's practise together." },
    ],
  },
  banks: {
    support: bank(meta, "support", [
      { prompt: "In 35, which digit is in the tens place?", answer: "3", wrong: ["5", "35"], why: "In 35, the 3 is tens and the 5 is ones." },
      { prompt: "How many tens are in 40?", answer: "4", wrong: ["40", "0"], why: "40 is 4 tens and 0 ones." },
      build(1, 2, 3),
      placeOf(58, 0),
      { prompt: "Which number is 2 tens and 6 ones?", answer: "26", wrong: ["62", "8"], why: "2 tens = 20 and 6 ones = 6. 20 + 6 = 26." },
      valueOf(47, 1),
    ]),
    guided: bank(meta, "guided", [
      placeOf(352, 1),
      placeOf(718, 2),
      placeOf(905, 0),
      valueOf(463, 2),
      valueOf(281, 1),
      build(2, 4, 7),
      fromWords(36),
      pattern(100, 100, 3),
    ]),
    independent: bank(meta, "independent", [
      placeOf(639, 1),
      valueOf(857, 2),
      valueOf(194, 1),
      build(6, 0, 8),
      inWords(73),
      fromWords(91),
      pattern(240, 10, 2),
      bigger(489, 498),
    ]),
    apply: bank(meta, "apply", [
      story("A school has 3 boxes of 100 books and 4 more books. How many books are there?", 304, [34, 340, 43], "3 hundreds and 4 ones make 304. There are no tens, so we write 0 in the tens place."),
      story("Wanjiru counts 100 beans, then 100 more, then 100 more. How many beans does she have?", 300, [3, 30, 103], "Counting in hundreds: 100, 200, 300."),
      story("A bus ticket number is 652. What is the value of the 5?", 50, [5, 500, 652], "5 is in the tens place, so it is worth 50."),
      story("Otieno's farm has 7 hundreds, 2 tens and 9 ones chicks. How many chicks is that?", 729, [792, 927, 18], "700 + 20 + 9 = 729."),
      { prompt: "Two classes collected 563 and 536 bottle tops. Which class collected more?", answer: "The class with 563", wrong: ["The class with 536", "Both collected the same"], why: "Both have 5 hundreds. Then compare tens: 6 tens is more than 3 tens, so 563 is greater." },
      story("A road sign says the market is 900 metres away. You walk 100 metres. How far is left?", 800, [890, 700, 899], "Counting back in hundreds from 900: 800."),
    ]),
    mastery: bank(meta, "mastery", [
      placeOf(507, 1),
      valueOf(936, 2),
      valueOf(682, 0),
      build(4, 9, 0),
      build(8, 0, 3),
      inWords(58),
      fromWords(100),
      pattern(1000, -100, 2),
      pattern(355, 5, 4),
      bigger(709, 790),
    ]),
  },
};
