import { Player } from "@/lib/kiddo";
import { Story, Skill } from "@/types/content";
import { ActivityResult } from "@/types/activity";
import { AdventureStep, TodayAdventure } from "@/types/adventure";

/**
 * Decides what a learner should do today, purely from existing
 * persisted state (player, content catalogue, activity log). No AI, no
 * randomness, no network, no writes — this is a pure function: same
 * inputs always produce the same output, so calling it repeatedly
 * (every Home render, every refresh) is always safe and never itself
 * changes any state.
 *
 * IMPORTANT CAVEAT (documented rather than silently assumed away):
 * "Today's" is aspirational. Nothing in Player or ActivityResult
 * currently records a calendar day, so this reflects the learner's
 * *current* state, not a state that resets at midnight or tracks a
 * daily streak of adventures. Actual day-based reset would need a new
 * persisted field (e.g. a "last adventure date"), which is a schema
 * change outside Phase 2's scope — flagged here rather than faked.
 */
export function getTodaysAdventure(
  player: Player,
  stories: Story[],
  activityResults: ActivityResult[]
): TodayAdventure {
  // Pick the first verified, playable story rather than hardcoding
  // "lost-kite" — if a second story is ever promoted to status:
  // "ready" in the content layer, the engine picks it up automatically
  // with no change needed here. Today there is only ever one.
  const readyStories = stories.filter((story) => story.status === "ready");
  const primaryStory = readyStories[0];

  const readingCompleted = primaryStory
    ? player.completedStoryIds.includes(primaryStory.id)
    : false;

  const readingStep: AdventureStep = primaryStory
    ? {
        id: "reading",
        type: "reading",
        title: primaryStory.title,
        description: readingCompleted
          ? "You finished this adventure. Great reading!"
          : "Read the story and answer questions about it.",
        status: readingCompleted ? "completed" : "available",
        storyId: primaryStory.id,
        skills: dedupeSkills(primaryStory.questions.flatMap((q) => q.skills)),
      }
    : {
        // No ready story exists at all. Rather than point the learner
        // at nothing, this is represented honestly.
        id: "reading",
        type: "reading",
        title: "Reading",
        description: "No story is ready to read yet.",
        status: "coming_soon",
      };

  // Practice and Challenge: the repository has no practice bank,
  // challenge bank, or any mechanism distinct from the story reader's
  // built-in comprehension quiz. Per the Phase 2 content-honesty
  // constraint, these are represented as coming_soon rather than
  // invented — never rendered as playable, never given fabricated
  // content.
  const practiceStep: AdventureStep = {
    id: "practice",
    type: "practice",
    title: "Practice",
    description: "More practice activities are coming soon.",
    status: "coming_soon",
  };

  const challengeStep: AdventureStep = {
    id: "challenge",
    type: "challenge",
    title: "Challenge",
    description: "A bigger challenge is coming soon.",
    status: "coming_soon",
  };

  // Reward is a pure readout of XP already persisted through
  // completing the reading step — summed from the existing activity
  // log, never a new award. This function never calls awardXP (or
  // touches localStorage at all), so recomputing it on every render,
  // every refresh, or every Home visit can never grant XP twice.
  const xpFromReading = primaryStory
    ? activityResults
        .filter(
          (result) =>
            result.storyId === primaryStory.id &&
            result.activityType === "story_question"
        )
        .reduce((sum, result) => sum + result.xpAwarded, 0)
    : 0;

  const rewardStep: AdventureStep = {
    id: "reward",
    type: "reward",
    title: "Reward",
    description: readingCompleted
      ? `You earned ${xpFromReading} XP today.`
      : "Complete today's reading to unlock your reward.",
    status: readingCompleted ? "completed" : "coming_soon",
    xp: readingCompleted ? xpFromReading : undefined,
  };

  return {
    playerId: player.id,
    steps: [readingStep, practiceStep, challengeStep, rewardStep],
    skillsExercised: dedupeSkills(activityResults.flatMap((r) => r.skills)),
  };
}

function dedupeSkills(skills: Skill[]): Skill[] {
  return Array.from(new Set(skills));
}
