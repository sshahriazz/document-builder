import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { HeaderData, Party } from "../../components/types";

export type HeaderContentStore = {
  data: HeaderData;
  hydrated: boolean; // indicates data replaced by server/mock
  // Root setters
  set: <K extends keyof HeaderData>(key: K, value: HeaderData[K]) => void;
  setMany: (patch: Partial<HeaderData>) => void;
  reset: () => void;
  // Party helpers
  setParty: (who: "from" | "to", patch: Partial<Party>) => void;
  setPartyField: <K extends keyof Party>(
    who: "from" | "to",
    key: K,
    value: Party[K]
  ) => void;
  // Email helpers (we map UI single email to index 0)
  setEmail: (who: "from" | "to", index: number, value: string) => void;
  addEmail: (who: "from" | "to") => void;
  removeEmail: (who: "from" | "to", index: number) => void;
  // Address helpers
  setAddressLine: (who: "from" | "to", index: number, value: string) => void;
  addAddressLine: (who: "from" | "to") => void;
  removeAddressLine: (who: "from" | "to", index: number) => void;
};

const initialParty: Party = {
  name: "Sayed Rezwanul Karin",
  email: ["karim@kk.com"],
  address: ["test address", "12, road", "creating date"],
};

const initialData: HeaderData = {
  invoiceName: "Invoice",
  sentDate: "12 Aug 2024",
  acceptedDate: "10 Sep 2024",
  from: { ...initialParty },
  to: { ...initialParty },
};

export const useHeaderContent = create<HeaderContentStore>()(
  immer((set) => ({
    data: initialData,
    hydrated: false,
    set: (key, value) =>
      set((state) => {
        (state.data as any)[key] = value as any;
      }),
    setMany: (patch) =>
      set((state) => {
        Object.assign(state.data as any, patch as any);
      }),
    reset: () => set({ data: initialData }),
    setParty: (who, patch) =>
      set((state) => {
        state.data[who] = { ...state.data[who], ...(patch as any) } as any;
      }),
    setPartyField: (who, key, value) =>
      set((state) => {
        (state.data[who] as any)[key as any] = value as any;
      }),
    setEmail: (who, index, value) =>
      set((state) => {
        const emails = (state.data[who] as any).email ?? [];
        for (let i = emails.length; i <= index; i++) emails[i] = "";
        emails[index] = value;
        (state.data[who] as any).email = emails;
      }),
    addEmail: (who) =>
      set((state) => {
        (state.data[who] as any).email = [
          ...((state.data[who] as any).email ?? []),
          "",
        ];
      }),
    removeEmail: (who, index) =>
      set((state) => {
        (state.data[who] as any).email = (
          (state.data[who] as any).email || []
        ).filter((_: any, i: number) => i !== index);
      }),
    setAddressLine: (who, index, value) =>
      set((state) => {
        const addr = (state.data[who] as any).address ?? [];
        for (let i = addr.length; i <= index; i++) addr[i] = "";
        addr[index] = value;
        (state.data[who] as any).address = addr;
      }),
    addAddressLine: (who) =>
      set((state) => {
        (state.data[who] as any).address = [
          ...((state.data[who] as any).address ?? []),
          "",
        ];
      }),
    removeAddressLine: (who, index) =>
      set((state) => {
        (state.data[who] as any).address = (
          (state.data[who] as any).address || []
        ).filter((_: any, i: number) => i !== index);
      }),
  }))
);

export type { HeaderData } from "../../components/types";

// --- Hydration helpers ---
export async function loadInitialHeaderData(
  source: string = "/mock-initial-data.json"
) {
  try {
    const res = await fetch(source, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed header fetch: ${res.status}`);
    const json = await res.json();
    if (json && json.header) {
      useHeaderContent.setState({ data: json.header, hydrated: true });
    }
  } catch (e) {
    console.warn("Header data load failed; using static defaults", e);
  }
}
