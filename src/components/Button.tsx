import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  // The white pill CTA used for "Start Story", "Next Page", results screens.
  primary:
    "rounded-2xl bg-white py-3 font-black text-slate-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500",
  // The translucent glass button used for secondary actions.
  secondary:
    "rounded-2xl bg-white/10 py-3 font-bold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
