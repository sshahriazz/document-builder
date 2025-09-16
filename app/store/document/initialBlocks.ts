// Initial document blocks seed data and helper
// This keeps seeding explicit (not auto-run on import) so you can choose where to hydrate.

import { AnyDocumentBlock } from "./documentBlocks";
import { useDocumentBlocksStore } from "./documentBlocksStore";

/**
 * Three starter blocks (one per block type) with stable UUIDs.
 * You can duplicate / modify as needed.
 */
export const initialDocumentBlocks: AnyDocumentBlock[] = [
  {
    uuid: "blk_rich_welcome",
    type: "rich-text",
    content: {
      html: "<h1>Welcome</h1><p>This is your first rich text block.</p>"
    },
    position: 0,
    style: { fontSize: 18, marginBottom: 16 }
  },
  {
    uuid: "blk_invoice_summary",
    type: "invoice-summary",
    content: {
      items: [
        { id: "it_design", description: "Design Phase", quantity: 8, unitPrice: 90 },
        { id: "it_dev", description: "Development", quantity: 24, unitPrice: 110 },
        { id: "it_review", description: "Review & QA", quantity: 6, unitPrice: 85 }
      ],
      taxRate: 8.5,
      currency: "USD",
      notes: "Payment due NET 15."
    },
    position: 1,
    style: { compact: false, marginTop: 20, marginBottom: 24 }
  },
  {
    uuid: "blk_text_notes",
    type: "text-area",
    content: {
      text: "Internal notes: refine messaging before sending to client."
    },
    position: 2,
    style: { monospace: true, marginTop: 12 }
  }
];

/**
 * Hydrate the store with the initial blocks.
 * Call this once in a client component (e.g. inside a useEffect in a Provider) if you want defaults.
 */
export function seedDocumentBlocks(force = false) {
  const state = useDocumentBlocksStore.getState();
  if (!force && state.order.length > 0) return; // avoid overwriting existing user data unless forced
  state.replaceAll(initialDocumentBlocks);
}

/**
 * Example usage (not executed here):
 *
 * import { useEffect } from 'react';
 * import { seedDocumentBlocks } from '@/app/store/document/initialBlocks';
 *
 * export function DocumentProvider({ children }: { children: React.ReactNode }) {
 *   useEffect(() => { seedDocumentBlocks(); }, []);
 *   return <>{children}</>;
 * }
 */
