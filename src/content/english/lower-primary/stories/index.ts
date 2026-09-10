import { Story } from "@/types/content";
import { lostKite } from "./lost-kite";
import { cleverTortoise } from "./clever-tortoise";
import { lionAndMouse } from "./lion-and-mouse";
import { secretGarden } from "./secret-garden";
import { expandedLowerPrimaryStories } from "./expanded-stories";
import { benchmarkStories } from "./benchmark-stories";
import { calibrateStoryLanguage } from "./story-language-calibration";

export const lowerPrimaryEnglishStories: Story[] = [
  lostKite,
  cleverTortoise,
  lionAndMouse,
  secretGarden,
  ...calibrateStoryLanguage(expandedLowerPrimaryStories),
  ...benchmarkStories,
];
