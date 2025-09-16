import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";
import type { HeaderData } from "@/app/components/types";

export interface DocumentSnapshot {
  headerData: HeaderData;
  headerStyle: Record<string, any>; // keep flexible for now
  documentBlocks: AnyDocumentBlock[];
  savedAt: string; // ISO timestamp
  version: number;
}

const STORAGE_KEY = "document_builder_snapshot_v1";

export function saveSnapshot(snap: Omit<DocumentSnapshot, "savedAt" | "version">) {
  const full: DocumentSnapshot = { ...snap, savedAt: new Date().toISOString(), version: 1 };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  } catch (e) {
    console.warn("Failed to save snapshot", e);
  }
}

export function loadSnapshot(): DocumentSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DocumentSnapshot;
  } catch (e) {
    console.warn("Failed to parse snapshot", e);
    return null;
  }
}

export function clearSnapshot() {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
}
