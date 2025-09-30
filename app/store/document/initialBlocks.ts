// Initial document blocks seed data and helper
// This keeps seeding explicit (not auto-run on import) so you can choose where to hydrate.

import { AnyDocumentBlock } from "./documentBlocks";
import { useDocumentBlocksStore } from "./documentBlocksStore";
import { useDocumentConfig } from "./documentConfig";

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
    uuid: "blk_text_notes",
    type: "text-area",
    content: {
      text: "Internal notes: refine messaging before sending to client."
    },
    position: 1, // will be shifted to 2 when fee-summary is inserted during seeding
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
  // Build fee-summary using current document config for currency and default structure
  const cfg = useDocumentConfig.getState();
  const feeBlock: AnyDocumentBlock = {
    uuid: "blk_fee_summary",
    type: "fee-summary",
    content: {
      structure: cfg.defaultStructure,
      currency: cfg.currency,
      taxRate: 0,
      options: [
        {
          id: "opt_starter",
          summary: "<p><strong>Starter Package</strong></p><p>Basic deliverables suitable for small engagements.</p>",
          items: [{ id: "it_one_time", name: "One-time Fee", qty: 1, unitPrice: 2500 }],
          taxRate: 0,
          currency: cfg.currency,
          selected: cfg.defaultStructure === 'packages' ? false : undefined,
        },
        {
          id: "opt_six_month",
          summary: "<p><strong>6-Month Package</strong></p><p>Monthly retainer over 6 months for the agreed-upon services.</p>",
          items: [{ id: "it_monthly_6", name: "Monthly Fee", qty: 6, unitPrice: 2000 }],
          taxRate: 0,
          currency: cfg.currency,
          selected: cfg.defaultStructure === 'packages',
        },
        {
          id: "opt_premium",
          summary: "<p><strong>Premium Package</strong></p><p>Expanded scope, priority support, and additional reviews.</p>",
          items: [{ id: "it_monthly_6_p", name: "Monthly Fee", qty: 6, unitPrice: 3000 }],
          taxRate: 0,
          currency: cfg.currency,
          selected: cfg.defaultStructure === 'packages' ? false : undefined,
        }
      ]
    } as any,
    position: 1,
    style: { marginTop: 20, marginBottom: 24 }
  };

  const base = initialDocumentBlocks;
  const textBlock = { ...base[1], position: 2 } as AnyDocumentBlock;
  const blocks: AnyDocumentBlock[] = [base[0], feeBlock, textBlock];
  state.replaceAll(blocks);
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
