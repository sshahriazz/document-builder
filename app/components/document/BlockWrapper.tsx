"use client";
import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useUI } from "@/app/store/ui";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, cn } from "@heroui/react";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock, BlockType } from "@/app/store/document/documentBlocks";
import { createBlock, blockTypeLabels } from "@/app/store/document/blockFactory";
import { BlockGridSelector } from "./BlockGridSelector";

interface BlockWrapperProps {
  block: AnyDocumentBlock;
  children: React.ReactNode;
  total: number;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = React.memo(({ block, children, total }) => {
  const { moveBlock, removeBlock, addBlock } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [activeZone, setActiveZone] = useState<'top' | 'bottom' | null>(null);
  // Constants for better maintainability
  const PADDING_SIZE = 60;
  const CONTROL_RAIL_OFFSET = 64;
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const openInsertModalAt = useCallback((position: number) => {
    setInsertIndex(position);
    onOpen();
  }, [onOpen]);

  const handleSectionActions = useCallback(() => {
    // TODO: Implement section actions menu
    console.log('Section actions clicked');
  }, []);

  const performInsert = useCallback((type: BlockType) => {
    if (insertIndex == null) return;
    const newBlock = createBlock(type);
    addBlock(newBlock, insertIndex);
    onClose();
    setInsertIndex(null);
    setActiveZone(null); // Clear active zone after insert
  }, [insertIndex, addBlock, onClose]);

  // Simplified unified hover area that includes both detection and button
  const HoverArea = useMemo(() => {
    const Component = ({ 
      position, 
      isActive, 
      onClick,
      verticalOffset = 0 
    }: {
      position: 'top' | 'bottom';
      isActive: boolean;
      onClick: () => void;
      verticalOffset?: number;
    }) => (
      <div
        className={cn(
          "absolute inset-x-0 h-[52px] z-20 transition-colors duration-200", // Larger hover area to include button space
          position === 'top' ? 'top-2' : 'bottom-2'
          
        )}
        onMouseEnter={() => setActiveZone(position)}
        onMouseLeave={() => setActiveZone(null)}
        // style={{
        //   transform: `translateY(${position === 'top' ? -10 : 10}px)` // Extend beyond padding
        // }}
      >
        {isActive && (
          <div 
            className="absolute top-2 inset-x-0 flex items-center justify-center"
            style={{
              top: position === 'top' ? '10px' : 'auto',
              bottom: position === 'bottom' ? '10px' : 'auto',
              transform: `translateY(${verticalOffset}px)`
            }}
          >
            <div className="flex items-center gap-2 w-full px-4">
              <div className="h-px bg-blue-300 flex-1" />
              <button
                aria-label={`Insert block ${position === 'top' ? 'above' : 'below'}`}
                title="Add New Section"
                onClick={onClick}
                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 text-white shadow-lg ring-1 ring-blue-400/40 hover:bg-blue-600 transition-colors"
              >
                +
              </button>
              <div className="h-px bg-blue-300 flex-1" />
            </div>
          </div>
        )}
      </div>
    );
    Component.displayName = 'HoverArea';
    return Component;
  }, []);
  
  return (
    <div ref={wrapperRef} className="group relative py-[60px] px-[60px]">
      {isEditing && (
        <>
          {/* 
            SIMPLIFIED HOVER ARCHITECTURE:
            Single unified hover areas that include both detection and button rendering
            No complex state management, debouncing, or z-index conflicts
          */}
          
          {/* Unified hover areas - detection + button in one component */}
          <HoverArea
            position="top"
            isActive={activeZone === 'top'}
            onClick={() => openInsertModalAt(block.position)}
            verticalOffset={-34.5} // Fine-tune button position
          />
          <HoverArea
            position="bottom"
            isActive={activeZone === 'bottom'}
            onClick={() => openInsertModalAt(block.position + 1)}
            verticalOffset={34.5} // Fine-tune button position
          />

          {/* Right control rail - positioned outside the padding area */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 -right-16 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-40",
              activeZone && "opacity-50 pointer-events-none"
            )}
          >
            <div className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white shadow-xl p-2">

              <button 
                aria-label="Move up" 
                onClick={handleMoveUp} 
                disabled={block.position === 0}
                className="w-7 h-7 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 disabled:opacity-40 transition-colors"
              >
                ▲
              </button>
              <button 
                aria-label="Move down" 
                onClick={handleMoveDown} 
                disabled={block.position === total - 1}
                className="w-7 h-7 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 disabled:opacity-40 transition-colors"
              >
                ▼
              </button>
              <button 
                aria-label="Delete section" 
                onClick={handleDelete}
                className="w-7 h-7 rounded-md bg-white hover:bg-red-50 border border-neutral-200 text-red-600 transition-colors"
              >
                🗑
              </button>
            </div>
          </div>
        </>
      )}

      {/* The block content */}
      <div ref={contentRef} className="relative z-10">{children}</div>
      {isEditing && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl" scrollBehavior="inside">
          <ModalContent>
            {(close) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-xl font-semibold">Select Block Type</h2>
                  <p className="text-sm text-neutral-500 font-normal">Choose a block to add to your document</p>
                </ModalHeader>
                <ModalBody className="py-6">
                  <BlockGridSelector onSelectBlock={performInsert} />
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
});

BlockWrapper.displayName = 'BlockWrapper';