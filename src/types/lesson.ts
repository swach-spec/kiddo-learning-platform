import { Grade } from "@/types/content";

export type LessonStepType = "teach" | "example" | "try" | "master";

export type LessonStep = {
  id: string;
  type: LessonStepType;
  title: string;
  body: string;
  example?: string;
  options?: string[];
  correctOption?: string;
  explanation?: string;
};

export type Lesson = {
  id: string;
  subject: "english" | "mathematics";
  grade: Grade;
  title: string;
  subtitle: string;
  skill: "grammar" | "vocabulary" | "reading_comprehension" | "spelling";
  icon: string;
  estimatedMinutes: number;
  xp: number;
  steps: LessonStep[];
  challengeId?: string;
};
