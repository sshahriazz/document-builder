import { create } from "zustand";
import type { HeaderData, Party } from "../components/types";

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

export const useHeaderContent = create<HeaderContentStore>((set) => ({
  data: initialData,
  hydrated: false,
  set: (key, value) => set((s) => ({ data: { ...s.data, [key]: value } })),
  setMany: (patch) => set((s) => ({ data: { ...s.data, ...patch } })),
  reset: () => set({ data: initialData }),
  setParty: (who, patch) =>
    set((s) => ({ data: { ...s.data, [who]: { ...s.data[who], ...patch } } })),
  setPartyField: (who, key, value) =>
    set((s) => ({
      data: { ...s.data, [who]: { ...s.data[who], [key]: value } as Party },
    })),
  setEmail: (who, index, value) =>
    set((s) => {
      const emails = [...s.data[who].email];
      // Ensure array large enough
      for (let i = emails.length; i <= index; i++) emails[i] = "";
      emails[index] = value;
      return { data: { ...s.data, [who]: { ...s.data[who], email: emails } } };
    }),
  addEmail: (who) =>
    set((s) => ({
      data: {
        ...s.data,
        [who]: { ...s.data[who], email: [...s.data[who].email, ""] },
      },
    })),
  removeEmail: (who, index) =>
    set((s) => {
      const emails = s.data[who].email.filter((_, i) => i !== index);
      return {
        data: { ...s.data, [who]: { ...s.data[who], email: emails } },
      };
    }),
  setAddressLine: (who, index, value) =>
    set((s) => {
      const addr = [...s.data[who].address];
      for (let i = addr.length; i <= index; i++) addr[i] = "";
      addr[index] = value;
      return { data: { ...s.data, [who]: { ...s.data[who], address: addr } } };
    }),
  addAddressLine: (who) =>
    set((s) => ({
      data: {
        ...s.data,
        [who]: { ...s.data[who], address: [...s.data[who].address, ""] },
      },
    })),
  removeAddressLine: (who, index) =>
    set((s) => {
      const addr = s.data[who].address.filter((_, i) => i !== index);
      return {
        data: { ...s.data, [who]: { ...s.data[who], address: addr } },
      };
    }),
}));

export type { HeaderData } from "../components/types";

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
