import { MEDIA } from "@/content/media-manifest";

/**
 * Where pictures live, by convention:
 *   /images/stories/<storyId>/<sceneId>.webp   one picture per story scene
 *   /images/stories/<storyId>/cover.webp       the story's cover
 *   /images/avatars/<avatarId>.webp            explorer avatars
 * Anything without a picture falls back to its emoji.
 */
const EXTENSIONS = ["webp", "png", "jpg", "jpeg", "avif"];

function find(base: string): string | null {
  for (const extension of EXTENSIONS) {
    const path = `${base}.${extension}`;
    if (MEDIA.has(path)) return path;
  }
  return null;
}

export function storySceneImage(storyId: string, sceneId: string): string | null {
  return find(`/images/stories/${storyId}/${sceneId}`);
}

export function storyCoverImage(storyId: string): string | null {
  return find(`/images/stories/${storyId}/cover`);
}

/** Picture avatars are stored on the player as "img:<avatarId>"; emoji avatars are stored as the emoji. */
export const IMAGE_AVATAR_PREFIX = "img:";

/** The explorer avatars described in the illustration prompt pack. */
export const PICTURE_AVATARS = [
  { id: "amani", label: "Amani" },
  { id: "zawadi", label: "Zawadi" },
  { id: "baraka", label: "Baraka" },
  { id: "neema", label: "Neema" },
  { id: "jabari", label: "Jabari" },
  { id: "imani", label: "Imani" },
  { id: "tumaini", label: "Tumaini" },
  { id: "nia", label: "Nia" },
] as const;

export function avatarImage(avatar: string): string | null {
  if (!avatar.startsWith(IMAGE_AVATAR_PREFIX)) return null;
  return find(`/images/avatars/${avatar.slice(IMAGE_AVATAR_PREFIX.length)}`);
}

/** Picture avatars that actually have an image yet, as stored values ("img:amani"). */
export function availablePictureAvatars(): string[] {
  return PICTURE_AVATARS.filter((avatar) => find(`/images/avatars/${avatar.id}`)).map((avatar) => `${IMAGE_AVATAR_PREFIX}${avatar.id}`);
}
