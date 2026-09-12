import { CurriculumNode } from "@/types/curriculum-path";

const grades = {
  1: { strand: "Listening and Speaking", subStrand: "Language Patterns", concepts: ["simple sentence patterns", "naming and action words", "describing words", "reading simple sentences", "guided comprehension"] },
  2: { strand: "Reading", subStrand: "Language Patterns and Comprehension", concepts: ["describing words", "describing words", "reading for meaning", "sentence sequencing", "guided composition"] },
  3: { strand: "Grammar in Use", subStrand: "Sentence Construction", concepts: ["describing words", "subject-verb agreement", "sentence patterns", "reading fluency", "comprehension and vocabulary"] },
  4: { strand: "Grammar", subStrand: "Word Classes and Sentence Structure", concepts: ["adjectives", "verb tense", "sentence structure", "conjunctions", "reading and comprehension"] },
  5: { strand: "Grammar", subStrand: "Sentence Construction", concepts: ["adjectives", "conjunctions", "complex sentences", "contextual vocabulary", "reading and inference"] },
  6: { strand: "Grammar", subStrand: "Advanced Sentence Construction", concepts: ["adjectives in context", "complex sentence construction", "contextual grammar", "figurative and fixed expressions", "critical reading"] },
} as const;

type Grade = keyof typeof grades;

function makePath(grade: Grade): CurriculumNode[] {
  const g = grades[grade];
  const ids = [`english-g${grade}-describing-words`, `english-g${grade}-guided-practice`, `english-g${grade}-reading`, `english-g${grade}-independent-practice`, `english-g${grade}-mastery`];

  if (grade === 2) {
    return [
      { id: ids[0], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[0], title: "Describing Words", description: "Learn how describing words add useful detail to sentences.", kind: "lesson", route: "/learn/adjectives", activityId: ids[0], curriculumId: ids[0], xp: 20, required: true },
      { id: ids[1], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[1], title: "Guided Practice", description: "Practise describing words with examples and support.", kind: "guided_practice", route: "/learn/grade-2/describing-words?mode=guided", activityId: ids[1], curriculumId: ids[1], xp: 30, required: true },
      { id: ids[2], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[2], title: "Reading Adventure", description: "Use the language skill inside a full Grade 2 story.", kind: "story", route: "/story/benchmark-grade-2-the-garden-clock", activityId: "benchmark-grade-2-the-garden-clock", curriculumId: ids[2], xp: 50, required: true },
      { id: ids[3], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[3], title: "Independent Practice", description: "Show what you know without the lesson steps.", kind: "independent_practice", route: "/learn/grade-2/describing-words?mode=independent", activityId: ids[3], curriculumId: ids[3], xp: 40, required: true },
      { id: ids[4], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[4], title: "Mastery Mission", description: "Use describing words in sentences of your own.", kind: "mastery", route: "/learn/grade-2/describing-words?mode=mastery", activityId: ids[4], curriculumId: ids[4], xp: 60, required: true },
    ];
  }

  return [
    { id: ids[0], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[0], title: grade <= 3 ? "Describing Words" : "Adjectives in Use", description: "Learn the idea first with examples and a guided activity.", kind: "lesson", route: "/learn/adjectives", activityId: ids[0], curriculumId: ids[0], xp: 20, required: true },
    { id: ids[1], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[1], title: "Guided Practice", description: "Practise the new idea with support.", kind: "guided_practice", route: "/challenge/demo-adjective-describing-word", activityId: "demo-adjective-describing-word", curriculumId: ids[1], xp: 30, required: true },
    { id: ids[2], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[2], title: "Reading Adventure", description: "Use the skill in a meaningful reading task.", kind: "story", route: "/story", activityId: ids[2], curriculumId: ids[2], xp: 50, required: true },
    { id: ids[3], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[3], title: "Independent Practice", description: "Show what you can do without the lesson steps.", kind: "independent_practice", route: "/", activityId: ids[3], curriculumId: ids[3], xp: 40, required: true },
    { id: ids[4], grade, subject: "english", strand: g.strand, subStrand: g.subStrand, concept: g.concepts[4], title: "Mastery Mission", description: "Prove that you can use the skill confidently.", kind: "mastery", route: "/", activityId: ids[4], curriculumId: ids[4], xp: 60, required: true },
  ];
}

export const englishCurriculumPaths: Record<Grade, CurriculumNode[]> = { 1: makePath(1), 2: makePath(2), 3: makePath(3), 4: makePath(4), 5: makePath(5), 6: makePath(6) };

export function getEnglishPath(grade: number): CurriculumNode[] {
  return englishCurriculumPaths[(grade >= 1 && grade <= 6 ? grade : 2) as Grade];
}
