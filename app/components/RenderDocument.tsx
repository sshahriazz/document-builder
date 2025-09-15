"use client";
import React, { useState } from "react";
import { useDocumentBlocks } from "@/app/store/documentBlocks";
// Legacy DocumentBlockView replaced by dynamic registry-based renderer
import DynamicBlockRenderer from "./blocks/registry";
import ControlWrapper from "./ControlWrapper";
import BlockPickerModal from "./BlockPickerModal";
import { useUI } from "../store/ui";

function RenderDocument() {
  const { blocks, createFromTemplate } = useDocumentBlocks();
  const [showModal, setShowModal] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const { isEditing } = useUI();

  return (
    <div className="w-[90%] mx-auto relative">
      {blocks.map((b, i) => (
        <ControlWrapper key={b.blockUID} index={i} total={blocks.length}>
          <DynamicBlockRenderer block={b} />
        </ControlWrapper>
      ))}

      {/* Final insertion zone after last block */}
      {isEditing && (
        <div className="relative py-6 flex justify-center">
          <button
            onClick={() => {
              setInsertIndex(blocks.length);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white text-xs px-3 py-1 rounded shadow hover:bg-blue-500"
          >
            + Add Block
          </button>
        </div>
      )}

      {isEditing && (
        <BlockPickerModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setInsertIndex(null);
          }}
          onSelect={(tpl) => {
            if (insertIndex != null) createFromTemplate(tpl, insertIndex);
          }}
        />
      )}
    </div>
  );
}

export default RenderDocument;
