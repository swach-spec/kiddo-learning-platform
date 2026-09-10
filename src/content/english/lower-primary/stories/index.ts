import { Story } from "@/types/content";
import { lostKite } from "./lost-kite";
import { cleverTortoise } from "./clever-tortoise";
import { lionAndMouse } from "./lion-and-mouse";
import { secretGarden } from "./secret-garden";
import { expandedLowerPrimaryStories } from "./expanded-stories";

export const lowerPrimaryEnglishStories: Story[] = [
  lostKite,
  cleverTortoise,
  lionAndMouse,
  secretGarden,
  ...expandedLowerPrimaryStories,
];
