"use client";
import React from "react";
import TiptapEditor from "@/app/components/editor/TipTap";
import Toolbar from "@/app/components/editor/Toolbar";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { useUI } from "@/app/store/ui";
import { isBlockOfType } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";
import FeeSummary from "./FeeSummary";
import ScopeOfServices from "./ScopeOfServices";
import Deliverables from "./Deliverables";
import TermsAndConditions from "./TermsAndConditions";
import FilesAndAttachments from "./FilesAndAttachments";
import YourSection from "./YourSection";
import { debounce } from "@/app/lib/debounce";
import BubbleMenu from "../../editor/BubbleMenu";
import FloatingMenu from "../../editor/FloatingMenu";
import { ErrorBoundary } from "../../ErrorBoundary";

// --- Rich Text Block ---
const RichTextBlockComponent = ({ block }: { block: Extract<AnyDocumentBlock,{type:"rich-text"}> }) => {
  const { updateContent } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const debounced = React.useMemo(() => debounce((html: string) => {
    updateContent(block.uuid, () => ({ html }));
  }, 400), [block.uuid, updateContent]);
  return (
      <ErrorBoundary>
        <TiptapEditor
          editable={isEditing}
          initialContent={block.content.html}
          onUpdateHtml={debounced}
        >
          {(editor) => (
            isEditing ? (
              <>
                {/* <Toolbar editor={editor} /> */}
                <BubbleMenu editor={editor} />
                <FloatingMenu editor={editor} />
              </>
            ) : null
          )}
        </TiptapEditor>
      </ErrorBoundary>
  );
};
export const RichTextBlock = React.memo(RichTextBlockComponent);
RichTextBlock.displayName = 'RichTextBlock';
const TextAreaBlockComponent = ({ block }: { block: Extract<AnyDocumentBlock,{type:"text-area"}> }) => {
  const { updateContent } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const debounced = React.useMemo(() => debounce((val: string) => {
    updateContent(block.uuid, () => ({ text: val }));
  }, 300), [block.uuid, updateContent]);
  return (
    <div className="w-full">
      {isEditing ? (
        <textarea
          className="w-full min-h-[120px] p-4 text-sm leading-relaxed bg-transparent rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue={block.content.text}
          onChange={(e) => debounced(e.target.value)}
          placeholder="Enter your text here..."
        />
      ) : (
        <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[60px] text-gray-800">
          {block.content.text || "No content"}
        </div>
      )}
    </div>
  );
};

export const TextAreaBlock = React.memo(TextAreaBlockComponent);
TextAreaBlock.displayName = 'TextAreaBlock';

export function renderBlockComponent(block: AnyDocumentBlock) {
  if (isBlockOfType(block, "rich-text")) return <RichTextBlock block={block} />;
  if (isBlockOfType(block, "text-area")) return <TextAreaBlock block={block} />;
  if (isBlockOfType(block, "fee-summary")) return <FeeSummary block={block} />;
  if (isBlockOfType(block, "scope-of-services")) return <ScopeOfServices block={block} />;
  if (isBlockOfType(block, "deliverables")) return <Deliverables block={block} />;
  if (isBlockOfType(block, "terms-and-conditions")) return <TermsAndConditions block={block} />;
  if (isBlockOfType(block, "files-and-attachments")) return <FilesAndAttachments block={block} />;
  if (isBlockOfType(block, "your-section")) return <YourSection block={block} />;
  return null;
}
