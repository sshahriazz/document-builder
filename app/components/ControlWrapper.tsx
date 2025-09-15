"use client";
import React, { useState } from "react";
import BlockPickerModal from "./BlockPickerModal";
import { useDocumentBlocks } from "@/app/store/documentBlocks";

export interface ControlWrapperProps {
  index: number; // position where this wrapper sits among blocks
  total: number; // total blocks
  children: React.ReactNode;
}

const ControlWrapper = ({ index, total, children }: ControlWrapperProps) => {
  const { createFromTemplate } = useDocumentBlocks();
  const [showModal, setShowModal] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [hoverTop, setHoverTop] = useState(false);
  const [hoverBottom, setHoverBottom] = useState(false);

  const openPickerAt = (insertionIndex: number) => {
    setPendingIndex(insertionIndex);
    setShowModal(true);
  };

  const handleSelect = (tpl: string) => {
    if (pendingIndex == null) return;
    createFromTemplate(tpl, pendingIndex);
    setPendingIndex(null);
  };

  return (
    <div className="relative">
      {/* Top 10% hover zone */}
      <div
        className="absolute left-0 right-0 top-0 h-[10%]"
        onMouseEnter={() => setHoverTop(true)}
        onMouseLeave={() => setHoverTop(false)}
      >
        {hoverTop && (
          <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
            <button
              onClick={() => openPickerAt(index)}
              className="pointer-events-auto -translate-y-1/2 bg-blue-500 text-white text-xs rounded px-2 py-1 shadow"
            >
              + Add Block
            </button>
          </div>
        )}
      </div>

      {children}

      {/* Bottom 10% hover zone */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[10%]"
        onMouseEnter={() => setHoverBottom(true)}
        onMouseLeave={() => setHoverBottom(false)}
      >
        {hoverBottom && (
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
            <button
              onClick={() => openPickerAt(index + 1)}
              className="pointer-events-auto translate-y-1/2 bg-blue-500 text-white text-xs rounded px-2 py-1 shadow"
            >
              + Add Block
            </button>
          </div>
        )}
      </div>
      <BlockPickerModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setPendingIndex(null);
        }}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default ControlWrapper;
