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

/** The cyan/blue gradient circle used to display a player's emoji avatar. */
export function PlayerAvatar({ avatar, size = "md" }: PlayerAvatarProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-600 ${sizeClasses[size]}`}
    >
      {avatar}
    </div>
  );
}
