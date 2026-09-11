import { CurriculumNode } from "@/types/curriculum-path";

const grades = {
  1: {
    strand: "Listening and Speaking",
    subStrand: "Language Patterns",
    concepts: ["simple sentence patterns", "naming and action words", "describing words", "reading simple sentences", "guided comprehension"],
  },
  2: {
    strand: "Reading",
    subStrand: "Language Patterns and Comprehension",
    concepts: ["describing words", "naming and action words", "present and past actions", "sentence sequencing", "reading for meaning"],
  },
  3: {
    strand: "Grammar in Use",
    subStrand: "Sentence Construction",
    concepts: ["describing words", "subject-verb agreement", "sentence patterns", "reading fluency", "comprehension and vocabulary"],
  },
  4: {
    strand: "Grammar",
    subStrand: "Word Classes and Sentence Structure",
    concepts: ["adjectives", "verb tense", "sentence structure", "conjunctions", "reading and comprehension"],
  },
  5: {
    strand: "Grammar",
    subStrand: "Sentence Construction",
    concepts: ["adjectives", "conjunctions", "complex sentences", "contextual vocabulary", "reading and inference"],
  },
  6: {
    strand: "Grammar",
    subStrand: "Advanced Sentence Construction",
    concepts: ["adjectives in context", "complex sentence construction", "contextual grammar", "figurative and fixed expressions", "critical reading"],
  },
} as const;

type Grade = keyof typeof grades;

function makePath(grade: Grade): CurriculumNode[] {
  const g = grades[grade];
  const ids = [
    `english-g${grade}-describing-words`,
    `english-g${grade}-guided-practice`,
    `english-g${grade}-independent-practice`,
    `english-g${grade}-mastery`,
    `english-g${grade}-reading`,
  ];

  return [
    {
      id: ids[0], grade, subject: "english", strand: g.strand, subStrand: g.subStrand,
      concept: g.concepts[0], title: grade <= 3 ? "Describing Words" : "Adjectives in Use",
      description: "Learn the idea first with examples and a guided activity.", kind: "lesson",
      route: "/learn/adjectives", activityId: `english-g${grade}-describing-words`, curriculumId: ids[0], xp: 20, required: true,
    },
    {
      id: ids[1], grade, subject: "english", strand: g.strand, subStrand: g.subStrand,
      concept: g.concepts[1], title: "Guided Practice", description: "Practise the new idea with support.", kind: "guided_practice",
      route: "/challenge/demo-adjective-describing-word", activityId: "demo-adjective-describing-word", curriculumId: ids[1], xp: 30, required: true,
    },
    {
      id: ids[2], grade, subject: "english", strand: g.strand, subStrand: g.subStrand,
      concept: g.concepts[2], title: "Independent Practice", description: "Show what you can do without the lesson steps.", kind: "independent_practice",
      curriculumId: ids[2], xp: 40, required: true,
    },
    {
      id: ids[3], grade, subject: "english", strand: g.strand, subStrand: g.subStrand,
      concept: g.concepts[3], title: "Mastery Mission", description: "Prove that you can use the skill confidently.", kind: "mastery",
      curriculumId: ids[3], xp: 60, required: true,
    },
    {
      id: ids[4], grade, subject: "english", strand: g.strand, subStrand: g.subStrand,
      concept: g.concepts[4], title: "Reading Adventure", description: "Use the skill in a meaningful reading task.", kind: "story",
      curriculumId: ids[4], xp: 50, required: true,
    },
  ];
}

export const englishCurriculumPaths: Record<Grade, CurriculumNode[]> = {
  1: makePath(1),
  2: makePath(2),
  3: makePath(3),
  4: makePath(4),
  5: makePath(5),
  6: makePath(6),
};

export function getEnglishPath(grade: number): CurriculumNode[] {
  return englishCurriculumPaths[(grade >= 1 && grade <= 6 ? grade : 2) as Grade];
}
