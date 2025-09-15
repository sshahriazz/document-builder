"use client";
import React, { useState } from "react";
import TiptapEditor from "./editor/TipTap";
import { useDocumentBlocks, DocumentBlock } from "@/app/store/documentBlocks";
import { Button } from "@heroui/react";

export interface DocumentBlockViewProps {
  block: DocumentBlock;
  index: number;
  total: number;
  onInsertAbove: () => void;
  onInsertBelow: () => void;
}

export function DocumentBlockView({
  block,
  index,
  total,
  onInsertAbove,
  onInsertBelow,
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
      {/* Top insertion zone */}
      <div
        className="absolute left-0 right-0 -top-3 h-6 flex items-center justify-center"
        onMouseEnter={() => setHover(true)}
      >
        {hover && (
          <button
            aria-label="Add block above"
            onClick={onInsertAbove}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-0.5 rounded bg-blue-500 text-white shadow"
          >
            +
          </button>
        )}
      </div>

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

      {/* Bottom insertion zone */}
      <div
        className="absolute left-0 right-0 -bottom-3 h-6 flex items-center justify-center"
        onMouseEnter={() => setHover(true)}
      >
        {hover && (
          <button
            aria-label="Add block below"
            onClick={onInsertBelow}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-2 py-0.5 rounded bg-blue-500 text-white shadow"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}

export default DocumentBlockView;
