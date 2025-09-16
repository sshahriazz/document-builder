import { nanoid } from "nanoid";
import { BlockType, BlockContentMap, BlockStyleMap } from "./documentBlocks";

export function createBlock(type: BlockType): { type: BlockType; content: BlockContentMap[BlockType]; style?: BlockStyleMap[BlockType]; uuid: string } {
  switch (type) {
    case "rich-text":
      return { type, uuid: nanoid(), content: { html: "<p>New rich text block</p>" } } as any;
    case "text-area":
      return { type, uuid: nanoid(), content: { text: "New notes" } } as any;
    case "invoice-summary":
      return { type, uuid: nanoid(), content: { items: [], taxRate: 0, currency: "USD", notes: "" } } as any;
    default:
      // exhaustive
      return { type, uuid: nanoid(), content: {} as any };
  }
}

export const blockTypeLabels: Record<BlockType, string> = {
  "rich-text": "Rich Text",
  "text-area": "Text Area",
  "invoice-summary": "Invoice Summary"
};