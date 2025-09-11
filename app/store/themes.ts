import type { ThemeStyleData } from "../components/types";

// Central theme registry (typed and key-safe)
export const THEMES = {
  pastel: {
    backgroundImage: undefined,
    titleColor: "#1f2937",
    textColor: "#374151",
    backgroundColor: "#f3e8ff",
    bottomBorderColor: "#c4b5fd",
    bottomBorderWidth: 2,
    themeName: "pastel",
  },
  dark: {
    backgroundImage: undefined,
    titleColor: "#f9fafb",
    textColor: "#e5e7eb",
    backgroundColor: "#111827",
    bottomBorderColor: "#1f2937",
    bottomBorderWidth: 2,
    themeName: "dark",
  },
} as const satisfies Record<string, ThemeStyleData>;

export type ThemeName = keyof typeof THEMES;

export const themeNames = Object.keys(THEMES) as ThemeName[];

export function isThemeName(name: string): name is ThemeName {
  return name in THEMES;
}

export function getThemeOrDefault(
  name?: string | null
): Partial<ThemeStyleData> {
  return name && isThemeName(name) ? THEMES[name] : THEMES.pastel;
}
