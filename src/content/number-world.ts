import { Challenge } from "@/types/challenge";
import { Grade, QuestionOption, Skill } from "@/types/content";

type NumberQuestion = {
  id: string;
  prompt: string;
  correct: string;
  distractors: string[];
  skill: Skill;
  explanation: string;
  difficulty: 1 | 2 | 3;
};

function makeQuestion(grade: Grade, item: NumberQuestion): Challenge {
  const options: QuestionOption[] = [
    { id: "a", text: item.correct },
    ...item.distractors.map((text, index) => ({ id: String.fromCharCode(98 + index), text })),
  ];

  return {
    id: `number-world-g${grade}-${item.id}`,
    subject: "mathematics",
    grade,
    skill: item.skill,
    prompt: item.prompt,
    options: shuffle(options),
    correctOptionId: options.find((option) => option.text === item.correct)?.id ?? "a",
    explanation: item.explanation,
    xp: 10,
    difficulty: item.difficulty,
  };
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

const BANK: Record<Grade, NumberQuestion[]> = {
  1: [
    { id: "count-objects", prompt: "How many stars are there? ⭐ ⭐ ⭐ ⭐ ⭐", correct: "5", distractors: ["4", "6", "7"], skill: "number_sense", explanation: "Count each star: 1, 2, 3, 4, 5. There are 5 stars.", difficulty: 1 },
    { id: "compare-1", prompt: "Which number is greater: 7 or 4?", correct: "7", distractors: ["4", "3", "6"], skill: "number_sense", explanation: "7 is farther along the number line than 4, so 7 is greater.", difficulty: 1 },
    { id: "missing-1", prompt: "What number comes next? 2, 3, 4, __", correct: "5", distractors: ["6", "3", "7"], skill: "number_sense", explanation: "The numbers increase by 1, so 5 comes after 4.", difficulty: 1 },
    { id: "add-1", prompt: "What is 3 + 2?", correct: "5", distractors: ["4", "6", "7"], skill: "addition_subtraction", explanation: "Start at 3 and count two more: 4, 5. So 3 + 2 = 5.", difficulty: 1 },
    { id: "add-2", prompt: "What is 6 + 3?", correct: "9", distractors: ["8", "10", "7"], skill: "addition_subtraction", explanation: "6 + 3 = 9.", difficulty: 1 },
    { id: "subtract-1", prompt: "What is 8 - 3?", correct: "5", distractors: ["4", "6", "7"], skill: "addition_subtraction", explanation: "Take 3 away from 8: 8, 7, 6, 5. The answer is 5.", difficulty: 1 },
    { id: "story-1", prompt: "Amina has 4 oranges. She gets 2 more. How many oranges does she have?", correct: "6", distractors: ["5", "7", "8"], skill: "problem_solving", explanation: "She starts with 4 and gets 2 more: 4 + 2 = 6.", difficulty: 1 },
    { id: "story-2", prompt: "There are 9 birds. 3 fly away. How many remain?", correct: "6", distractors: ["5", "7", "12"], skill: "problem_solving", explanation: "3 birds leave 9, so 9 - 3 = 6 birds remain.", difficulty: 1 },
  ],
  2: [
    { id: "place-1", prompt: "In 47, what is the value of the 4?", correct: "40", distractors: ["4", "7", "47"], skill: "number_sense", explanation: "The 4 is in the tens place, so its value is 40.", difficulty: 1 },
    { id: "compare-1", prompt: "Which number is smaller: 58 or 85?", correct: "58", distractors: ["85", "88", "50"], skill: "number_sense", explanation: "58 is smaller because 5 tens is less than 8 tens.", difficulty: 1 },
    { id: "pattern-1", prompt: "What comes next? 10, 20, 30, 40, __", correct: "50", distractors: ["45", "60", "41"], skill: "number_sense", explanation: "The pattern adds 10 each time, so 50 comes next.", difficulty: 1 },
    { id: "add-1", prompt: "What is 27 + 15?", correct: "42", distractors: ["32", "41", "52"], skill: "addition_subtraction", explanation: "27 + 15 = 42.", difficulty: 2 },
    { id: "subtract-1", prompt: "What is 54 - 28?", correct: "26", distractors: ["24", "36", "32"], skill: "addition_subtraction", explanation: "54 - 28 = 26.", difficulty: 2 },
    { id: "multiply-1", prompt: "What is 3 × 4?", correct: "12", distractors: ["7", "10", "14"], skill: "multiplication_division", explanation: "3 groups of 4 make 12, so 3 × 4 = 12.", difficulty: 2 },
    { id: "story-1", prompt: "A shop has 35 pencils and sells 12. How many pencils are left?", correct: "23", distractors: ["22", "24", "47"], skill: "problem_solving", explanation: "35 - 12 = 23 pencils remain.", difficulty: 2 },
    { id: "story-2", prompt: "There are 4 bags with 5 mangoes in each. How many mangoes are there?", correct: "20", distractors: ["9", "15", "25"], skill: "problem_solving", explanation: "4 groups of 5 make 20 mangoes.", difficulty: 2 },
  ],
  3: [
    { id: "place-1", prompt: "What is the value of the 6 in 3,642?", correct: "600", distractors: ["60", "6", "6,000"], skill: "number_sense", explanation: "The 6 is in the hundreds place, so its value is 600.", difficulty: 2 },
    { id: "fraction-1", prompt: "Which fraction means one half?", correct: "1/2", distractors: ["1/3", "2/3", "1/4"], skill: "fractions_decimals", explanation: "One half is written as 1/2.", difficulty: 2 },
    { id: "multiply-1", prompt: "What is 7 × 6?", correct: "42", distractors: ["36", "40", "48"], skill: "multiplication_division", explanation: "7 groups of 6 equal 42.", difficulty: 2 },
    { id: "divide-1", prompt: "What is 36 ÷ 4?", correct: "9", distractors: ["8", "10", "12"], skill: "multiplication_division", explanation: "36 shared equally into 4 groups gives 9 in each group.", difficulty: 2 },
    { id: "add-1", prompt: "What is 248 + 137?", correct: "385", distractors: ["375", "395", "3850"], skill: "addition_subtraction", explanation: "248 + 137 = 385.", difficulty: 2 },
    { id: "subtract-1", prompt: "What is 500 - 276?", correct: "224", distractors: ["214", "234", "324"], skill: "addition_subtraction", explanation: "500 - 276 = 224.", difficulty: 2 },
    { id: "story-1", prompt: "A farmer packs 6 baskets with 8 oranges in each. How many oranges?", correct: "48", distractors: ["14", "42", "56"], skill: "problem_solving", explanation: "6 × 8 = 48 oranges.", difficulty: 2 },
    { id: "story-2", prompt: "A class has 32 learners in 4 equal groups. How many learners are in each group?", correct: "8", distractors: ["6", "7", "9"], skill: "problem_solving", explanation: "32 ÷ 4 = 8 learners per group.", difficulty: 2 },
  ],
  4: [
    { id: "place-1", prompt: "What is the value of the 7 in 57,326?", correct: "7,000", distractors: ["700", "70", "7"], skill: "number_sense", explanation: "The 7 is in the thousands place, so its value is 7,000.", difficulty: 2 },
    { id: "fraction-1", prompt: "Which fraction is equivalent to 1/2?", correct: "2/4", distractors: ["2/3", "3/5", "1/4"], skill: "fractions_decimals", explanation: "2/4 simplifies to 1/2.", difficulty: 2 },
    { id: "multiply-1", prompt: "What is 24 × 3?", correct: "72", distractors: ["62", "68", "84"], skill: "multiplication_division", explanation: "24 × 3 = 72.", difficulty: 2 },
    { id: "divide-1", prompt: "What is 144 ÷ 12?", correct: "12", distractors: ["10", "11", "14"], skill: "multiplication_division", explanation: "12 × 12 = 144, so 144 ÷ 12 = 12.", difficulty: 2 },
    { id: "perimeter-1", prompt: "A rectangle is 6 cm long and 4 cm wide. What is its perimeter?", correct: "20 cm", distractors: ["10 cm", "16 cm", "24 cm"], skill: "measurement_geometry", explanation: "Perimeter = 2 × (6 + 4) = 20 cm.", difficulty: 2 },
    { id: "decimal-1", prompt: "Which decimal is equal to 7/10?", correct: "0.7", distractors: ["0.07", "7.0", "0.17"], skill: "fractions_decimals", explanation: "Seven tenths is 0.7.", difficulty: 2 },
    { id: "story-1", prompt: "A book has 180 pages. Sam reads 45 pages each week. How many weeks will it take?", correct: "4", distractors: ["3", "5", "6"], skill: "problem_solving", explanation: "180 ÷ 45 = 4 weeks.", difficulty: 2 },
    { id: "story-2", prompt: "A rectangular garden is 8 m by 5 m. What is its area?", correct: "40 m²", distractors: ["26 m²", "30 m²", "80 m²"], skill: "problem_solving", explanation: "Area = length × width = 8 × 5 = 40 m².", difficulty: 2 },
  ],
  5: [
    { id: "fraction-1", prompt: "What is 3/4 + 1/4?", correct: "1", distractors: ["1/2", "3/8", "4/8"], skill: "fractions_decimals", explanation: "The denominators match: 3/4 + 1/4 = 4/4 = 1.", difficulty: 2 },
    { id: "decimal-1", prompt: "What is 2.5 + 1.75?", correct: "4.25", distractors: ["3.25", "4.15", "4.75"], skill: "fractions_decimals", explanation: "2.50 + 1.75 = 4.25.", difficulty: 2 },
    { id: "percent-1", prompt: "What is 25% of 80?", correct: "20", distractors: ["15", "25", "30"], skill: "fractions_decimals", explanation: "25% is one quarter. One quarter of 80 is 20.", difficulty: 3 },
    { id: "ratio-1", prompt: "The ratio of red to blue balls is 2:3. How many parts are there altogether?", correct: "5", distractors: ["1", "6", "8"], skill: "number_sense", explanation: "2 + 3 = 5 total parts.", difficulty: 2 },
    { id: "multiply-1", prompt: "What is 36 × 14?", correct: "504", distractors: ["404", "514", "540"], skill: "multiplication_division", explanation: "36 × 14 = 36 × 10 + 36 × 4 = 360 + 144 = 504.", difficulty: 3 },
    { id: "area-1", prompt: "A rectangle is 12 cm by 7 cm. What is its area?", correct: "84 cm²", distractors: ["38 cm²", "72 cm²", "96 cm²"], skill: "measurement_geometry", explanation: "Area = 12 × 7 = 84 cm².", difficulty: 2 },
    { id: "story-1", prompt: "A trader buys 8 boxes at KES 125 each. What is the total cost?", correct: "KES 1,000", distractors: ["KES 900", "KES 875", "KES 1,250"], skill: "problem_solving", explanation: "8 × 125 = 1,000.", difficulty: 3 },
    { id: "story-2", prompt: "A tank holds 240 litres. It is 3/5 full. How many litres are in it?", correct: "144 litres", distractors: ["120 litres", "96 litres", "180 litres"], skill: "problem_solving", explanation: "240 × 3/5 = 144 litres.", difficulty: 3 },
  ],
  6: [
    { id: "fraction-1", prompt: "What is 2/3 + 1/6?", correct: "5/6", distractors: ["3/9", "1/2", "4/6"], skill: "fractions_decimals", explanation: "2/3 = 4/6, so 4/6 + 1/6 = 5/6.", difficulty: 3 },
    { id: "decimal-1", prompt: "What is 6.4 ÷ 0.8?", correct: "8", distractors: ["0.8", "5.6", "80"], skill: "fractions_decimals", explanation: "6.4 ÷ 0.8 = 8.", difficulty: 3 },
    { id: "percent-1", prompt: "A shirt costs KES 2,000. What is 15% of the price?", correct: "KES 300", distractors: ["KES 150", "KES 250", "KES 350"], skill: "fractions_decimals", explanation: "10% is 200 and 5% is 100, so 15% is 300.", difficulty: 3 },
    { id: "ratio-1", prompt: "Simplify the ratio 18:24.", correct: "3:4", distractors: ["2:3", "4:5", "6:8"], skill: "number_sense", explanation: "Divide both parts by 6: 18:24 becomes 3:4.", difficulty: 3 },
    { id: "algebra-1", prompt: "If x + 7 = 19, what is x?", correct: "12", distractors: ["10", "11", "13"], skill: "problem_solving", explanation: "Subtract 7 from both sides: x = 19 - 7 = 12.", difficulty: 3 },
    { id: "geometry-1", prompt: "What is the area of a triangle with base 10 cm and height 6 cm?", correct: "30 cm²", distractors: ["16 cm²", "60 cm²", "36 cm²"], skill: "measurement_geometry", explanation: "Area = 1/2 × base × height = 1/2 × 10 × 6 = 30 cm².", difficulty: 3 },
    { id: "story-1", prompt: "A school has 360 learners. 40% are girls. How many girls are there?", correct: "144", distractors: ["120", "140", "160"], skill: "problem_solving", explanation: "40% of 360 = 144.", difficulty: 3 },
    { id: "story-2", prompt: "A journey is 240 km. A car travels 3/8 of the distance. How far has it travelled?", correct: "90 km", distractors: ["60 km", "80 km", "120 km"], skill: "problem_solving", explanation: "240 × 3/8 = 90 km.", difficulty: 3 },
  ],
};

export const numberWorldChallenges: Challenge[] = (Object.entries(BANK) as [string, NumberQuestion[]][]).flatMap(([grade, questions]) =>
  questions.map((question) => makeQuestion(Number(grade) as Grade, question))
);

export function getNumberWorldChallenges(grade: string): Challenge[] {
  const match = grade.match(/(\d+)/);
  const gradeNumber = Math.min(6, Math.max(1, match ? Number(match[1]) : 1)) as Grade;
  return numberWorldChallenges.filter((challenge) => challenge.grade === gradeNumber);
}
