export const color = {
  neutral: {
    0: "#FFFFFF",
    50: "#F7F8F7",
    100: "#ECEFEC",
    200: "#DCE2DE",
    300: "#B9C5BE",
    400: "#87968D",
    500: "#64736A",
    600: "#48564E",
    700: "#303D35",
    800: "#202A24",
    900: "#141B17",
    950: "#0B100D",
    1000: "#000000"
  },
  teal: {
    100: "#C5F4E8",
    200: "#9AE8D6",
    300: "#6CD9C4",
    400: "#43C8B1",
    500: "#20B39D",
    600: "#168E7D",
    700: "#126F63",
    800: "#10574F",
    900: "#0D403A"
  },
  gold: {
    100: "#F8EAC4",
    200: "#EED99B",
    300: "#DFC16D",
    400: "#CBA64B",
    500: "#AD8735",
    600: "#896A2B"
  }
} as const;

export const typography = {
  fontFamily: {
    display: "'Zen Dots', 'Arial Black', sans-serif",
    sans: "'DM Sans', Inter, system-ui, sans-serif",
    editorial: "'Playfair Display', Georgia, serif",
    mono: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace"
  },
  size: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.5rem"
  }
} as const;

export const radius = {
  sm: "0.5rem",
  md: "0.875rem",
  lg: "1.25rem",
  xl: "1.75rem",
  pill: "999px"
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem"
} as const;

export const motion = {
  duration: {
    fast: "140ms",
    normal: "220ms",
    slow: "360ms"
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1.15)",
    decelerate: "cubic-bezier(0, 0, 0, 1)"
  }
} as const;

export type ThemeMode = "light" | "dark" | "system";
