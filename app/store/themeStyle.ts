import { create } from "zustand";
import { ThemeStyleData } from "../components/types";
import {
  THEMES,
  themeNames as allThemeNames,
  isThemeName,
  type ThemeName,
} from "./themes";

export type HeaderStyleStore = {
  data: ThemeStyleData;
  themes: Record<ThemeName, ThemeStyleData>; // editable theme registry
  // generic setters (for non-theme fields)
  set: <K extends keyof ThemeStyleData>(
    key: K,
    value: ThemeStyleData[K]
  ) => void;
  setMany: (patch: Partial<ThemeStyleData>) => void;
  // themed helpers (edit the active theme's attributes)
  setThemeValue: <
    K extends keyof Omit<ThemeStyleData, "themeName" | "backgroundImage">
  >(
    key: K,
    value: ThemeStyleData[K]
  ) => void;
  setThemeMany: (patch: Partial<ThemeStyleData>) => void;
  applyTheme: (themeName: string) => void;
  // background helpers
  setBackgroundImage: (url?: string) => void;
  clearBackground: () => void;
};

const initialThemeName = "pastel" as const;
const initialTheme = THEMES[initialThemeName];
const initialData: ThemeStyleData = {
  themeName: initialThemeName,
  backgroundImage:
    "https://plus.unsplash.com/premium_photo-1683865776032-07bf70b0add1?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  titleColor: initialTheme.titleColor,
  textColor: initialTheme.textColor,
  backgroundColor: initialTheme.backgroundColor,
  bottomBorderColor: initialTheme.bottomBorderColor,
  bottomBorderWidth: initialTheme.bottomBorderWidth,
};

export const useHeaderStyle = create<HeaderStyleStore>((set, get) => ({
  data: initialData,
  themes: { ...THEMES } as Record<ThemeName, ThemeStyleData>,
  set: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),
  setMany: (patch) => set((state) => ({ data: { ...state.data, ...patch } })),
  setThemeValue: (key, value) => {
    const { data, themes } = get();
    const active = isThemeName(data.themeName)
      ? data.themeName
      : ("pastel" as const);
    const updatedTheme = {
      ...themes[active],
      [key]: value,
    } as ThemeStyleData;
    set({
      themes: { ...themes, [active]: updatedTheme },
      data: { ...data, [key]: value as any },
    });
  },
  setThemeMany: (patch) => {
    const { data, themes } = get();
    const active = isThemeName(data.themeName)
      ? data.themeName
      : ("pastel" as const);
    const updatedTheme = {
      ...themes[active],
      ...patch,
    } as ThemeStyleData;
    set({
      themes: { ...themes, [active]: updatedTheme },
      data: { ...data, ...patch },
    });
  },
  applyTheme: (themeName) => {
    const name = isThemeName(themeName) ? themeName : ("pastel" as const);
    const theme = get().themes[name];
    if (!theme) return;
    set((state) => ({
      data: {
        ...state.data,
        // themeName,
        ...theme,
      },
    }));
  },
  setBackgroundImage: (url) =>
    set((state) => ({ data: { ...state.data, backgroundImage: url } })),
  clearBackground: () =>
    set((state) => ({ data: { ...state.data, backgroundImage: undefined } })),
}));
export const themeNames = allThemeNames;
