import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const buttonStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: "var(--ec-accent)",
    color: "#06130F",
    border: "1px solid transparent"
  },
  secondary: {
    background: "var(--ec-surface-raised)",
    color: "var(--ec-text)",
    border: "1px solid var(--ec-border)"
  },
  ghost: {
    background: "transparent",
    color: "var(--ec-text)",
    border: "1px solid transparent"
  }
};

export function Button({
  variant = "primary",
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        minHeight: 44,
        padding: "0.7rem 1rem",
        borderRadius: "var(--ec-radius-md)",
        font: "inherit",
        fontWeight: 600,
        cursor: props.disabled ? "not-allowed" : "pointer",
        transition: "background var(--ec-motion-normal) var(--ec-easing), border-color var(--ec-motion-normal) var(--ec-easing), transform var(--ec-motion-fast) var(--ec-easing)",
        ...buttonStyles[variant],
        ...style
      }}
    >
      {children}
    </button>
  );
}

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  elevated?: boolean;
}

export function Surface({
  children,
  elevated = false,
  style,
  ...props
}: SurfaceProps) {
  return (
    <div
      {...props}
      style={{
        background: elevated ? "var(--ec-surface-raised)" : "var(--ec-surface)",
        color: "var(--ec-text)",
        border: "1px solid var(--ec-border)",
        borderRadius: "var(--ec-radius-lg)",
        padding: "1rem",
        ...style
      }}
    >
      {children}
    </div>
  );
}
