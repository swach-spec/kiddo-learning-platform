import { Grade, Skill } from "@/types/content";
import { Working } from "@/types/working";

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
  /** A step-by-step worked example drawn under this step (maths). */
  working?: Working;
};

export type Lesson = {
  id: string;
  subject: "english" | "mathematics";
  grade: Grade;
  title: string;
  subtitle: string;
  skill: Skill;
  icon: string;
  estimatedMinutes: number;
  xp: number;
  steps: LessonStep[];
  challengeId?: string;
};
