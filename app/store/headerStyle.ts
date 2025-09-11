import { create } from "zustand";
import { HeaderStyleData } from "../components/types";
import { THEMES, themeNames as allThemeNames } from "./themes";

export type HeaderStyleStore = {
  data: HeaderStyleData;
  themes: typeof THEMES; // editable theme registry
  // generic setters (for non-theme fields)
  set: <K extends keyof HeaderStyleData>(
    key: K,
    value: HeaderStyleData[K]
  ) => void;
  setMany: (patch: Partial<HeaderStyleData>) => void;
  // themed helpers (edit the active theme's attributes)
  setThemeValue: <
    K extends
      | "titleColor"
      | "textColor"
      | "backgroundColor"
      | "bottomBorderColor"
      | "bottomBorderWidth"
  >(
    key: K,
    value: HeaderStyleData[K]
  ) => void;
  setThemeMany: (
    patch: Partial<
      Pick<
        HeaderStyleData,
        | "titleColor"
        | "textColor"
        | "backgroundColor"
        | "bottomBorderColor"
        | "bottomBorderWidth"
      >
    >
  ) => void;
  applyTheme: (themeName: string) => void;
  // background helpers
  setBackgroundImage: (url: string | null) => void;
  clearBackground: () => void;
};

const initialThemeName = "pastel" as const;
const initialTheme = THEMES[initialThemeName];
const initialData: HeaderStyleData = {
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
  themes: { ...THEMES },
  set: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),
  setMany: (patch) => set((state) => ({ data: { ...state.data, ...patch } })),
  setThemeValue: (key, value) => {
    const { data, themes } = get();
    const active = data.themeName;
    const updatedTheme = {
      ...themes[active],
      [key]: value,
    } as (typeof THEMES)[string];
    set({
      themes: { ...themes, [active]: updatedTheme },
      data: { ...data, [key]: value as any },
    });
  },
  setThemeMany: (patch) => {
    const { data, themes } = get();
    const active = data.themeName;
    const updatedTheme = {
      ...themes[active],
      ...patch,
    } as (typeof THEMES)[string];
    set({
      themes: { ...themes, [active]: updatedTheme },
      data: { ...data, ...patch },
    });
  },
  applyTheme: (themeName) => {
    const theme = get().themes[themeName];
    if (!theme) return;
    set((state) => ({
      data: {
        ...state.data,
        themeName,
        ...theme,
      },
    }));
  },
  setBackgroundImage: (url) =>
    set((state) => ({ data: { ...state.data, backgroundImage: url } })),
  clearBackground: () =>
    set((state) => ({ data: { ...state.data, backgroundImage: null } })),
}));
export const themeNames = allThemeNames;
