import { Grade } from "@/types/content";

/**
 * KIDDO Mathematics Curriculum Master Map
 *
 * Source basis: KICD revised 2024 regular Mathematics curriculum designs
 * for Grades 1-6. This is the internal curriculum spine for Number World.
 *
 * The map deliberately separates KICD curriculum structure from KIDDO's
 * learning/game implementation. Questions and activities should reference
 * these stable curriculum IDs rather than relying only on broad skills.
 */

export type MathStrandId =
  | "numbers"
  | "measurement"
  | "geometry"
  | "data_handling";

export type MathCurriculumNode = {
  id: string;
  grade: Grade;
  strand: MathStrandId;
  strandName: string;
  subStrand: string;
  lessons: number;
  concepts: string[];
  activityTypes: string[];
};

const LOWER_PRIMARY_ACTIVITY_TYPES = [
  "quick_question",
  "count_and_match",
  "sort_and_order",
  "build_it",
  "pattern_builder",
  "solve_it",
  "real_life_mission",
  "math_game",
];

const UPPER_PRIMARY_ACTIVITY_TYPES = [
  "quick_question",
  "calculate_it",
  "sort_and_order",
  "build_it",
  "find_it",
  "solve_it",
  "read_it",
  "real_life_mission",
  "math_game",
];

function lower(
  grade: Grade,
  strand: MathStrandId,
  strandName: string,
  subStrand: string,
  lessons: number,
  concepts: string[],
): MathCurriculumNode {
  const slug = subStrand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id: `g${grade}-${strand}-${slug}`,
    grade,
    strand,
    strandName,
    subStrand,
    lessons,
    concepts,
    activityTypes: LOWER_PRIMARY_ACTIVITY_TYPES,
  };
}

function upper(
  grade: Grade,
  strand: MathStrandId,
  strandName: string,
  subStrand: string,
  lessons: number,
  concepts: string[],
): MathCurriculumNode {
  const slug = subStrand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id: `g${grade}-${strand}-${slug}`,
    grade,
    strand,
    strandName,
    subStrand,
    lessons,
    concepts,
    activityTypes: UPPER_PRIMARY_ACTIVITY_TYPES,
  };
}

/**
 * Grade 1-3 revised 2024 design.
 * KICD groups Grades 1, 2 and 3 in one Mathematics Activities design.
 */
export const MATHEMATICS_CURRICULUM: MathCurriculumNode[] = [
  // Grade 1
  lower(1, "numbers", "Numbers", "Pre-Number Activities", 20, ["sorting", "matching", "ordering", "patterns"]),
  lower(1, "numbers", "Numbers", "Whole Numbers", 25, ["counting", "number representation", "number symbols", "number words", "number patterns"]),
  lower(1, "numbers", "Numbers", "Addition", 25, ["combining quantities", "addition symbols", "basic facts", "addition patterns"]),
  lower(1, "numbers", "Numbers", "Subtraction", 20, ["taking away", "subtraction symbols", "counting backwards", "subtraction patterns"]),
  lower(1, "measurement", "Measurements", "Length", 10, ["long and short", "metre", "measuring objects"]),
  lower(1, "measurement", "Measurements", "Mass", 10, ["heavy and light", "kilogram", "comparing mass"]),
  lower(1, "measurement", "Measurements", "Capacity", 12, ["more and less", "litre", "comparing capacity"]),
  lower(1, "measurement", "Measurements", "Time", 8, ["day", "date", "hour", "clock face"]),
  lower(1, "measurement", "Measurements", "Money", 8, ["Kenyan coins", "Kenyan notes", "counting money", "simple purchases"]),
  lower(1, "geometry", "Geometry", "Lines", 6, ["straight lines", "curved lines"]),
  lower(1, "geometry", "Geometry", "Shapes", 6, ["triangles", "rectangles", "circles", "ovals", "shape patterns"]),

  // Grade 2
  lower(2, "numbers", "Numbers", "Number Concept", 8, ["numbers in symbols", "number representation", "number games"]),
  lower(2, "numbers", "Numbers", "Whole Numbers", 20, ["counting", "place value", "number symbols", "number words", "number patterns"]),
  lower(2, "numbers", "Numbers", "Addition", 25, ["two-digit addition", "regrouping", "addition patterns"]),
  lower(2, "numbers", "Numbers", "Subtraction", 20, ["two-digit subtraction", "regrouping", "missing numbers", "subtraction patterns"]),
  lower(2, "measurement", "Measurements", "Length", 10, ["metres", "centimetres", "measuring and comparing"]),
  lower(2, "measurement", "Measurements", "Mass", 10, ["kilograms", "comparing mass", "measuring mass"]),
  lower(2, "measurement", "Measurements", "Capacity", 12, ["litres", "containers", "comparing capacity"]),
  lower(2, "measurement", "Measurements", "Time", 8, ["calendar", "days", "months", "reading time"]),
  lower(2, "measurement", "Measurements", "Money", 8, ["Kenyan currency", "counting denominations", "adding money", "shopping"]),
  lower(2, "geometry", "Geometry", "Lines", 6, ["straight lines", "curved lines", "modelling lines"]),
  lower(2, "geometry", "Geometry", "Shapes", 6, ["identifying shapes", "drawing shapes", "shape patterns"]),

  // Grade 3
  lower(3, "numbers", "Numbers", "Number Activities", 8, ["ordering", "position", "ordinal numbers"]),
  lower(3, "numbers", "Numbers", "Whole Numbers", 20, ["counting to 1000", "place value", "number words", "number patterns"]),
  lower(3, "numbers", "Numbers", "Addition", 25, ["three-digit addition", "regrouping", "addition patterns"]),
  lower(3, "numbers", "Numbers", "Subtraction", 20, ["three-digit subtraction", "regrouping", "missing numbers", "subtraction patterns"]),
  lower(3, "measurement", "Measurements", "Length", 10, ["metres", "centimetres", "measurement problems"]),
  lower(3, "measurement", "Measurements", "Mass", 10, ["kilograms", "mass comparison", "mass problems"]),
  lower(3, "measurement", "Measurements", "Capacity", 12, ["litres", "capacity comparison", "capacity problems"]),
  lower(3, "measurement", "Measurements", "Time", 8, ["calendar", "days and dates", "clock time"]),
  lower(3, "measurement", "Measurements", "Money", 8, ["Kenyan currency", "counting denominations", "adding money", "shopping"]),
  lower(3, "geometry", "Geometry", "Lines", 6, ["straight lines", "curved lines", "drawing lines"]),
  lower(3, "geometry", "Geometry", "Shapes", 6, ["triangles", "rectangles", "squares", "circles", "ovals", "shape patterns"]),

  // Grade 4
  upper(4, "numbers", "Numbers", "Whole Numbers", 10, ["place value", "total value", "numbers to 10,000", "number words", "ordering", "rounding", "factors", "multiples", "even and odd", "Roman numerals"]),
  upper(4, "numbers", "Numbers", "Addition", 8, ["addition", "regrouping", "estimation", "word problems"]),
  upper(4, "numbers", "Numbers", "Subtraction", 8, ["subtraction", "regrouping", "estimation", "word problems"]),
  upper(4, "numbers", "Numbers", "Multiplication", 8, ["multiplication facts", "multi-digit multiplication", "estimation", "patterns"]),
  upper(4, "numbers", "Numbers", "Division", 8, ["division facts", "long division", "remainders", "word problems"]),
  upper(4, "numbers", "Numbers", "Fractions", 6, ["fraction concepts", "equivalent fractions", "comparing fractions", "operations"]),
  upper(4, "numbers", "Numbers", "Decimals", 10, ["decimal notation", "place value", "comparing decimals", "decimal operations"]),
  upper(4, "numbers", "Numbers", "Use of Letters", 6, ["unknowns", "number sentences", "simple algebraic thinking"]),
  upper(4, "measurement", "Measurement", "Length", 10, ["units", "conversion", "measurement problems"]),
  upper(4, "measurement", "Measurement", "Area", 8, ["area of rectangles", "square units"]),
  upper(4, "measurement", "Measurement", "Volume", 8, ["volume", "cubic units"]),
  upper(4, "measurement", "Measurement", "Capacity", 8, ["litres", "millilitres", "conversion"]),
  upper(4, "measurement", "Measurement", "Mass", 8, ["kilograms", "grams", "conversion"]),
  upper(4, "measurement", "Measurement", "Time", 10, ["clock time", "duration", "calendar"]),
  upper(4, "measurement", "Measurement", "Money", 8, ["Kenyan currency", "transactions", "change", "word problems"]),
  upper(4, "geometry", "Geometry", "Position and Direction", 5, ["position", "direction", "turns"]),
  upper(4, "geometry", "Geometry", "Angles", 5, ["right angles", "acute angles", "obtuse angles", "angle comparison"]),
  upper(4, "geometry", "Geometry", "Plane Figures", 6, ["properties of plane figures", "classification", "patterns"]),
  upper(4, "data_handling", "Data Handling", "Data", 10, ["collecting data", "tallying", "tables", "interpreting data"]),

  // Grade 5
  upper(5, "numbers", "Numbers", "Whole Numbers", 20, ["place value", "total value", "ordering", "rounding", "divisibility", "HCF/GCD", "LCM"]),
  upper(5, "numbers", "Numbers", "Addition", 6, ["multi-digit addition", "estimation", "real-life problems"]),
  upper(5, "numbers", "Numbers", "Subtraction", 6, ["multi-digit subtraction", "estimation", "real-life problems"]),
  upper(5, "numbers", "Numbers", "Multiplication", 6, ["multi-digit multiplication", "estimation", "patterns"]),
  upper(5, "numbers", "Numbers", "Division", 6, ["multi-digit division", "quotients", "remainders", "real-life problems"]),
  upper(5, "numbers", "Numbers", "Fractions", 8, ["equivalent fractions", "ordering", "addition", "subtraction", "mixed numbers"]),
  upper(5, "numbers", "Numbers", "Decimals", 6, ["decimal place value", "rounding", "operations", "fractions and decimals"]),
  upper(5, "numbers", "Numbers", "Simple Equations", 6, ["unknowns", "number sentences", "solving simple equations"]),
  upper(5, "measurement", "Measurement", "Length", 12, ["units", "conversion", "perimeter", "measurement problems"]),
  upper(5, "measurement", "Measurement", "Area", 6, ["area", "square units", "area problems"]),
  upper(5, "measurement", "Measurement", "Volume", 6, ["volume", "cubic units", "volume problems"]),
  upper(5, "measurement", "Measurement", "Capacity", 12, ["litres", "millilitres", "conversion", "capacity problems"]),
  upper(5, "measurement", "Measurement", "Mass", 12, ["kilograms", "grams", "conversion", "mass problems"]),
  upper(5, "measurement", "Measurement", "Time", 8, ["time", "duration", "calendar", "time problems"]),
  upper(5, "measurement", "Measurement", "Money", 8, ["Kenyan currency", "transactions", "change", "financial problems"]),
  upper(5, "geometry", "Geometry", "Lines", 4, ["line types", "parallel and perpendicular relationships"]),
  upper(5, "geometry", "Geometry", "Angles", 6, ["angle types", "measuring angles", "angle relationships"]),
  upper(5, "geometry", "Geometry", "Three Dimension (3-D) Objects", 6, ["3-D objects", "faces", "edges", "vertices"]),
  upper(5, "data_handling", "Data Handling", "Data Representation", 6, ["data collection", "tables", "charts", "interpreting data"]),

  // Grade 6
  upper(6, "numbers", "Numbers", "Whole Numbers", 20, ["place value to millions", "number words", "ordering", "rounding", "squares", "square roots"]),
  upper(6, "numbers", "Numbers", "Multiplication", 6, ["4-digit by 2-digit multiplication", "estimation", "patterns", "applications"]),
  upper(6, "numbers", "Numbers", "Division", 6, ["division up to 4-digit by 3-digit", "estimation", "combined operations"]),
  upper(6, "numbers", "Numbers", "Fractions", 12, ["LCM", "addition", "subtraction", "mixed numbers", "reciprocals", "squares of fractions", "fractions and percentages"]),
  upper(6, "numbers", "Numbers", "Decimals", 12, ["ten-thousandths", "rounding", "decimal-fraction conversion", "decimal-percentage conversion", "operations"]),
  upper(6, "numbers", "Numbers", "Inequalities", 8, ["inequality statements", "simplifying inequalities", "solving simple inequalities", "real-life applications"]),
  upper(6, "measurement", "Measurement", "Length", 14, ["units", "conversion", "measurement problems"]),
  upper(6, "measurement", "Measurement", "Area", 6, ["area", "area problems"]),
  upper(6, "measurement", "Measurement", "Capacity", 6, ["capacity", "conversion", "capacity problems"]),
  upper(6, "measurement", "Measurement", "Mass", 14, ["mass", "conversion", "mass problems"]),
  upper(6, "measurement", "Measurement", "Time", 10, ["time", "duration", "calendar", "time problems"]),
  upper(6, "measurement", "Measurement", "Money", 8, ["Kenyan currency", "transactions", "change", "percentage applications"]),
  upper(6, "geometry", "Geometry", "Lines", 6, ["line types", "line relationships"]),
  upper(6, "geometry", "Geometry", "Angles", 6, ["angle types", "measuring angles", "angle relationships"]),
  upper(6, "geometry", "Geometry", "3-D Objects", 6, ["3-D objects", "faces", "edges", "vertices"]),
  upper(6, "data_handling", "Data Handling", "Bar Graphs", 10, ["reading bar graphs", "constructing bar graphs", "comparing data", "interpreting data"]),
];

export const CURRICULUM_BY_ID = Object.fromEntries(
  MATHEMATICS_CURRICULUM.map((node) => [node.id, node]),
) as Record<string, MathCurriculumNode>;

export function getMathCurriculumForGrade(grade: Grade): MathCurriculumNode[] {
  return MATHEMATICS_CURRICULUM.filter((node) => node.grade === grade);
}

export function getMathCurriculumNode(id: string): MathCurriculumNode | undefined {
  return CURRICULUM_BY_ID[id];
}
