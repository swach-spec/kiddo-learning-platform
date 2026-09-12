import { Story } from "@/types/content";
import { lostKite } from "./lost-kite";
import { cleverTortoise } from "./clever-tortoise";
import { lionAndMouse } from "./lion-and-mouse";
import { secretGarden } from "./secret-garden";
import { expandedLowerPrimaryStories } from "./expanded-stories";
import { benchmarkStories } from "./benchmark-stories";
import { calibrateStoryLanguage } from "./story-language-calibration";
import { grade2GardenClock } from "./grade-2-garden-clock";

export const lowerPrimaryEnglishStories: Story[] = [
  lostKite,
  cleverTortoise,
  lionAndMouse,
  secretGarden,
  ...calibrateStoryLanguage(expandedLowerPrimaryStories),
  ...benchmarkStories.filter((story) => story.id !== grade2GardenClock.id),
  grade2GardenClock,
];
