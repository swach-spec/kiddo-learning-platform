import { CurriculumNode } from "@/types/curriculum-path";
import { grade2EnglishPath } from "@/content/curriculum/english-grade-2-path";

const gradeConcepts = {
  1: ["simple sentence patterns", "naming and action words", "describing words", "reading simple sentences", "guided comprehension"],
  2: ["describing words", "naming and action words", "present and past actions", "sentence sequencing", "reading for meaning"],
  3: ["describing words", "subject-verb agreement", "sentence patterns", "reading fluency", "comprehension and vocabulary"],
  4: ["adjectives", "verb tense", "sentence structure", "conjunctions", "reading and comprehension"],
  5: ["adjectives", "conjunctions", "complex sentences", "contextual vocabulary", "reading and inference"],
  6: ["adjectives in context", "complex sentence construction", "contextual grammar", "figurative and fixed expressions", "critical reading"],
} as const;

function makePath(grade: 1 | 3 | 4 | 5 | 6): CurriculumNode[] {
  const concepts = gradeConcepts[grade];
  const base = `english-g${grade}`;
  return [
    { id: `${base}-describing-words`, grade, subject: "english", strand: grade >= 4 ? "Grammar" : "Grammar in Use", subStrand: "Language Patterns and Sentence Construction", concept: concepts[0], title: grade <= 3 ? "Describing Words" : "Adjectives in Use", description: "Learn the next idea on your grade pathway.", kind: "lesson", route: "/learn/adjectives", activityId: `${base}-describing-words`, curriculumId: `${base}-describing-words`, xp: 20, required: true },
    { id: `${base}-guided-practice`, grade, subject: "english", strand: grade >= 4 ? "Grammar" : "Grammar in Use", subStrand: "Language Patterns and Sentence Construction", concept: concepts[0], title: "Guided Practice", description: "Practise the idea with support.", kind: "guided_practice", route: "/challenge/demo-adjective-describing-word", activityId: "demo-adjective-describing-word", curriculumId: `${base}-guided-practice`, xp: 30, required: true },
    { id: `${base}-independent-practice`, grade, subject: "english", strand: grade >= 4 ? "Grammar" : "Grammar in Use", subStrand: "Language Patterns and Sentence Construction", concept: concepts[0], title: "Independent Practice", description: "Show what you can do independently.", kind: "independent_practice", route: "/challenge/demo-adjective-describing-word", activityId: "demo-adjective-describing-word", curriculumId: `${base}-independent-practice`, xp: 40, required: true },
    { id: `${base}-mastery`, grade, subject: "english", strand: grade >= 4 ? "Grammar" : "Grammar in Use", subStrand: "Language Patterns and Sentence Construction", concept: concepts[0], title: "Mastery Mission", description: "Bring the skill together in a final challenge.", kind: "mastery", route: "/challenge/demo-adjective-describing-word", activityId: "demo-adjective-describing-word", curriculumId: `${base}-mastery`, xp: 60, required: true },
    { id: `${base}-reading`, grade, subject: "english", strand: "Reading", subStrand: "Comprehension", concept: concepts[4], title: "Reading Adventure", description: "Use the skill in a grade-appropriate story.", kind: "story", route: "/story", activityId: `benchmark-grade-${grade}-reading`, curriculumId: `${base}-reading`, xp: 50, required: true },
  ];
}

export const englishCurriculumPaths: Record<1 | 2 | 3 | 4 | 5 | 6, CurriculumNode[]> = { 1: makePath(1), 2: grade2EnglishPath, 3: makePath(3), 4: makePath(4), 5: makePath(5), 6: makePath(6) };
export function getEnglishPath(grade: number): CurriculumNode[] { return englishCurriculumPaths[(grade >= 1 && grade <= 6 ? grade : 2) as 1 | 2 | 3 | 4 | 5 | 6]; }
