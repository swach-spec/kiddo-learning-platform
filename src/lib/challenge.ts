import { vocabularyChallenges } from "@/content/demo/vocabulary-challenges";
import { mathsChallenges } from "@/content/demo/maths-challenges";
import { numberWorldChallenges } from "@/content/number-world";
import { NUMBER_WORLD_CBC_BANK } from "@/content/number-world-cbc";
import { grade2DescribingGuided, grade2DescribingIndependent, grade2SentenceBuilder } from "@/content/challenges/grade-2-english";
import { ActivityResult } from "@/types/activity";
import { Challenge } from "@/types/challenge";
import { PartOfSpeech, Question, Skill, Story } from "@/types/content";

const allChallenges: Challenge[] = [...vocabularyChallenges, ...mathsChallenges, ...numberWorldChallenges, ...NUMBER_WORLD_CBC_BANK, ...grade2DescribingGuided, ...grade2DescribingIndependent, ...grade2SentenceBuilder];
export type ChallengeSession = { challenges: Challenge[]; completionActivityId: string };
export function getChallengeById(id: string): Challenge | undefined { return allChallenges.find((challenge) => challenge.id === id); }
export function getChallengeSession(id: string): ChallengeSession {
  if (id.startsWith("g2-guided-")) return { challenges: grade2DescribingGuided, completionActivityId: "g2-describing-guided" };
  if (id.startsWith("g2-independent-")) return { challenges: grade2DescribingIndependent, completionActivityId: "g2-describing-independent" };
  if (id.startsWith("g2-sentence-")) return { challenges: grade2SentenceBuilder, completionActivityId: "g2-sentence-builder" };
  if (id.startsWith("g2-mastery-")) return { challenges: grade2DescribingIndependent, completionActivityId: "g2-describing-mastery" };
  const challenge = getChallengeById(id);
  return { challenges: challenge ? [challenge] : [], completionActivityId: id };
}

export type LearningSignal = { activityResultId: string; activityId: string; storyId: string; skill: Skill; correct: false; timestamp: string; word?: string; partOfSpeech?: PartOfSpeech };
export type TargetedChallenge = { challenge: Challenge; signal: LearningSignal };
type SourceQuestion = { story: Story; question: Question };
export function getLearningSignals(stories: Story[], activityResults: ActivityResult[]): LearningSignal[] {
  return activityResults.flatMap((result) => {
    if (result.activityType !== "story_question" || result.correct !== false) return [];
    const source = getSourceQuestion(stories, result);
    if (!source) return [];
    return source.question.skills.map((skill): LearningSignal => ({ activityResultId: result.id, activityId: result.activityId, storyId: source.story.id, skill, correct: false, timestamp: result.timestamp, ...(skill === "vocabulary" && source.question.word && source.question.partOfSpeech ? { word: source.question.word, partOfSpeech: source.question.partOfSpeech } : {}) }));
  });
}
export function getTargetedChallenge(stories: Story[], activityResults: ActivityResult[]): TargetedChallenge | null {
  const signals = getLearningSignals(stories, activityResults);
  for (let index = signals.length - 1; index >= 0; index -= 1) {
    const signal = signals[index];
    if (!signal.partOfSpeech) continue;
    const challenge = vocabularyChallenges.find((candidate) => candidate.skill === signal.skill && candidate.partOfSpeech === signal.partOfSpeech);
    if (challenge) return { challenge, signal };
  }
  const readyStory = stories.find((story) => story.status === "ready");
  const fallbackQuestion = readyStory?.questions.find((question) => question.word && question.partOfSpeech && question.skills.includes("vocabulary"));
  if (!readyStory || !fallbackQuestion?.word || !fallbackQuestion.partOfSpeech) return null;
  const challenge = vocabularyChallenges.find((candidate) => candidate.skill === "vocabulary" && candidate.partOfSpeech === fallbackQuestion.partOfSpeech);
  if (!challenge) return null;
  return { challenge, signal: { activityResultId: "story-start", activityId: fallbackQuestion.id, storyId: readyStory.id, skill: "vocabulary", correct: false, timestamp: new Date().toISOString(), word: fallbackQuestion.word, partOfSpeech: fallbackQuestion.partOfSpeech } };
}
export function getChallengeForQuestion(question: Question): Challenge | null {
  if (!question.word || !question.partOfSpeech || !question.skills.includes("vocabulary")) return null;
  return vocabularyChallenges.find((challenge) => challenge.skill === "vocabulary" && challenge.partOfSpeech === question.partOfSpeech) ?? null;
}
function getSourceQuestion(stories: Story[], result: ActivityResult): SourceQuestion | null {
  if (!result.storyId) return null;
  const story = stories.find((candidate) => candidate.id === result.storyId);
  const question = story?.questions.find((candidate) => candidate.id === result.activityId);
  return story && question ? { story, question } : null;
}
