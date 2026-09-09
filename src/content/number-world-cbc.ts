import { Challenge } from "@/types/challenge";
import { Grade, QuestionOption, Skill } from "@/types/content";

type CBCQuestion = {
  id: string;
  grade: Grade;
  curriculumId: string;
  strand: string;
  subStrand: string;
  concept: string;
  activityType: string;
  prompt: string;
  correct: string;
  distractors: string[];
  skill: Skill;
  explanation: string;
  difficulty: 1 | 2 | 3;
};

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function makeQuestion(item: CBCQuestion): Challenge {
  const options: QuestionOption[] = shuffle([
    { id: "a", text: item.correct },
    ...item.distractors.map((text, index) => ({ id: String.fromCharCode(98 + index), text })),
  ]);

  return {
    id: `number-world-g${item.grade}-${item.id}`,
    subject: "mathematics",
    grade: item.grade,
    skill: item.skill,
    prompt: item.prompt,
    options,
    correctOptionId: options.find((option) => option.text === item.correct)?.id ?? "a",
    explanation: item.explanation,
    xp: 10,
    difficulty: item.difficulty,
    curriculumId: item.curriculumId,
    strand: item.strand,
    subStrand: item.subStrand,
    concept: item.concept,
    activityType: item.activityType,
  };
}

const QUESTIONS: CBCQuestion[] = [
  // Grade 1 — KICD Numbers, Measurements and Geometry.
  { id: "g1-count-1", grade: 1, curriculumId: "g1-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Counting objects", activityType: "count_and_match", prompt: "Count the mangoes: 🥭 🥭 🥭 🥭. How many are there?", correct: "4", distractors: ["3", "5", "6"], skill: "number_sense", explanation: "Count each mango once: 1, 2, 3, 4. There are 4 mangoes.", difficulty: 1 },
  { id: "g1-count-2", grade: 1, curriculumId: "g1-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Number representation", activityType: "build_it", prompt: "Which group shows 7 counters?", correct: "● ● ● ● ● ● ●", distractors: ["● ● ● ● ● ●", "● ● ● ● ● ● ● ●", "● ● ● ● ●"], skill: "number_sense", explanation: "Seven counters are seven objects.", difficulty: 1 },
  { id: "g1-pattern-1", grade: 1, curriculumId: "g1-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Number patterns", activityType: "pattern_builder", prompt: "What number is missing? 4, 5, __, 7", correct: "6", distractors: ["5", "8", "9"], skill: "number_sense", explanation: "The numbers increase by 1, so 6 comes between 5 and 7.", difficulty: 1 },
  { id: "g1-add-1", grade: 1, curriculumId: "g1-numbers-addition", strand: "Numbers", subStrand: "Addition", concept: "Combining quantities", activityType: "solve_it", prompt: "Asha has 3 oranges and gets 2 more. How many oranges does she have?", correct: "5", distractors: ["4", "6", "7"], skill: "addition_subtraction", explanation: "3 + 2 = 5 oranges.", difficulty: 1 },
  { id: "g1-add-2", grade: 1, curriculumId: "g1-numbers-addition", strand: "Numbers", subStrand: "Addition", concept: "Basic addition facts", activityType: "quick_question", prompt: "What is 6 + 3?", correct: "9", distractors: ["8", "10", "7"], skill: "addition_subtraction", explanation: "6 + 3 = 9.", difficulty: 1 },
  { id: "g1-sub-1", grade: 1, curriculumId: "g1-numbers-subtraction", strand: "Numbers", subStrand: "Subtraction", concept: "Taking away", activityType: "solve_it", prompt: "There are 8 birds. 3 fly away. How many remain?", correct: "5", distractors: ["4", "6", "11"], skill: "addition_subtraction", explanation: "8 - 3 = 5 birds remain.", difficulty: 1 },
  { id: "g1-length", grade: 1, curriculumId: "g1-measurement-length", strand: "Measurements", subStrand: "Length", concept: "Comparing length", activityType: "sort_and_order", prompt: "Which object is likely to be longer?", correct: "A school ruler", distractors: ["A pencil tip", "A bottle cap", "A grain of maize"], skill: "measurement_geometry", explanation: "A school ruler is much longer than the other small objects.", difficulty: 1 },
  { id: "g1-capacity", grade: 1, curriculumId: "g1-measurement-capacity", strand: "Measurements", subStrand: "Capacity", concept: "Comparing capacity", activityType: "sort_and_order", prompt: "Which can hold more water?", correct: "A 2-litre jerrycan", distractors: ["A teaspoon", "A bottle cap", "A small cup"], skill: "measurement_geometry", explanation: "A 2-litre jerrycan has a greater capacity than the smaller containers.", difficulty: 1 },
  { id: "g1-money", grade: 1, curriculumId: "g1-measurement-money", strand: "Measurements", subStrand: "Money", concept: "Counting Kenyan money", activityType: "real_life_mission", prompt: "You have a KES 10 coin and a KES 5 coin. How much money do you have?", correct: "KES 15", distractors: ["KES 5", "KES 10", "KES 20"], skill: "problem_solving", explanation: "10 + 5 = KES 15.", difficulty: 1 },
  { id: "g1-time", grade: 1, curriculumId: "g1-measurement-time", strand: "Measurements", subStrand: "Time", concept: "Reading time", activityType: "find_it", prompt: "How many days are in one week?", correct: "7", distractors: ["5", "6", "8"], skill: "measurement_geometry", explanation: "A week has 7 days.", difficulty: 1 },
  { id: "g1-shapes", grade: 1, curriculumId: "g1-geometry-shapes", strand: "Geometry", subStrand: "Shapes", concept: "Identifying shapes", activityType: "sort_and_order", prompt: "Which shape has 3 sides?", correct: "Triangle", distractors: ["Circle", "Rectangle", "Oval"], skill: "measurement_geometry", explanation: "A triangle has three sides.", difficulty: 1 },
  { id: "g1-lines", grade: 1, curriculumId: "g1-geometry-lines", strand: "Geometry", subStrand: "Lines", concept: "Straight and curved lines", activityType: "find_it", prompt: "Which line is straight?", correct: "────────", distractors: ["~~~~~~~", "((((((", "))))))"], skill: "measurement_geometry", explanation: "The first line does not bend, so it is straight.", difficulty: 1 },

  // Grade 2.
  { id: "g2-place", grade: 2, curriculumId: "g2-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Place value", activityType: "build_it", prompt: "In 47, what is the value of 4?", correct: "40", distractors: ["4", "7", "47"], skill: "number_sense", explanation: "4 is in the tens place, so its value is 40.", difficulty: 1 },
  { id: "g2-order", grade: 2, curriculumId: "g2-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Ordering numbers", activityType: "sort_and_order", prompt: "Which number is greatest? 36, 63, 46, 56", correct: "63", distractors: ["36", "46", "56"], skill: "number_sense", explanation: "63 has the greatest tens digit.", difficulty: 1 },
  { id: "g2-pattern", grade: 2, curriculumId: "g2-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Number patterns", activityType: "pattern_builder", prompt: "What comes next? 15, 20, 25, 30, __", correct: "35", distractors: ["32", "34", "40"], skill: "number_sense", explanation: "The pattern increases by 5 each time.", difficulty: 1 },
  { id: "g2-add", grade: 2, curriculumId: "g2-numbers-addition", strand: "Numbers", subStrand: "Addition", concept: "Two-digit addition", activityType: "calculate_it", prompt: "What is 38 + 24?", correct: "62", distractors: ["52", "60", "72"], skill: "addition_subtraction", explanation: "38 + 24 = 62.", difficulty: 2 },
  { id: "g2-sub", grade: 2, curriculumId: "g2-numbers-subtraction", strand: "Numbers", subStrand: "Subtraction", concept: "Two-digit subtraction", activityType: "calculate_it", prompt: "What is 72 - 38?", correct: "34", distractors: ["32", "36", "44"], skill: "addition_subtraction", explanation: "72 - 38 = 34.", difficulty: 2 },
  { id: "g2-length", grade: 2, curriculumId: "g2-measurement-length", strand: "Measurements", subStrand: "Length", concept: "Centimetres and metres", activityType: "build_and_measure", prompt: "Which unit is more suitable for measuring the length of a classroom?", correct: "Metres", distractors: ["Centimetres", "Millimetres", "Coins"], skill: "measurement_geometry", explanation: "A classroom is large enough that metres are a useful unit.", difficulty: 1 },
  { id: "g2-mass", grade: 2, curriculumId: "g2-measurement-mass", strand: "Measurements", subStrand: "Mass", concept: "Comparing mass", activityType: "sort_and_order", prompt: "Which is likely to be heavier?", correct: "A full 2 kg bag of maize flour", distractors: ["A pencil", "A spoon", "A leaf"], skill: "measurement_geometry", explanation: "The 2 kg bag has much greater mass.", difficulty: 1 },
  { id: "g2-time", grade: 2, curriculumId: "g2-measurement-time", strand: "Measurements", subStrand: "Time", concept: "Calendar", activityType: "find_it", prompt: "How many months are in one year?", correct: "12", distractors: ["10", "11", "13"], skill: "measurement_geometry", explanation: "There are 12 months in one year.", difficulty: 1 },
  { id: "g2-money", grade: 2, curriculumId: "g2-measurement-money", strand: "Measurements", subStrand: "Money", concept: "Shopping", activityType: "real_life_mission", prompt: "A juice costs KES 30 and a bun costs KES 20. How much do they cost together?", correct: "KES 50", distractors: ["KES 40", "KES 60", "KES 10"], skill: "problem_solving", explanation: "30 + 20 = KES 50.", difficulty: 1 },
  { id: "g2-capacity", grade: 2, curriculumId: "g2-measurement-capacity", strand: "Measurements", subStrand: "Capacity", concept: "Litres", activityType: "build_and_measure", prompt: "Which is the most sensible capacity for a large jerrycan?", correct: "20 litres", distractors: ["20 millilitres", "2 millilitres", "2 litres"], skill: "measurement_geometry", explanation: "A large jerrycan can hold many litres; 20 litres is sensible.", difficulty: 2 },
  { id: "g2-shapes", grade: 2, curriculumId: "g2-geometry-shapes", strand: "Geometry", subStrand: "Shapes", concept: "Shape properties", activityType: "sort_and_order", prompt: "Which shape has four equal sides?", correct: "Square", distractors: ["Triangle", "Circle", "Oval"], skill: "measurement_geometry", explanation: "A square has four equal sides.", difficulty: 1 },
  { id: "g2-lines", grade: 2, curriculumId: "g2-geometry-lines", strand: "Geometry", subStrand: "Lines", concept: "Modelling lines", activityType: "find_it", prompt: "Which pair contains one straight line and one curved line?", correct: "──── and ~~~~", distractors: ["──── and ────", "~~~~ and ~~~~", "(((( and ))))"], skill: "measurement_geometry", explanation: "The first option contains a straight and a curved line.", difficulty: 1 },

  // Grade 3.
  { id: "g3-count", grade: 3, curriculumId: "g3-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Counting to 1000", activityType: "count_and_match", prompt: "What comes after 398?", correct: "399", distractors: ["389", "400", "3980"], skill: "number_sense", explanation: "Counting forward by one after 398 gives 399.", difficulty: 1 },
  { id: "g3-place", grade: 3, curriculumId: "g3-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Place value to hundreds", activityType: "build_it", prompt: "What is the value of 7 in 572?", correct: "70", distractors: ["7", "700", "570"], skill: "number_sense", explanation: "7 is in the tens place, so its value is 70.", difficulty: 2 },
  { id: "g3-pattern", grade: 3, curriculumId: "g3-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Number patterns to 1000", activityType: "pattern_builder", prompt: "What comes next? 300, 400, 500, __", correct: "600", distractors: ["550", "590", "700"], skill: "number_sense", explanation: "The pattern increases by 100.", difficulty: 1 },
  { id: "g3-add", grade: 3, curriculumId: "g3-numbers-addition", strand: "Numbers", subStrand: "Addition", concept: "Three-digit addition", activityType: "calculate_it", prompt: "What is 347 + 125?", correct: "472", distractors: ["462", "482", "572"], skill: "addition_subtraction", explanation: "347 + 125 = 472.", difficulty: 2 },
  { id: "g3-sub", grade: 3, curriculumId: "g3-numbers-subtraction", strand: "Numbers", subStrand: "Subtraction", concept: "Three-digit subtraction", activityType: "calculate_it", prompt: "What is 604 - 278?", correct: "326", distractors: ["316", "336", "426"], skill: "addition_subtraction", explanation: "604 - 278 = 326.", difficulty: 2 },
  { id: "g3-length", grade: 3, curriculumId: "g3-measurement-length", strand: "Measurements", subStrand: "Length", concept: "Measurement problems", activityType: "real_life_mission", prompt: "A rope is 3 m long. Another rope is 2 m long. How long are they together?", correct: "5 m", distractors: ["1 m", "4 m", "6 m"], skill: "measurement_geometry", explanation: "3 m + 2 m = 5 m.", difficulty: 1 },
  { id: "g3-mass", grade: 3, curriculumId: "g3-measurement-mass", strand: "Measurements", subStrand: "Mass", concept: "Mass problems", activityType: "real_life_mission", prompt: "A shop has 5 kg of rice and sells 2 kg. How much remains?", correct: "3 kg", distractors: ["2 kg", "4 kg", "7 kg"], skill: "measurement_geometry", explanation: "5 kg - 2 kg = 3 kg.", difficulty: 1 },
  { id: "g3-capacity", grade: 3, curriculumId: "g3-measurement-capacity", strand: "Measurements", subStrand: "Capacity", concept: "Capacity problems", activityType: "real_life_mission", prompt: "A 10-litre container has 6 litres of water. How many more litres can it hold?", correct: "4 litres", distractors: ["3 litres", "5 litres", "16 litres"], skill: "measurement_geometry", explanation: "10 - 6 = 4 litres of space remain.", difficulty: 2 },
  { id: "g3-money", grade: 3, curriculumId: "g3-measurement-money", strand: "Measurements", subStrand: "Money", concept: "Adding Kenyan money", activityType: "real_life_mission", prompt: "You buy a pen for KES 35 and a ruler for KES 25. What is the total?", correct: "KES 60", distractors: ["KES 50", "KES 55", "KES 70"], skill: "problem_solving", explanation: "35 + 25 = KES 60.", difficulty: 1 },
  { id: "g3-time", grade: 3, curriculumId: "g3-measurement-time", strand: "Measurements", subStrand: "Time", concept: "Duration", activityType: "find_it", prompt: "A lesson starts at 9:00 and ends at 10:00. How long is it?", correct: "1 hour", distractors: ["30 minutes", "2 hours", "10 hours"], skill: "measurement_geometry", explanation: "10:00 is one hour after 9:00.", difficulty: 1 },
  { id: "g3-shapes", grade: 3, curriculumId: "g3-geometry-shapes", strand: "Geometry", subStrand: "Shapes", concept: "Classifying shapes", activityType: "sort_and_order", prompt: "Which shape has four equal sides and four corners?", correct: "Square", distractors: ["Triangle", "Circle", "Oval"], skill: "measurement_geometry", explanation: "A square has four equal sides and four corners.", difficulty: 1 },

  // Grade 4.
  { id: "g4-round", grade: 4, curriculumId: "g4-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Rounding numbers", activityType: "quick_question", prompt: "Round 347 to the nearest ten.", correct: "350", distractors: ["340", "300", "400"], skill: "number_sense", explanation: "The ones digit is 7, so 347 rounds up to 350.", difficulty: 2 },
  { id: "g4-factors", grade: 4, curriculumId: "g4-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Factors", activityType: "sort_and_order", prompt: "Which number is a factor of 24?", correct: "6", distractors: ["5", "7", "10"], skill: "number_sense", explanation: "24 ÷ 6 = 4, so 6 is a factor of 24.", difficulty: 2 },
  { id: "g4-multiply", grade: 4, curriculumId: "g4-numbers-multiplication", strand: "Numbers", subStrand: "Multiplication", concept: "Multi-digit multiplication", activityType: "calculate_it", prompt: "What is 24 × 6?", correct: "144", distractors: ["124", "134", "154"], skill: "multiplication_division", explanation: "24 × 6 = 144.", difficulty: 2 },
  { id: "g4-divide", grade: 4, curriculumId: "g4-numbers-division", strand: "Numbers", subStrand: "Division", concept: "Division facts", activityType: "calculate_it", prompt: "What is 144 ÷ 12?", correct: "12", distractors: ["10", "11", "14"], skill: "multiplication_division", explanation: "12 × 12 = 144, so the quotient is 12.", difficulty: 2 },
  { id: "g4-fraction", grade: 4, curriculumId: "g4-numbers-fractions", strand: "Numbers", subStrand: "Fractions", concept: "Equivalent fractions", activityType: "find_it", prompt: "Which fraction is equivalent to 1/2?", correct: "2/4", distractors: ["1/3", "3/5", "2/3"], skill: "fractions_decimals", explanation: "2/4 represents the same part as 1/2.", difficulty: 2 },
  { id: "g4-decimal", grade: 4, curriculumId: "g4-numbers-decimals", strand: "Numbers", subStrand: "Decimals", concept: "Decimal place value", activityType: "build_it", prompt: "What is the value of 7 in 4.72?", correct: "0.7", distractors: ["7", "0.07", "70"], skill: "fractions_decimals", explanation: "7 is in the tenths place, so its value is 0.7.", difficulty: 2 },
  { id: "g4-area", grade: 4, curriculumId: "g4-measurement-area", strand: "Measurement", subStrand: "Area", concept: "Area of rectangles", activityType: "solve_it", prompt: "A rectangle is 8 m long and 5 m wide. What is its area?", correct: "40 m²", distractors: ["13 m²", "26 m²", "80 m²"], skill: "measurement_geometry", explanation: "Area = 8 × 5 = 40 m².", difficulty: 2 },
  { id: "g4-money", grade: 4, curriculumId: "g4-measurement-money", strand: "Measurement", subStrand: "Money", concept: "Change", activityType: "real_life_mission", prompt: "A book costs KES 350. You pay KES 500. What change should you receive?", correct: "KES 150", distractors: ["KES 100", "KES 120", "KES 200"], skill: "problem_solving", explanation: "500 - 350 = KES 150.", difficulty: 2 },
  { id: "g4-angle", grade: 4, curriculumId: "g4-geometry-angles", strand: "Geometry", subStrand: "Angles", concept: "Angle types", activityType: "sort_and_order", prompt: "An angle smaller than a right angle is called what?", correct: "Acute", distractors: ["Obtuse", "Straight", "Reflex"], skill: "measurement_geometry", explanation: "An acute angle is smaller than 90 degrees.", difficulty: 2 },
  { id: "g4-data", grade: 4, curriculumId: "g4-data-handling-data", strand: "Data Handling", subStrand: "Data", concept: "Interpreting data", activityType: "read_it", prompt: "A class records 8 red, 5 blue and 3 green balls. Which colour has the greatest count?", correct: "Red", distractors: ["Blue", "Green", "They are equal"], skill: "problem_solving", explanation: "8 is greater than 5 and 3, so red has the greatest count.", difficulty: 1 },
  { id: "g4-letters", grade: 4, curriculumId: "g4-numbers-use-of-letters", strand: "Numbers", subStrand: "Use of Letters", concept: "Unknowns", activityType: "solve_it", prompt: "If n + 7 = 15, what is n?", correct: "8", distractors: ["7", "9", "22"], skill: "problem_solving", explanation: "8 + 7 = 15, so n = 8.", difficulty: 2 },

  // Grade 5.
  { id: "g5-round", grade: 5, curriculumId: "g5-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Rounding to thousands", activityType: "quick_question", prompt: "Round 46,780 to the nearest thousand.", correct: "47,000", distractors: ["46,000", "46,800", "50,000"], skill: "number_sense", explanation: "The hundreds digit is 7, so 46,780 rounds to 47,000.", difficulty: 2 },
  { id: "g5-hcf", grade: 5, curriculumId: "g5-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "HCF/GCD", activityType: "solve_it", prompt: "What is the HCF of 12 and 18?", correct: "6", distractors: ["3", "4", "9"], skill: "number_sense", explanation: "6 is the greatest number that divides both 12 and 18.", difficulty: 3 },
  { id: "g5-fraction", grade: 5, curriculumId: "g5-numbers-fractions", strand: "Numbers", subStrand: "Fractions", concept: "Adding fractions", activityType: "calculate_it", prompt: "What is 3/4 + 1/8?", correct: "7/8", distractors: ["4/12", "5/8", "1"], skill: "fractions_decimals", explanation: "3/4 = 6/8, and 6/8 + 1/8 = 7/8.", difficulty: 3 },
  { id: "g5-decimal", grade: 5, curriculumId: "g5-numbers-decimals", strand: "Numbers", subStrand: "Decimals", concept: "Decimal operations", activityType: "calculate_it", prompt: "What is 4.75 + 2.6?", correct: "7.35", distractors: ["6.35", "7.25", "7.85"], skill: "fractions_decimals", explanation: "4.75 + 2.60 = 7.35.", difficulty: 2 },
  { id: "g5-equation", grade: 5, curriculumId: "g5-numbers-simple-equations", strand: "Numbers", subStrand: "Simple Equations", concept: "Solving equations", activityType: "solve_it", prompt: "If 3x = 21, what is x?", correct: "7", distractors: ["6", "8", "9"], skill: "problem_solving", explanation: "21 ÷ 3 = 7, so x = 7.", difficulty: 3 },
  { id: "g5-capacity", grade: 5, curriculumId: "g5-measurement-capacity", strand: "Measurement", subStrand: "Capacity", concept: "Capacity conversion", activityType: "build_and_measure", prompt: "How many millilitres are in 2 litres?", correct: "2,000 ml", distractors: ["200 ml", "20 ml", "20,000 ml"], skill: "measurement_geometry", explanation: "1 litre = 1,000 ml, so 2 litres = 2,000 ml.", difficulty: 2 },
  { id: "g5-mass", grade: 5, curriculumId: "g5-measurement-mass", strand: "Measurement", subStrand: "Mass", concept: "Mass conversion", activityType: "build_and_measure", prompt: "How many grams are in 3 kilograms?", correct: "3,000 g", distractors: ["300 g", "30 g", "30,000 g"], skill: "measurement_geometry", explanation: "1 kg = 1,000 g, so 3 kg = 3,000 g.", difficulty: 2 },
  { id: "g5-money", grade: 5, curriculumId: "g5-measurement-money", strand: "Measurement", subStrand: "Money", concept: "Financial problems", activityType: "real_life_mission", prompt: "A family buys 4 kg of rice at KES 180 per kg. What is the cost?", correct: "KES 720", distractors: ["KES 540", "KES 680", "KES 900"], skill: "problem_solving", explanation: "4 × 180 = KES 720.", difficulty: 2 },
  { id: "g5-angles", grade: 5, curriculumId: "g5-geometry-angles", strand: "Geometry", subStrand: "Angles", concept: "Measuring angles", activityType: "find_it", prompt: "How many degrees are in a right angle?", correct: "90°", distractors: ["45°", "60°", "180°"], skill: "measurement_geometry", explanation: "A right angle measures 90 degrees.", difficulty: 1 },
  { id: "g5-3d", grade: 5, curriculumId: "g5-geometry-three-dimension-3-d-objects", strand: "Geometry", subStrand: "Three Dimension (3-D) Objects", concept: "Faces, edges and vertices", activityType: "find_it", prompt: "How many faces does a cube have?", correct: "6", distractors: ["4", "8", "12"], skill: "measurement_geometry", explanation: "A cube has 6 square faces.", difficulty: 1 },
  { id: "g5-data", grade: 5, curriculumId: "g5-data-handling-data-representation", strand: "Data Handling", subStrand: "Data Representation", concept: "Reading charts", activityType: "read_it", prompt: "A chart shows 12 learners chose football, 8 chose athletics and 5 chose swimming. Which activity is most popular?", correct: "Football", distractors: ["Athletics", "Swimming", "They are equal"], skill: "problem_solving", explanation: "12 is the greatest value, so football is most popular.", difficulty: 1 },

  // Grade 6.
  { id: "g6-round", grade: 6, curriculumId: "g6-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Rounding to thousands", activityType: "quick_question", prompt: "Round 3,746,210 to the nearest thousand.", correct: "3,746,000", distractors: ["3,747,000", "3,740,000", "3,750,000"], skill: "number_sense", explanation: "The hundreds digit is 2, so the thousands stay at 746.", difficulty: 2 },
  { id: "g6-square", grade: 6, curriculumId: "g6-numbers-whole-numbers", strand: "Numbers", subStrand: "Whole Numbers", concept: "Squares and square roots", activityType: "find_it", prompt: "What is the square root of 144?", correct: "12", distractors: ["11", "13", "14"], skill: "number_sense", explanation: "12 × 12 = 144, so √144 = 12.", difficulty: 3 },
  { id: "g6-multiply", grade: 6, curriculumId: "g6-numbers-multiplication", strand: "Numbers", subStrand: "Multiplication", concept: "Four-digit by two-digit multiplication", activityType: "calculate_it", prompt: "What is 1,204 × 12?", correct: "14,448", distractors: ["13,448", "14,248", "15,448"], skill: "multiplication_division", explanation: "1,204 × 12 = 1,204 × 10 + 1,204 × 2 = 12,040 + 2,408 = 14,448.", difficulty: 3 },
  { id: "g6-divide", grade: 6, curriculumId: "g6-numbers-division", strand: "Numbers", subStrand: "Division", concept: "Multi-digit division", activityType: "calculate_it", prompt: "What is 1,728 ÷ 24?", correct: "72", distractors: ["62", "68", "82"], skill: "multiplication_division", explanation: "24 × 72 = 1,728.", difficulty: 3 },
  { id: "g6-fraction", grade: 6, curriculumId: "g6-numbers-fractions", strand: "Numbers", subStrand: "Fractions", concept: "Adding fractions with unlike denominators", activityType: "calculate_it", prompt: "What is 2/3 + 1/6?", correct: "5/6", distractors: ["3/9", "1/2", "4/6"], skill: "fractions_decimals", explanation: "2/3 = 4/6, so 4/6 + 1/6 = 5/6.", difficulty: 3 },
  { id: "g6-decimal", grade: 6, curriculumId: "g6-numbers-decimals", strand: "Numbers", subStrand: "Decimals", concept: "Decimal operations", activityType: "calculate_it", prompt: "What is 6.4 ÷ 0.8?", correct: "8", distractors: ["0.8", "5.6", "80"], skill: "fractions_decimals", explanation: "6.4 ÷ 0.8 = 8.", difficulty: 3 },
  { id: "g6-inequality", grade: 6, curriculumId: "g6-numbers-inequalities", strand: "Numbers", subStrand: "Inequalities", concept: "Solving simple inequalities", activityType: "solve_it", prompt: "Which value makes x + 4 > 10 true?", correct: "7", distractors: ["5", "6", "4"], skill: "problem_solving", explanation: "7 + 4 = 11, which is greater than 10.", difficulty: 3 },
  { id: "g6-money", grade: 6, curriculumId: "g6-measurement-money", strand: "Measurement", subStrand: "Money", concept: "Percentage applications", activityType: "real_life_mission", prompt: "A school bag costs KES 2,000. A 10% discount is offered. How much is the discount?", correct: "KES 200", distractors: ["KES 100", "KES 150", "KES 300"], skill: "problem_solving", explanation: "10% of KES 2,000 is KES 200.", difficulty: 2 },
  { id: "g6-angle", grade: 6, curriculumId: "g6-geometry-angles", strand: "Geometry", subStrand: "Angles", concept: "Angle relationships", activityType: "find_it", prompt: "Two angles on a straight line add up to how many degrees?", correct: "180°", distractors: ["90°", "270°", "360°"], skill: "measurement_geometry", explanation: "Angles on a straight line sum to 180 degrees.", difficulty: 2 },
  { id: "g6-bargraph", grade: 6, curriculumId: "g6-data-handling-bar-graphs", strand: "Data Handling", subStrand: "Bar Graphs", concept: "Reading bar graphs", activityType: "read_it", prompt: "A bar graph shows 24 learners chose football and 16 chose basketball. How many more chose football?", correct: "8", distractors: ["6", "10", "40"], skill: "problem_solving", explanation: "24 - 16 = 8 learners.", difficulty: 2 },
];

export const NUMBER_WORLD_CBC_BANK: Challenge[] = QUESTIONS.map(makeQuestion);

export function getCBCNumberWorldChallenges(grade: string): Challenge[] {
  const numericGrade = Number(grade.replace(/\D/g, ""));
  const safeGrade = (numericGrade >= 1 && numericGrade <= 6 ? numericGrade : 1) as Grade;
  return NUMBER_WORLD_CBC_BANK.filter((question) => question.grade === safeGrade);
}
