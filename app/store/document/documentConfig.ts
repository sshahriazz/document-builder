import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { FeeStructure } from "./documentBlocks";
import type { CurrencyCode } from "@/app/types/currency";

export interface DocumentConfigState {
  currency: CurrencyCode; // document default
  defaultStructure: FeeStructure; // default for new fee-summary blocks
  requireUpfront: boolean; // whether proposal requires upfront payment
  upfrontPercent: number; // 0..100
  expirationDate?: string; // ISO date (YYYY-MM-DD)
}

export interface DocumentConfigActions {
  setCurrency: (code: CurrencyCode) => void;
  setDefaultStructure: (s: FeeStructure) => void;
  setRequireUpfront: (v: boolean) => void;
  setUpfrontPercent: (p: number) => void;
  setExpirationDate: (isoDate?: string) => void;
}

const initial: DocumentConfigState = {
  currency: "USD",
  defaultStructure: "single",
  requireUpfront: false,
  upfrontPercent: 0,
  expirationDate: undefined,
};

export const useDocumentConfig = create<DocumentConfigState & DocumentConfigActions>()(
  immer((set) => ({
    ...initial,
    setCurrency: (code) => set((s) => { s.currency = code; }),
    setDefaultStructure: (str) => set((s) => { s.defaultStructure = str; }),
    setRequireUpfront: (v) => set((s) => { s.requireUpfront = v; }),
    setUpfrontPercent: (p) => set((s) => { s.upfrontPercent = Math.max(0, Math.min(100, p)); }),
    setExpirationDate: (d) => set((s) => { s.expirationDate = d; }),
  }))
);

export type DocumentConfig = DocumentConfigState;
