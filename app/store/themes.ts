import type { HeaderStyleData } from "../components/types";

export type HeaderTheme = Pick<
  HeaderStyleData,
  | "titleColor"
  | "textColor"
  | "backgroundColor"
  | "bottomBorderColor"
  | "bottomBorderWidth"
>;

// Central theme registry
export const THEMES: Record<string, HeaderTheme> = {
  pastel: {
    titleColor: "#1f2937",
    textColor: "#374151",
    backgroundColor: "#f3e8ff",
    bottomBorderColor: "#c4b5fd",
    bottomBorderWidth: 2,
  },
  dark: {
    titleColor: "#f9fafb",
    textColor: "#e5e7eb",
    backgroundColor: "#111827",
    bottomBorderColor: "#1f2937",
    bottomBorderWidth: 2,
  },
};

export const themeNames = Object.keys(THEMES);

export function getThemeOrDefault(name?: string | null): HeaderTheme {
  return (name && THEMES[name]) || THEMES.pastel;
}
