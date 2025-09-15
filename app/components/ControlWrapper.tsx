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
        className="absolute left-0 right-0 top-0 h-[10%] z-10"
        onMouseEnter={() => setHoverTop(true)}
        onMouseLeave={() => setHoverTop(false)}
        aria-label="Insert block above"
      >
        {hoverTop && (
          <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
            {/* guide line */}
            <div className="absolute top-0 left-0 right-0 border-t border-blue-400/60" />
            <button
              onClick={() => openPickerAt(index)}
              className="pointer-events-auto -translate-y-1/2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] rounded-full px-2 py-1 shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              +
            </button>
          </div>
        )}
      </div>

      {children}

      {/* Bottom 10% hover zone */}
      <div
        className="absolute left-0 right-0 bottom-0 h-[10%] z-10"
        onMouseEnter={() => setHoverBottom(true)}
        onMouseLeave={() => setHoverBottom(false)}
        aria-label="Insert block below"
      >
        {hoverBottom && (
          <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
            {/* guide line */}
            <div className="absolute bottom-0 left-0 right-0 border-b border-blue-400/60" />
            <button
              onClick={() => openPickerAt(index + 1)}
              className="pointer-events-auto bg-blue-600 hover:bg-blue-500 text-white text-[10px] rounded-full px-2 py-1 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 -translate-y-1/2"
            >
              +
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
