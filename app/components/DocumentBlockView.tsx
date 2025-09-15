"use client";
import React, { useState } from "react";
import TiptapEditor from "./editor/TipTap";
import { useDocumentBlocks, DocumentBlock } from "@/app/store/documentBlocks";
import { Button } from "@heroui/react";

export interface DocumentBlockViewProps {
  block: DocumentBlock;
  index: number;
  total: number;
}

export function DocumentBlockView({
  block,
  index,
  total,
}: DocumentBlockViewProps) {
  const { renameBlock, setBlockContent, removeBlock, moveBlock } =
    useDocumentBlocks();
  const [hover, setHover] = useState(false);

  return (
    <div
      className="group relative border-b border-neutral-200 py-10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Block controls */}
      {hover && (
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => moveBlock(block.blockUID, index - 1)}
            disabled={index === 0}
          >
            ↑
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => moveBlock(block.blockUID, index + 1)}
            disabled={index === total - 1}
          >
            ↓
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            onPress={() => removeBlock(block.blockUID)}
          >
            🗑
          </Button>
        </div>
      )}

      {/* Editor */}
      <TiptapEditor
        initialContent={block.content}
        onUpdateHtml={(html) => setBlockContent(block.blockUID, html)}
        editable={true}
        className="prose max-w-none"
      />
    </div>
  );
}

export default DocumentBlockView;
