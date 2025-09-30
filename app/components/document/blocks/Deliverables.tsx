"use client";
import React from "react";
import TiptapEditor from "@/app/components/editor/TipTap";
import { useUI } from "@/app/store/ui";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";
import { debounce } from "@/app/lib/debounce";
import BubbleMenu from "../../editor/BubbleMenu";
import FloatingMenu from "../../editor/FloatingMenu";
import { ErrorBoundary } from "../../ErrorBoundary";

export default function Deliverables({ block }: { block: Extract<AnyDocumentBlock, { type: "deliverables" }> }) {
  const isEditing = useUI(s => s.isEditing);
  const { updateContent } = useDocumentBlocksStore();
  const debounced = React.useMemo(() => debounce((html: string) => {
    updateContent(block.uuid, () => ({ html } as any));
  }, 300), [block.uuid, updateContent]);

  return (
      <ErrorBoundary>
        <TiptapEditor
          editable={isEditing}
          initialContent={(block.content as any).html || ""}
          onUpdateHtml={debounced}
        >
          {(editor) => (
            isEditing ? (
              <>
                <BubbleMenu editor={editor} />
                <FloatingMenu editor={editor} />
              </>
            ) : null
          )}
        </TiptapEditor>
      </ErrorBoundary>
  );
}
