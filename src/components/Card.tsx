import { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * The dark glass-panel container used throughout KIDDO
 * (border-white/10 + bg-white/5 + rounded corners). Every page
 * previously repeated this className by hand — this just centralizes
 * it. Pass rounding/padding/gradient via className as needed; nothing
 * here is opinionated beyond the base look.
 */
export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-[2rem] border border-white/10 bg-white/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
