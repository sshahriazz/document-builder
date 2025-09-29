import { nanoid } from "nanoid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { BlockType, BlockContentMap, BlockStyleMap, AnyDocumentBlock, DocumentBlock } from "./documentBlocks";

// ---------------------------------------------
// Store Entity (no duplicate position field kept; derive when needed)
// ---------------------------------------------
export interface BlockEntity<T extends BlockType = BlockType> extends Omit<DocumentBlock<T>, 'position'> {}
export type AnyBlockEntity = BlockEntity<BlockType>;

// ---------------------------------------------
// State Shape
// ---------------------------------------------
interface BlocksState {
    byId: Record<string, AnyBlockEntity>;
    order: string[]; // uuid ordering
    hydrated: boolean;
}

// ---------------------------------------------
// Input helper types
// ---------------------------------------------
export type NewBlockInput<T extends BlockType> = {
    type: T;
    content: BlockContentMap[T];
    style?: BlockStyleMap[T];
    uuid?: string;
};

// ---------------------------------------------
// Actions
// ---------------------------------------------
interface BlocksActions {
    addBlock: <T extends BlockType>(data: NewBlockInput<T>, index?: number) => string;
    insertAfter: (targetUuid: string | null, data: NewBlockInput<BlockType>) => string; // null = prepend
    updateContent: <T extends BlockType>(uuid: string, updater: (prev: BlockContentMap[T]) => BlockContentMap[T]) => void;
    /**
     * mutateContent: run an immer-powered mutator against a block's content in-place.
     * Prefer this for deep, localized updates to avoid cloning large objects in components.
     */
    mutateContent: <T extends BlockType>(uuid: string, mutator: (draft: BlockContentMap[T]) => void) => void;
    patchContent: (uuid: string, partial: Partial<BlockContentMap[BlockType]>) => void; // lenient patch across kinds
    updateStyle: <T extends BlockType>(uuid: string, partial: Partial<BlockStyleMap[T]>) => void;
    moveBlock: (uuid: string, toIndex: number) => void;
    removeBlock: (uuid: string) => void;
    replaceAll: (blocks: AnyDocumentBlock[]) => void;
    clear: () => void;
    getOrdered: () => AnyDocumentBlock[]; // materialize with position
}

export type DocumentBlocksStore = BlocksState & BlocksActions;

// ---------------------------------------------
// Initial State
// ---------------------------------------------
const initial: BlocksState = {
    byId: {},
    order: [],
    hydrated: true,
};

// ---------------------------------------------
// Utility: build view model with position
// ---------------------------------------------
function materialize(state: BlocksState): AnyDocumentBlock[] {
    return state.order.map((uuid, index) => {
        const b = state.byId[uuid];
        return { ...b, position: index } as AnyDocumentBlock;
    });
}

// ---------------------------------------------
// Store Implementation
// ---------------------------------------------
export const useDocumentBlocksStore = create<DocumentBlocksStore>()(
    immer((set, get) => ({
        ...initial,
        addBlock: (data, index) => {
            const uuid = data.uuid || nanoid();
            set((draft) => {
                if (draft.byId[uuid]) return; // avoid collision
                draft.byId[uuid] = { uuid, type: data.type, content: data.content, style: data.style };
                const insertAt = index == null ? draft.order.length : Math.max(0, Math.min(index, draft.order.length));
                draft.order.splice(insertAt, 0, uuid);
            });
            return uuid;
        },
        insertAfter: (targetUuid, data) => {
            if (!targetUuid) return get().addBlock(data, 0);
            const idx = get().order.indexOf(targetUuid);
            const insertAt = idx === -1 ? undefined : idx + 1;
            return get().addBlock(data, insertAt);
        },
        updateContent: (uuid, updater) => {
            set((draft) => {
                const ent = draft.byId[uuid];
                if (!ent) return;
                ent.content = updater(ent.content as any);
            });
        },
        mutateContent: (uuid, mutator) => {
            set((draft) => {
                const ent = draft.byId[uuid];
                if (!ent) return;
                mutator(ent.content as any);
            });
        },
        patchContent: (uuid, partial) => {
            set((draft) => {
                const ent = draft.byId[uuid];
                if (!ent) return;
                ent.content = { ...(ent.content as any), ...partial };
            });
        },
        updateStyle: (uuid, partial) => {
            set((draft) => {
                const ent = draft.byId[uuid];
                if (!ent) return;
                ent.style = { ...(ent.style as any), ...partial };
            });
        },
        moveBlock: (uuid, toIndex) => {
            set((draft) => {
                const cur = draft.order.indexOf(uuid);
                if (cur === -1) return;
                const target = Math.max(0, Math.min(toIndex, draft.order.length - 1));
                if (cur === target) return;
                const [id] = draft.order.splice(cur, 1);
                draft.order.splice(target, 0, id);
            });
        },
        removeBlock: (uuid) => {
            set((draft) => {
                if (!draft.byId[uuid]) return;
                delete draft.byId[uuid];
                const idx = draft.order.indexOf(uuid);
                if (idx !== -1) draft.order.splice(idx, 1);
            });
        },
        replaceAll: (blocks) => {
            set((draft) => {
                draft.byId = {} as any;
                draft.order = [];
                blocks.forEach((b) => {
                    draft.byId[b.uuid] = { uuid: b.uuid, type: b.type, content: b.content, style: b.style };
                    draft.order.push(b.uuid);
                });
            });
        },
        clear: () => set(() => ({ ...initial })),
        getOrdered: () => materialize(get()),
    }))
);

// ---------------------------------------------
// Selectors
// ---------------------------------------------
export const selectOrdered = (s: DocumentBlocksStore) => materialize(s);
/**
 * Stable selector returning the raw block entity reference (no derived position).
 * Derive position separately to avoid creating a new object each snapshot, which
 * can trigger infinite re-render warnings with useSyncExternalStore wrappers (Next.js turbopack).
 */
export const selectBlock = (uuid: string) => (s: DocumentBlocksStore) => s.byId[uuid];

// Derived helper to ensure exhaustive type narrowing by block type
export function isBlockOfType<T extends BlockType>(block: AnyDocumentBlock, type: T): block is Extract<AnyDocumentBlock, { type: T }> {
    return block.type === type;
}
