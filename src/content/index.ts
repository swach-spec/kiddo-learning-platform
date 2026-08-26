import { Story } from "@/types/content";
import { lowerPrimaryEnglishStories } from "./english/lower-primary/stories";

// Single place every page imports content from. As more subjects/grade
// bands are added later, they get concatenated here — pages never need
// to know which folder a story physically lives in.
const allStories: Story[] = [...lowerPrimaryEnglishStories];

export function getAllStories(): Story[] {
  return allStories;
}

export function getStoryById(id: string): Story | undefined {
  // Canonical string id first, then legacy numeric id (as it appeared
  // in the original prototype's /story/${id} links: 1-4). Exact match
  // only — never a fallback/default — so an unknown id can never
  // resolve to the wrong story.
  return allStories.find(
    (story) => story.id === id || String(story.legacyId) === id
  );
}
