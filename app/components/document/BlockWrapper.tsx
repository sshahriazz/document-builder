"use client";
import React, { useState, useCallback } from "react";
import { useUI } from "@/app/store/ui";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";
import { createBlock, blockTypeLabels } from "@/app/store/document/blockFactory";

interface BlockWrapperProps {
  block: AnyDocumentBlock;
  children: React.ReactNode;
  total: number;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({ block, children, total }) => {
  const { moveBlock, removeBlock, insertAfter, addBlock } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const handleMoveUp = useCallback(() => {
    if (block.position <= 0) return;
    moveBlock(block.uuid, block.position - 1);
  }, [block.position, block.uuid, moveBlock]);

  const handleMoveDown = useCallback(() => {
    if (block.position >= total - 1) return;
    moveBlock(block.uuid, block.position + 1);
  }, [block.position, block.uuid, total, moveBlock]);

  const handleDelete = useCallback(() => {
    removeBlock(block.uuid);
  }, [block.uuid, removeBlock]);

  const openInsertModalAt = (position: number) => {
    setInsertIndex(position);
    onOpen();
  };

  const performInsert = (type: keyof typeof blockTypeLabels) => {
    if (insertIndex == null) return;
    const newBlock = createBlock(type as any);
    addBlock(newBlock, insertIndex);
    onClose();
    setInsertIndex(null);
  };

  return (
    <div className="group relative z-0">
      {/* Insert button top */}
      {isEditing && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition z-20 pointer-events-none" >
          <button
            aria-label="Insert block above"
            onClick={() => openInsertModalAt(block.position)}
            className="pointer-events-auto text-xs px-2 py-1 rounded bg-neutral-200 hover:bg-neutral-300 shadow border border-neutral-300"
          >+ Insert</button>
        </div>
      )}
      {/* Right side controls */}
      {isEditing && (
        <div className="absolute top-2 -right-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition z-30 pointer-events-none">
          <button
            onClick={handleMoveUp}
            disabled={block.position === 0}
            className="pointer-events-auto px-2 py-1 text-xs rounded bg-white border shadow disabled:opacity-40"
            aria-label="Move block up"
          >↑</button>
          <button
            onClick={handleMoveDown}
            disabled={block.position === total - 1}
            className="pointer-events-auto px-2 py-1 text-xs rounded bg-white border shadow disabled:opacity-40"
            aria-label="Move block down"
          >↓</button>
          <button
            onClick={handleDelete}
            className="pointer-events-auto px-2 py-1 text-xs rounded bg-red-600 text-white shadow"
            aria-label="Delete block"
          >✕</button>
        </div>
      )}
      {/* The block content */}
      <div className="relative z-10">{children}</div>
      {/* Insert button bottom */}
      {isEditing && (
        <div className="absolute -bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition z-20 pointer-events-none" >
          <button
            aria-label="Insert block below"
            onClick={() => openInsertModalAt(block.position + 1)}
            className="pointer-events-auto text-xs px-2 py-1 rounded bg-neutral-200 hover:bg-neutral-300 shadow border border-neutral-300"
          >+ Insert</button>
        </div>
      )}
      {isEditing && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
          <ModalContent>
            {(close) => (
              <>
                <ModalHeader>Select Block Type</ModalHeader>
                <ModalBody>
                  <div className="grid gap-2">
                    {Object.entries(blockTypeLabels).map(([type, label]) => (
                      <Button key={type} variant="flat" onPress={() => performInsert(type as any)}>{label}</Button>
                    ))}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={close}>Cancel</Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};