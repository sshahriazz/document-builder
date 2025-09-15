import { create } from "zustand";
// @ts-ignore - module resolution in Next bundler handles .ts without extension
import { blockTemplates } from "./blockTemplates";
// Simple id generator (avoids external dependency). For stronger uniqueness,
// you can swap with nanoid later.

/**
 * Document block shape. Keep minimal for flexibility; "content" can be
 * plain text or serialized rich text/markdown later.
 */
export interface DocumentBlock {
  blockUID: string; // stable unique identifier
  blockName: string; // human label
  content: string; // textual body (extendable)
  kind?: string; // optional template/type identifier
  // future: order, metadata
}

/**
 * Store state & actions.
 */
export interface DocumentBlocksStore {
  blocks: DocumentBlock[];
  hydrated: boolean;
  // Derived helpers (computed selectors can be built with hooks if needed)
  getById: (id: string) => DocumentBlock | undefined;
  // CRUD operations
  addBlock: (
    partial?: Partial<Omit<DocumentBlock, "blockUID" | "blockName">> & {
      blockName?: string;
    }
  ) => string; // returns new id
  insertBlockAt: (
    index: number,
    opts?: Partial<Omit<DocumentBlock, "blockUID">>
  ) => string;
  updateBlock: (
    id: string,
    patch: Partial<Omit<DocumentBlock, "blockUID">>
  ) => void;
  renameBlock: (id: string, name: string) => void;
  setBlockContent: (id: string, content: string) => void;
  removeBlock: (id: string) => void;
  moveBlock: (id: string, toIndex: number) => void;
  replaceAll: (blocks: DocumentBlock[]) => void;
  clear: () => void;
  createFromTemplate: (templateId: string, index?: number) => string;
}

// Lightweight id fallback if nanoid is absent
function safeId() {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toLowerCase();
}

const initial: DocumentBlock[] = [
  {
    blockUID: "block-1",
    blockName: "Block 1",
    content: "This is the content of block 1",
  },
];

export const useDocumentBlocks = create<DocumentBlocksStore>((set, get) => ({
  blocks: initial,
  hydrated: false,
  getById: (id) => get().blocks.find((b) => b.blockUID === id),
  addBlock: (partial) => {
    const id = safeId();
    set((s) => ({
      blocks: [
        ...s.blocks,
        {
          blockUID: id,
          blockName: partial?.blockName || `Block ${s.blocks.length + 1}`,
          content: partial?.content ?? "",
          ...partial,
        },
      ],
    }));
    return id;
  },
  insertBlockAt: (index, opts) => {
    const id = safeId();
    set((s) => {
      const clamped = Math.max(0, Math.min(index, s.blocks.length));
      const block: DocumentBlock = {
        blockUID: id,
        blockName: opts?.blockName || `Block ${clamped + 1}`,
        content: opts?.content ?? "",
        ...opts,
      };
      const next = [...s.blocks];
      next.splice(clamped, 0, block);
      return { blocks: next };
    });
    return id;
  },
  updateBlock: (id, patch) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.blockUID === id ? { ...b, ...patch, blockUID: b.blockUID } : b
      ),
    })),
  renameBlock: (id, name) =>
    set((s) => ({
      blocks: s.blocks.map((b) =>
        b.blockUID === id ? { ...b, blockName: name } : b
      ),
    })),
  setBlockContent: (id, content) =>
    set((s) => ({
      blocks: s.blocks.map((b) => (b.blockUID === id ? { ...b, content } : b)),
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
    const contentFallback = tpl ? tpl.initialContent : "";
    if (typeof index === "number") {
      return get().insertBlockAt(index, {
        blockName: nameFallback,
        content: contentFallback,
        kind: templateId,
      });
    }
    return get().addBlock({
      blockName: nameFallback,
      content: contentFallback,
      kind: templateId,
    });
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
      useDocumentBlocks.setState({ blocks: json.blocks, hydrated: true });
    }
  } catch (e) {
    console.warn("Block data load failed; using static defaults", e);
  }
}

// (DocumentBlock interface already exported above)
