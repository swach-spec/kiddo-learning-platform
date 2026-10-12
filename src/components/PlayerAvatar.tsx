import Image from "next/image";
import { avatarImage, IMAGE_AVATAR_PREFIX } from "@/lib/media";

type PlayerAvatarProps = {
  avatar: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<PlayerAvatarProps["size"]>, string> = {
  // Matches HEAD exactly per size: Home/Story Forest header avatars
  // (sm/md) had no shadow class at all; only the Players page avatar
  // (lg) had shadow-2xl. A shared "shadow-lg" applied to all sizes in
  // Phase 1 was a visual regression — reverted here.
  sm: "h-10 w-10 rounded-xl text-xl",
  md: "h-11 w-11 rounded-2xl text-xl",
  lg: "h-28 w-28 rounded-[2rem] text-6xl shadow-2xl",
};

const pixels: Record<NonNullable<PlayerAvatarProps["size"]>, number> = { sm: 40, md: 44, lg: 112 };

/** A player's avatar: a picture when one exists, otherwise the emoji on the cyan/blue gradient. */
export function PlayerAvatar({ avatar, size = "md" }: PlayerAvatarProps) {
  const image = avatarImage(avatar);
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-600 ${sizeClasses[size]}`}>
      {image ? (
        <Image src={image} alt="" width={pixels[size]} height={pixels[size]} sizes={`${pixels[size]}px`} className="h-full w-full object-cover" />
      ) : avatar.startsWith(IMAGE_AVATAR_PREFIX) ? (
        "🧑🏾‍🚀"
      ) : (
        avatar
      )}
    </div>
  );
}
