import { create } from "zustand";

type UIStore = {
  isEditing: boolean;
  setEditing: (value: boolean) => void;
  toggleEditing: () => void;
};

export const useUI = create<UIStore>((set, get) => ({
  isEditing: true,
  setEditing: (value) => set({ isEditing: value }),
  toggleEditing: () => set({ isEditing: !get().isEditing }),
}));

let __uiInitialized = false;
export function initUI(defaults: Partial<Pick<UIStore, "isEditing">>) {
  if (__uiInitialized) return;
  // Shallow merge only provided defaults to avoid overwriting actions
  useUI.setState(defaults);
  __uiInitialized = true;
}
