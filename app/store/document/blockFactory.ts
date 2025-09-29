import { nanoid } from "nanoid";
import { BlockType, BlockContentMap, BlockStyleMap } from "./documentBlocks";
import { useDocumentConfig } from "./documentConfig";

export function createBlock(type: BlockType): { type: BlockType; content: BlockContentMap[BlockType]; style?: BlockStyleMap[BlockType]; uuid: string } {
  switch (type) {
    case "rich-text":
      return { type, uuid: nanoid(), content: { html: "<p>New rich text block</p>" } } as any;
    case "text-area":
      return { type, uuid: nanoid(), content: { text: "New notes" } } as any;
    case "fee-summary":
      // Read current config synchronously from the store (safe for client-only usage)
      const cfg = useDocumentConfig.getState();
      return {
        type,
        uuid: nanoid(),
        content: {
          structure: cfg.defaultStructure,
          currency: cfg.currency,
          taxRate: 0,
          options: [
            {
              id: nanoid(),
              title: 'Starter Package',
              description: 'Basic deliverables suitable for small engagements.',
              items: [ { id: nanoid(), name: 'One-time Fee', qty: 1, unitPrice: 2500 } ],
              taxRate: 0,
              currency: cfg.currency,
              selected: false,
            },
            {
              id: nanoid(),
              title: '6-Month Package',
              description: 'Monthly retainer over 6 months for the agreed-upon services.',
              items: [ { id: nanoid(), name: 'Monthly Fee', qty: 6, unitPrice: 2000 } ],
              taxRate: 0,
              currency: cfg.currency,
              selected: cfg.defaultStructure === 'packages',
            },
            {
              id: nanoid(),
              title: 'Premium Package',
              description: 'Expanded scope, priority support, and additional reviews.',
              items: [ { id: nanoid(), name: 'Monthly Fee', qty: 6, unitPrice: 3000 } ],
              taxRate: 0,
              currency: cfg.currency,
              selected: false,
            }
          ]
        }
      } as any;
    default:
      // exhaustive
      return { type, uuid: nanoid(), content: {} as any };
  }
}

export const blockTypeLabels: Record<BlockType, string> = {
  "rich-text": "Rich Text",
  "text-area": "Text Area",
  "fee-summary": "Fee Summary"
};