import { CurriculumNode, CurriculumNodeKind } from "@/types/curriculum-path";
import { LearningUnit, UnitStage } from "@/types/learning-unit";

/** Path-step id for a unit stage, e.g. "g3-math-place-value--guided". */
export function unitNodeId(unitId: string, step: "learn" | "reading" | UnitStage): string {
  return `${unitId}--${step}`;
}

/** Challenge-session id for a unit's question bank, e.g. "g3-math-place-value--guided". */
export function unitSessionId(unitId: string, stage: UnitStage): string {
  return `${unitId}--${stage}`;
}

/** Splits a session id back into unit and stage, or null if it is not a unit session. */
export function parseUnitSessionId(sessionId: string): { unitId: string; stage: UnitStage } | null {
  const match = /^(.+)--(guided|independent|apply|mastery|support)$/.exec(sessionId);
  return match ? { unitId: match[1], stage: match[2] as UnitStage } : null;
}

/**
 * Expands one learning unit into its ordered learning-path steps:
 * Discover → Try together → Try on your own → (Reading adventure) → Use it → Mastery mission.
 */
export function buildUnitNodes(unit: LearningUnit): CurriculumNode[] {
  const base = {
    grade: unit.grade,
    subject: unit.subject,
    strand: unit.strand,
    subStrand: unit.subStrand,
    concept: unit.concept,
    curriculumId: unit.id,
    required: true,
  };
  const support = `/challenge/${unitSessionId(unit.id, "support")}`;
  const step = (id: string, kind: CurriculumNodeKind, title: string, description: string, route: string, xp: number, withSupport = true): CurriculumNode => ({
    ...base,
    id,
    kind,
    title: `${unit.title} · ${title}`,
    description,
    route,
    activityId: id,
    xp,
    ...(withSupport ? { supportRoute: support } : {}),
  });

  const nodes: CurriculumNode[] = [
    { ...step(unitNodeId(unit.id, "learn"), "lesson", "Discover", unit.description, `/learn/${unit.id}`, unit.lesson.xp, false), activityId: unit.lesson.id },
    step(unitNodeId(unit.id, "guided"), "guided_practice", "Try together", "Practise with help and hints.", `/challenge/${unitSessionId(unit.id, "guided")}`, 30),
    step(unitNodeId(unit.id, "independent"), "independent_practice", "Try on your own", "Show what you can do without help.", `/challenge/${unitSessionId(unit.id, "independent")}`, 40),
  ];
  if (unit.storyId) {
    nodes.push(step(unitNodeId(unit.id, "reading"), "story", "Reading adventure", "Read a story and answer questions about it.", `/story/${unit.storyId}`, 50));
  }
  nodes.push(
    step(unitNodeId(unit.id, "apply"), "independent_practice", "Use it", "Use the skill to solve real problems.", `/challenge/${unitSessionId(unit.id, "apply")}`, 40),
    step(unitNodeId(unit.id, "mastery"), "mastery", "Mastery mission", "Bring it all together to finish the unit.", `/challenge/${unitSessionId(unit.id, "mastery")}`, 60),
  );
  return nodes;
}
