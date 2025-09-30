// Types only module for document block definitions
import type { CurrencyCode } from "@/app/types/currency";

// Core discriminant
export type BlockType = "rich-text" | "text-area" | "fee-summary" | "scope-of-services" | "deliverables" | "terms-and-conditions" | "files-and-attachments" | "your-section" | "image-text";

// Content per type
export interface RichTextContent { html: string }
export interface TextAreaContent { text: string }
// ----- Scope of Services -----
export interface ScopeOfServicesContent { html: string }
// ----- Deliverables -----
export interface DeliverablesContent { html: string }
// ----- Terms and Conditions -----
export interface TermsAndConditionsContent { html: string }
// ----- Files & Attachments -----
export type UploadStatus = 'pending' | 'uploading' | 'uploaded' | 'error';
export interface FileAttachmentItem {
  id: string;
  name: string;
  size: number; // bytes
  type: string; // mime
  url: string;  // object URL for now; later remote URL
  status: UploadStatus;
  progress?: number; // 0-100
  createdAt?: number;
}
export interface FilesAndAttachmentsContent {
  title?: string;
  showDescription?: boolean;
  description?: string;
  files: FileAttachmentItem[];
}
// ----- Your Section -----
export interface YourSectionContent { html: string }
// ----- Image Text -----
export interface ImageTextContent { html: string }
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
  "scope-of-services": ScopeOfServicesContent;
  "deliverables": DeliverablesContent;
  "terms-and-conditions": TermsAndConditionsContent;
  "files-and-attachments": FilesAndAttachmentsContent;
  "your-section": YourSectionContent;
  "image-text": ImageTextContent;
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
  "scope-of-services": BaseStyle;
  "deliverables": BaseStyle;
  "terms-and-conditions": BaseStyle;
  "files-and-attachments": BaseStyle;
  "your-section": BaseStyle;
  "image-text": BaseStyle;
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
