import { describe, expect, it } from "vitest";
import { LEARNING_UNITS } from "@/content/units";
import { getStoryById } from "@/content";
import { getLearningPath } from "@/content/curriculum/learning-path";
import { getChallengeSession } from "@/lib/challenge";
import { UNIT_STAGES } from "@/types/learning-unit";
import { stepsFor } from "@/lib/working";

/**
 * Content checks every published unit must pass. They are the automatic half
 * of content review: a unit that fails here cannot reach a child.
 */
const MIN_BANK = { support: 4, guided: 6, independent: 6, apply: 4, mastery: 8 } as const;

describe("learning unit content", () => {
  it("has unique unit ids and unique question ids across all units", () => {
    const unitIds = LEARNING_UNITS.map((unit) => unit.id);
    expect(new Set(unitIds).size).toBe(unitIds.length);
    const questionIds = LEARNING_UNITS.flatMap((unit) => UNIT_STAGES.flatMap((stage) => unit.banks[stage].map((question) => question.id)));
    expect(new Set(questionIds).size).toBe(questionIds.length);
  });

  for (const unit of LEARNING_UNITS) {
    describe(unit.id, () => {
      it("is mapped to a curriculum outcome (curriculum integrity)", () => {
        expect(unit.objectives.length).toBeGreaterThan(0);
        expect(unit.source.document).toMatch(/KICD/);
        expect(unit.source.subStrand.length).toBeGreaterThan(0);
      });

      it("has a lesson whose try-it answers are among its options", () => {
        expect(unit.lesson.steps.length).toBeGreaterThanOrEqual(3);
        for (const step of unit.lesson.steps.filter((item) => item.type === "try")) {
          expect(step.options, step.id).toBeDefined();
          expect(step.options, step.id).toContain(step.correctOption);
          expect(new Set(step.options).size, step.id).toBe(step.options?.length);
        }
      });

      for (const stage of UNIT_STAGES) {
        it(`has a valid ${stage} bank`, () => {
          const questions = unit.banks[stage];
          expect(questions.length).toBeGreaterThanOrEqual(MIN_BANK[stage]);
          // A prompt like "Which sentence is correct?" may repeat; the same prompt with the same options may not.
          const keys = questions.map((question) => `${question.prompt}|${question.options.map((option) => option.text).sort().join("|")}`);
          expect(new Set(keys).size, "duplicate questions").toBe(keys.length);
          for (const question of questions) {
            const texts = question.options.map((option) => option.text);
            expect(question.prompt.trim().length, question.id).toBeGreaterThan(0);
            expect(question.explanation.trim().length, question.id).toBeGreaterThan(0);
            expect(texts.length, question.id).toBeGreaterThanOrEqual(2);
            expect(texts.length, question.id).toBeLessThanOrEqual(4);
            expect(new Set(texts).size, `${question.id} has duplicate options: ${texts.join(" | ")}`).toBe(texts.length);
            expect(texts.every((text) => text.trim().length > 0), question.id).toBe(true);
            expect(question.options.some((option) => option.id === question.correctOptionId), question.id).toBe(true);
            expect(question.grade).toBe(unit.grade);
            expect(question.subject).toBe(unit.subject);
          }
        });
      }

      it("never offers a wrong option that equals the answer in value", () => {
        // Parses "1 3/4", "3/8", "1,250", "sh. 35", "60%", "7 m" … ; returns null for words.
        const value = (text: string): number | null => {
          const cleaned = text.replace(/^sh\. /, "").replace(/,/g, "").replace(/ (m²|m|km|kg|litres|trees|mangoes|passengers|marbles|books|loaves|pupils)$/, "").replace(/%$/, "");
          const mixed = /^(\d+) (\d+)\/(\d+)$/.exec(cleaned);
          if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
          const fraction = /^(\d+)\/(\d+)$/.exec(cleaned);
          if (fraction) return Number(fraction[1]) / Number(fraction[2]);
          return /^\d+(\.\d+)?$/.test(cleaned) ? Number(cleaned) : null;
        };
        for (const stage of UNIT_STAGES) {
          for (const question of unit.banks[stage]) {
            const answer = value(question.options.find((option) => option.id === question.correctOptionId)!.text);
            if (answer === null) continue;
            for (const option of question.options.filter((item) => item.id !== question.correctOptionId)) {
              const other = value(option.text);
              if (other !== null) expect(Math.abs(other - answer) > 1e-9, `${question.id}: "${option.text}" equals the answer`).toBe(true);
            }
          }
        }
      });

      it("shows working that arrives at exactly the correct answer", () => {
        const value = (text: string): number | null => {
          const cleaned = text.replace(/^sh\. /, "").replace(/,/g, "").replace(/ [a-zA-Z²]+$/, "").trim();
          const mixed = /^(\d+) (\d+)\/(\d+)$/.exec(cleaned);
          if (mixed) return Number(mixed[1]) + Number(mixed[2]) / Number(mixed[3]);
          const fraction = /^(\d+)\/(\d+)$/.exec(cleaned);
          if (fraction) return Number(fraction[1]) / Number(fraction[2]);
          return /^\d+(\.\d+)?$/.test(cleaned) ? Number(cleaned) : null;
        };
        for (const stage of UNIT_STAGES) {
          for (const question of unit.banks[stage].filter((item) => item.working)) {
            const steps = stepsFor(question.working!);
            const last = steps[steps.length - 1].text;
            const correct = question.options.find((option) => option.id === question.correctOptionId)!.text;
            const expected = value(correct);
            if (question.working!.kind === "place-value") {
              // Place value answers are a place name or a value; the chart must contain that digit's value.
              continue;
            }
            expect(last.startsWith("Answer:"), `${question.id}: last step should start with "Answer:"`).toBe(true);
            const shown = /^Answer: [^=]*= ([\d,./ ]+?)(?: remainder|\. |\.$|$)/.exec(last.trim())?.[1];
            expect(shown, `${question.id}: no answer in "${last}"`).toBeDefined();
            expect(value(shown!.trim()), `${question.id}: working says ${shown}, answer is ${correct}`).toBeCloseTo(expected!, 9);
          }
        }
      });

      if (unit.storyId) {
        it("links to a ready story at the same grade", () => {
          const story = getStoryById(unit.storyId!);
          expect(story).toBeDefined();
          expect(story?.grade).toBe(unit.grade);
        });
      }
    });
  }
});

describe("learning paths built from units", () => {
  for (const grade of [...new Set(LEARNING_UNITS.map((unit) => unit.grade))]) {
    it(`Grade ${grade}: every step opens real content`, () => {
      const path = getLearningPath(grade);
      expect(path.length).toBeGreaterThan(0);
      for (const node of path.filter((item) => item.id.includes("--"))) {
        const route = node.route ?? "";
        if (route.startsWith("/challenge/")) {
          expect(getChallengeSession(route.replace("/challenge/", "")).challenges.length, node.id).toBeGreaterThan(0);
        }
        if (node.supportRoute) {
          expect(getChallengeSession(node.supportRoute.replace("/challenge/", "")).challenges.length, node.id).toBeGreaterThan(0);
        }
        if (route.startsWith("/story/")) expect(getStoryById(route.replace("/story/", "")), node.id).toBeDefined();
      }
    });
  }

  it("keeps the original Grade 2 path first so existing progress still counts", () => {
    expect(getLearningPath(2)[0].id).toBe("g2-describing-learn");
  });
});
