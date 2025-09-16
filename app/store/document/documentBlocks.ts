// Types only module for document block definitions

// Core discriminant
export type BlockType = "rich-text" | "text-area" | "invoice-summary";

// Content per type
export interface RichTextContent { html: string }
export interface TextAreaContent { text: string }
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}
export interface InvoiceSummaryContent {
  items: InvoiceItem[];
  taxRate: number;
  currency: string;
  notes?: string;
}
export type BlockContentMap = {
  "rich-text": RichTextContent;
  "text-area": TextAreaContent;
  "invoice-summary": InvoiceSummaryContent;
};
export type AnyBlockContent = BlockContentMap[BlockType];

// Style per type
export interface BaseStyle { marginTop?: number; marginBottom?: number }
export interface RichTextStyle extends BaseStyle { fontSize?: number }
export interface TextAreaStyle extends BaseStyle { monospace?: boolean }
export interface InvoiceSummaryStyle extends BaseStyle { compact?: boolean }
export type BlockStyleMap = {
  "rich-text": RichTextStyle;
  "text-area": TextAreaStyle;
  "invoice-summary": InvoiceSummaryStyle;
};
export type AnyBlockStyle = BlockStyleMap[BlockType];

// Block entity
export interface DocumentBlock<T extends BlockType> {
  uuid: string;
  type: T;
  content: BlockContentMap[T];
  style?: BlockStyleMap[T];
  position: number;
}
export type AnyDocumentBlock = { [K in BlockType]: DocumentBlock<K> }[BlockType];
