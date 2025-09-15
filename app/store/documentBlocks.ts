import { create } from "zustand";
// @ts-ignore
import { blockTemplates } from "./blockTemplates";
import { useBlockData } from "./blockData";

// ----------------------------
// Meta Block Type (data lives elsewhere)
// ----------------------------

export interface DocumentBlockMeta {
  blockUID: string;
  blockName: string;
  kind: string; // discriminant for renderer & data lookup
  // future: ordering, collapse state, permissions, version, tags
}

export type DocumentBlock = DocumentBlockMeta; // alias for clarity

// Re-export invoice item type for components needing it (legacy compatibility)
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Store state & actions.
 */
export interface DocumentBlocksStore {
  blocks: DocumentBlockMeta[];
  hydrated: boolean;
  getById: (id: string) => DocumentBlockMeta | undefined;
  addBlock: (
    block: Omit<DocumentBlockMeta, "blockUID"> & { blockUID?: string }
  ) => string;
  insertBlockAt: (
    index: number,
    block: Omit<DocumentBlockMeta, "blockUID"> & { blockUID?: string }
  ) => string;
  updateBlock: (
    id: string,
    patch: Partial<Omit<DocumentBlockMeta, "blockUID" | "kind">>
  ) => void;
  renameBlock: (id: string, name: string) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, toIndex: number) => void;
  replaceAll: (blocks: DocumentBlockMeta[]) => void;
  clear: () => void;
  createFromTemplate: (templateId: string, index?: number) => string;
}

// Lightweight id fallback if nanoid is absent
function safeId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toLowerCase();
}

const initial: DocumentBlockMeta[] = [];

export const useDocumentBlocks = create<DocumentBlocksStore>((set, get) => ({
  blocks: initial,
  hydrated: false,
  getById: (id) => get().blocks.find((b) => b.blockUID === id),
  addBlock: (block) => {
    const id = block.blockUID || safeId();
    const withDefaults: DocumentBlockMeta = { ...block, blockUID: id };
    set((s) => ({ blocks: [...s.blocks, withDefaults] }));
    return id;
  },
  insertBlockAt: (index, block) => {
    const id = block.blockUID || safeId();
    set((s) => {
      const clamped = Math.max(0, Math.min(index, s.blocks.length));
      const withDefaults: DocumentBlockMeta = { ...block, blockUID: id };
      const next = [...s.blocks];
      next.splice(clamped, 0, withDefaults);
      return { blocks: next };
    });
    return id;
  },
  updateBlock: (id, patch) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.blockUID === id
          ? ({ ...b, ...patch, blockUID: b.blockUID } as DocumentBlockMeta)
          : b
      ),
    })),
  renameBlock: (id, name) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.blockUID === id ? ({ ...b, blockName: name } as DocumentBlockMeta) : b
      ),
    })),
  removeBlock: (id) =>
    set((s) => ({
      blocks: s.blocks.filter((b) => b.blockUID !== id),
    })),
  moveBlock: (id, toIndex) =>
    set((s) => {
      const currentIndex = s.blocks.findIndex((b) => b.blockUID === id);
      if (currentIndex === -1) return s;
      const clamped = Math.max(0, Math.min(toIndex, s.blocks.length - 1));
      if (currentIndex === clamped) return s;
      const next = [...s.blocks];
      const [item] = next.splice(currentIndex, 1);
      next.splice(clamped, 0, item);
      return { blocks: next };
    }),
  replaceAll: (blocks) => set({ blocks: [...blocks] }),
  clear: () => set({ blocks: [] }),
  createFromTemplate: (templateId, index) => {
    const tpl = blockTemplates.find((t: { id: string }) => t.id === templateId);
    const nameFallback = tpl ? tpl.name : "New Block";
    const id = safeId();
    // Initialize data in blockData store
    if (templateId === "invoice-summary") {
      useBlockData.getState().initData(id, "invoice-summary", {
        currency: "USD",
        taxRate: 0,
        items: [
          {
            id: safeId(),
            description: "Line item 1",
            quantity: 1,
            unitPrice: 0,
          },
        ],
        notes: "",
      });
    } else {
      const html = tpl?.initialContent || "<p></p>";
      // treat all non-invoice templates as rich text style under their kind (if unknown default rich-text)
      const kind =
        templateId in { overview: 1, scope: 1, deliverables: 1, timeline: 1 }
          ? templateId
          : "rich-text";
      useBlockData.getState().initData(id, kind as any, { html });
    }
    const meta: DocumentBlockMeta = {
      blockUID: id,
      blockName: nameFallback,
      kind: templateId === "invoice-summary" ? "invoice-summary" : templateId,
    };
    if (typeof index === "number") return get().insertBlockAt(index, meta);
    return get().addBlock(meta);
  },
}));

// --- Hydration helper ---
export async function loadInitialBlocks(
  source: string = "/mock-initial-data.json"
) {
  try {
    const res = await fetch(source, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed blocks fetch: ${res.status}`);
    const json = await res.json();
    if (json && Array.isArray(json.blocks)) {
      // Migration: ensure each legacy block has a kind
      const migrated: DocumentBlockMeta[] = json.blocks.map((b: any) => ({
        blockUID: b.blockUID || safeId(),
        blockName: b.blockName || "Block",
        kind: b.kind || "rich-text",
      }));
      // also seed block data for any items missing
      migrated.forEach((m) => {
        if (m.kind === "invoice-summary") {
          useBlockData.getState().initData(m.blockUID, "invoice-summary", {
            currency: "USD",
            taxRate: 0,
            items: [
              {
                id: safeId(),
                description: "Line item 1",
                quantity: 1,
                unitPrice: 0,
              },
            ],
            notes: "",
          });
        } else {
          useBlockData
            .getState()
            .initData(m.blockUID, m.kind as any, { html: "<p></p>" });
        }
      });
      useDocumentBlocks.setState({ blocks: migrated, hydrated: true });
    }
  } catch (e) {
    console.warn("Block data load failed; using static defaults", e);
  }
}

// (DocumentBlock interface already exported above)
