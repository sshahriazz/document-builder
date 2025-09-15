"use client";
import React, { memo, useMemo } from "react";
import { useHeaderStyle } from "@/app/store/themeStyle";
import { getThemeComponent } from "./headers";
import { isThemeName, type ThemeName } from "@/app/store/themes";

function useResolvedTheme(name: string): ThemeName {
  return useMemo(
    () => (isThemeName(name) ? name : ("pastel" as const)),
    [name]
  );
}

function RenderThemeInner() {
  const { data } = useHeaderStyle();
  const themeName = useResolvedTheme(data.themeName);
  const ThemeComp = getThemeComponent(themeName);
  return <ThemeComp />;
}

export default memo(RenderThemeInner);
