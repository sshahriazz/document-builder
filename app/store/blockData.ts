import { create } from "zustand";
import { InvoiceItem } from "./documentBlocks";

// --------------------
// Data shapes per block kind
// --------------------

export interface RichTextData {
  html: string; // serialized html from TipTap
}

export interface InvoiceSummaryData {
  currency: string;
  taxRate: number;
  items: InvoiceItem[];
  notes?: string;
}

export type BlockDataByKind = {
  "rich-text": RichTextData;
  overview: RichTextData;
  scope: RichTextData;
  deliverables: RichTextData;
  timeline: RichTextData;
  "invoice-summary": InvoiceSummaryData;
  // Extend with additional kinds here
};

export type AnyBlockKind = keyof BlockDataByKind;

export type BlockData = BlockDataByKind[AnyBlockKind];

interface BlockDataStore {
  data: Record<string, BlockData>; // key = blockUID
  initData: <K extends AnyBlockKind>(
    id: string,
    kind: K,
    initial: BlockDataByKind[K]
  ) => void;
  updateData: <K extends AnyBlockKind>(
    id: string,
    kind: K,
    patch: Partial<BlockDataByKind[K]>
  ) => void;
  replaceData: (id: string, full: BlockData) => void;
  getData: <K extends AnyBlockKind>(
    id: string
  ) => BlockDataByKind[K] | undefined;
  removeData: (id: string) => void;
  clearAll: () => void;
}

export const useBlockData = create<BlockDataStore>((set, get) => ({
  data: {},
  initData: (id, _kind, initial) =>
    set((s) => (s.data[id] ? s : { data: { ...s.data, [id]: initial } })),
  updateData: (id, _kind, patch) =>
    set((s) => {
      if (!s.data[id]) return s;
      return {
        data: { ...s.data, [id]: { ...(s.data[id] as any), ...patch } },
      };
    }),
  replaceData: (id, full) => set((s) => ({ data: { ...s.data, [id]: full } })),
  getData: (id) => get().data[id] as any,
  removeData: (id) =>
    set((s) => {
      if (!s.data[id]) return s;
      const next = { ...s.data };
      delete next[id];
      return { data: next };
    }),
  clearAll: () => set({ data: {} }),
}));
