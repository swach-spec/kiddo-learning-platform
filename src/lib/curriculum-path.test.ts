import { describe, expect, it } from "vitest";
import { grade2EnglishPath } from "@/content/curriculum/english-grade-2-path";
import { isNodeComplete } from "@/lib/curriculum-path";
import { meetsMasteryThreshold } from "@/lib/mastery";
import { ActivityResult } from "@/types/activity";
const node = grade2EnglishPath[1];
function stageSession(stage: typeof node, score:number,total=8): ActivityResult { return { ...session(score,total), id:`${stage.id}-${score}`, activityId:stage.activityId ?? stage.id, curriculumNodeId:stage.id, correct:score/total >= .6 }; }
function session(score:number,total=8): ActivityResult { return { id:`s-${score}`, playerId:"p", activityType:"practice_challenge", activityId:"g2-describing-guided", curriculumNodeId:node.id, skills:["grammar"], correct:score/total>=.6, attempts:total,hintsUsed:0,xpAwarded:0,timestamp:`2026-01-01T00:00:0${score}.000Z`,isSessionSummary:true,score,totalQuestions:total}; }
describe("Grade 2 stage thresholds",()=>{
 it("uses the 60/80/90 stage thresholds without a global 70% rule",()=>{ const independent=grade2EnglishPath[2]; const mastery=grade2EnglishPath[5]; expect(isNodeComplete([session(4)],node)).toBe(false); expect(isNodeComplete([session(5)],node)).toBe(true); expect(meetsMasteryThreshold([session(5)],node.id,node.kind)).toBe(true); expect(isNodeComplete([stageSession(independent,6)],independent)).toBe(false); expect(isNodeComplete([stageSession(independent,7)],independent)).toBe(true); expect(isNodeComplete([stageSession(mastery,7)],mastery)).toBe(false); expect(isNodeComplete([stageSession(mastery,8)],mastery)).toBe(true); });
 it("keeps score bounded by stored total",()=>{ const evidence=session(8); expect(evidence.score).toBeLessThanOrEqual(evidence.totalQuestions!); });
 it("does not turn question attempts into completed sessions",()=>{ const question={...session(8),id:"q",isSessionSummary:false}; expect(isNodeComplete([question],node)).toBe(false); });
});