import { Grade } from "@/types/content";

export type CurriculumNodeKind = "lesson" | "guided_practice" | "independent_practice" | "mastery" | "story" | "play";
export type CurriculumNode = { id: string; grade: Grade; subject: "english" | "mathematics"; strand: string; subStrand: string; concept: string; title: string; description: string; kind: CurriculumNodeKind; route?: string; activityId?: string; curriculumId: string; xp: number; required: boolean };
export type LearningRoute = "main" | "remediation" | "acceleration" | "mastery";
export type NextLearningDecision = { node: CurriculumNode; route: LearningRoute; action: "learn" | "practise" | "support" | "challenge"; reason: string };
