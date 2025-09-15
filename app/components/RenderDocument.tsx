"use client";
import React, { useState } from "react";
import { useDocumentBlocks } from "@/app/store/documentBlocks";
import DocumentBlockView from "./DocumentBlockView";
import ControlWrapper from "./ControlWrapper";
import BlockPickerModal from "./BlockPickerModal";

function RenderDocument() {
  const { blocks, createFromTemplate } = useDocumentBlocks();
  const [showModal, setShowModal] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  return (
    <div className="w-[90%] mx-auto relative">
      {blocks.map((b, i) => (
        <ControlWrapper key={b.blockUID} index={i} total={blocks.length}>
          <DocumentBlockView
            block={b}
            index={i}
            total={blocks.length}
            onInsertAbove={() => {
              setInsertIndex(i);
              setShowModal(true);
            }}
            onInsertBelow={() => {
              setInsertIndex(i + 1);
              setShowModal(true);
            }}
          />
        </ControlWrapper>
      ))}

      {/* Final insertion zone after last block */}
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
    </div>
  );
}

export default RenderDocument;
