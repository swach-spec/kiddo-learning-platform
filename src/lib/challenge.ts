import { vocabularyChallenges } from "@/content/demo/vocabulary-challenges";
import { mathsChallenges } from "@/content/demo/maths-challenges";
import { numberWorldChallenges } from "@/content/number-world";
import { ActivityResult } from "@/types/activity";
import { Challenge } from "@/types/challenge";
import { PartOfSpeech, Question, Skill, Story } from "@/types/content";

// Single place every consumer looks a challenge up from, regardless of
// subject or learning world.
const allChallenges: Challenge[] = [
  ...vocabularyChallenges,
  ...mathsChallenges,
  ...numberWorldChallenges,
];

export type LearningSignal = {
  activityResultId: string;
  activityId: string;
  storyId: string;
  skill: Skill;
  correct: false;
  timestamp: string;
  word?: string;
  partOfSpeech?: PartOfSpeech;
};

export type TargetedChallenge = {
  challenge: Challenge;
  signal: LearningSignal;
};

type SourceQuestion = {
  story: Story;
  question: Question;
};

/** Looks up any challenge by id, regardless of subject. */
export function getChallengeById(id: string): Challenge | undefined {
  return allChallenges.find((challenge) => challenge.id === id);
}

export function getLearningSignals(
  stories: Story[],
  activityResults: ActivityResult[]
): LearningSignal[] {
  return activityResults.flatMap((result) => {
    if (result.activityType !== "story_question" || result.correct !== false) {
      return [];
    }

    const source = getSourceQuestion(stories, result);
    if (!source) return [];

    return source.question.skills.map((skill): LearningSignal => {
      const signal: LearningSignal = {
        activityResultId: result.id,
        activityId: result.activityId,
        storyId: source.story.id,
        skill,
        correct: false,
        timestamp: result.timestamp,
      };

      if (skill === "vocabulary" && source.question.word && source.question.partOfSpeech) {
        return { ...signal, word: source.question.word, partOfSpeech: source.question.partOfSpeech };
      }

      return signal;
    });
  });
}

/** Selects the latest compatible vocabulary challenge from an observed story weakness. */
export function getTargetedChallenge(
  stories: Story[],
  activityResults: ActivityResult[]
): TargetedChallenge | null {
  const signals = getLearningSignals(stories, activityResults);

  for (let index = signals.length - 1; index >= 0; index -= 1) {
    const signal = signals[index];
    if (!signal.partOfSpeech) continue;

    const challenge = vocabularyChallenges.find(
      (candidate) => candidate.skill === signal.skill && candidate.partOfSpeech === signal.partOfSpeech
    );

    if (challenge) return { challenge, signal };
  }

  return null;
}

export function getChallengeForQuestion(question: Question): Challenge | null {
  if (!question.word || !question.partOfSpeech || !question.skills.includes("vocabulary")) {
    return null;
  }

  return vocabularyChallenges.find(
    (challenge) => challenge.skill === "vocabulary" && challenge.partOfSpeech === question.partOfSpeech
  ) ?? null;
}

function getSourceQuestion(stories: Story[], result: ActivityResult): SourceQuestion | null {
  if (!result.storyId) return null;

  const story = stories.find((candidate) => candidate.id === result.storyId);
  const question = story?.questions.find((candidate) => candidate.id === result.activityId);

  return story && question ? { story, question } : null;
}
