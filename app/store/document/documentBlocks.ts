// Types only module for document block definitions
import type { CurrencyCode } from "@/app/types/currency";

// Core discriminant
export type BlockType = "rich-text" | "text-area" | "fee-summary";

// Content per type
export interface RichTextContent { html: string }
export interface TextAreaContent { text: string }
// ----- Fee Summary (Packages / Multi-select) -----
export type FeeStructure = 'single' | 'packages' | 'multi-select';
export interface FeeLineItem {
  id: string;
  name: string;
  description?: string;
  qty: number;
  unitPrice: number;
}
export interface FeeOption {
  id: string;
  summary: string; // rich HTML
  items: FeeLineItem[];
  taxRate: number;   // percent
  currency: CurrencyCode;
  selected?: boolean; // relevant for packages/multi-select
}
export interface FeeSummaryContent {
  structure: FeeStructure;
  options: FeeOption[];
  currency: CurrencyCode; // default/inherited
  taxRate: number;  // default/inherited
}
export type BlockContentMap = {
  "rich-text": RichTextContent;
  "text-area": TextAreaContent;
  "fee-summary": FeeSummaryContent;
};
export type AnyBlockContent = BlockContentMap[BlockType];

// Style per type
export interface BaseStyle { marginTop?: number; marginBottom?: number }
export interface RichTextStyle extends BaseStyle { fontSize?: number }
export interface TextAreaStyle extends BaseStyle { monospace?: boolean }
export type BlockStyleMap = {
  "rich-text": RichTextStyle;
  "text-area": TextAreaStyle;
  "fee-summary": BaseStyle;
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
