import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { ThemeName } from "@/app/store/themes";
import ThemeSkeleton from "./ThemeSkeleton";

// Lazy-loaded theme components (no SSR because they rely on client-side state)
const Pastel = dynamic(() => import("./Pastel"), {
  ssr: false,
  loading: () => <ThemeSkeleton />,
});
const Dark = dynamic(() => import("./Dark"), {
  ssr: false,
  loading: () => <ThemeSkeleton />,
});

// Typed registry mapping theme names to components
export const ThemeComponents: Record<ThemeName, ComponentType> = {
  pastel: Pastel,
  dark: Dark,
};

export function getThemeComponent(name: ThemeName): ComponentType {
  return ThemeComponents[name];
}
