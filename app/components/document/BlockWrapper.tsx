"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useUI } from "@/app/store/ui";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, cn } from "@heroui/react";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock, BlockType } from "@/app/store/document/documentBlocks";
import { createBlock, blockTypeLabels } from "@/app/store/document/blockFactory";

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
  const [topActive, setTopActive] = useState(false);
  const [bottomActive, setBottomActive] = useState(false);
  const addHoverActive = topActive || bottomActive;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [gutters, setGutters] = useState<{left:number; right:number}>({ left: 0, right: 0 });
  const [rect, setRect] = useState<{ top: number; bottom: number; left: number; width: number } | null>(null);

  useEffect(() => {
    const update = () => {
      const w = wrapperRef.current;
      const c = contentRef.current;
      if (!w || !c) return;
      const wb = w.getBoundingClientRect();
      const cb = c.getBoundingClientRect();
      const left = Math.max(0, cb.left - wb.left);
      const right = Math.max(0, wb.right - cb.right);
      setGutters({ left, right });
      setRect({ top: wb.top, bottom: wb.bottom, left: wb.left, width: wb.width });
    };
    update();
    const ro = new ResizeObserver(update);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);

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

  const performInsert = (type: BlockType) => {
    if (insertIndex == null) return;
    const newBlock = createBlock(type);
    addBlock(newBlock, insertIndex);
    onClose();
    setInsertIndex(null);
  };
  
  return (
    <div ref={wrapperRef} className="group relative z-0 overflow-visible">
      {isEditing && (
        <>
          {/* Hover trigger zones (outside the block). These do not render UI themselves but control visibility via peer-hover. */}
          <div
            className={cn(
              "peer absolute left-0 right-0 -top-[60px] h-[60px] z-10"
            )}
            aria-hidden
            onMouseEnter={() => setTopActive(true)}
            onMouseLeave={() => setTopActive(false)}
          />
          <div
            className={cn(
              "peer/btn-b absolute left-0 right-0 -bottom-[60px] h-[60px] z-10"
            )}
            aria-hidden
            onMouseEnter={() => setBottomActive(true)}
            onMouseLeave={() => setBottomActive(false)}
          />

          {/* In-wrapper overlays, positioned at block boundaries and separate from trigger strips */}
          {topActive && (
            <div
              className={cn("absolute top-0 left-0 right-0 z-[9998] transition", topActive ? "opacity-100" : "opacity-0")}
              onMouseEnter={() => setTopActive(true)}
              onMouseLeave={() => setTopActive(false)}
            >
              <div
                className="absolute flex items-center gap-2"
                style={{ left: 0, right: 0, top: 0, transform: "translateY(calc(-240% + 0.3px))" }}
              >
                <div className="h-px bg-blue-300 flex-1" />
                <button
                  aria-label="Insert block above"
                  title="Add New Section"
                  onClick={() => openInsertModalAt(block.position)}
                  className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 text-white shadow-lg ring-1 ring-blue-400/40 hover:bg-blue-600"
                >
                  +
                </button>
                <div className="h-px bg-blue-300 flex-1" />
              </div>
            </div>
          )}

          {bottomActive && (
            <div
              className={cn("absolute bottom-0 left-0 right-0 z-[9998] transition", bottomActive ? "opacity-100" : "opacity-0")}
              onMouseEnter={() => setBottomActive(true)}
              onMouseLeave={() => setBottomActive(false)}
            >
              <div
                className="absolute flex items-center gap-2"
                style={{ left: 0, right: 0, bottom: 0, transform: "translateY(calc(240% - 0.3px))" }}
              >
                <div className="h-px bg-blue-300 flex-1" />
                <button
                  aria-label="Insert block below"
                  title="Add New Section"
                  onClick={() => openInsertModalAt(block.position + 1)}
                  className="pointer-events-auto inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-500 text-white shadow-lg ring-1 ring-blue-400/40 hover:bg-blue-600"
                >
                  +
                </button>
                <div className="h-px bg-blue-300 flex-1" />
              </div>
            </div>
          )}

          {/* Right control rail: outside, shows on any hover over wrapper */}
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 -right-20 -translate-y-1/2 transition z-30 opacity-0",
              !addHoverActive && "group-hover:opacity-100"
            )}
          >
            <div
              className={cn(
                "pointer-events-auto flex flex-col items-center gap-2 rounded-xl border bg-white shadow-xl p-2",
                addHoverActive ? "pointer-events-none opacity-50" : "border-neutral-200"
              )}
            >
              <button aria-label="Section actions" className="w-7 h-7 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700">⋮</button>
              <button aria-label="Move up" onClick={handleMoveUp} disabled={block.position === 0}
                className="w-7 h-7 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 disabled:opacity-40">▲</button>
              <button aria-label="Move down" onClick={handleMoveDown} disabled={block.position === total - 1}
                className="w-7 h-7 rounded-md bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 disabled:opacity-40">▼</button>
              <button aria-label="Delete section" onClick={handleDelete}
                className="w-7 h-7 rounded-md bg-white hover:bg-red-50 border border-neutral-200 text-red-600">🗑</button>
            </div>
          </div>
        </>
      )}

      {/* The block content (no internal controls; padding outside is managed by triggers) */}
      <div ref={contentRef} className="relative z-10">{children}</div>
      {isEditing && (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
          <ModalContent>
            {(close) => (
              <>
                <ModalHeader>Select Block Type</ModalHeader>
                <ModalBody>
                  <div className="grid gap-2">
                    {Object.entries(blockTypeLabels).map(([type, label]) => (
                      <Button key={type} variant="flat" onPress={() => performInsert(type as BlockType)}>{label}</Button>
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
});

BlockWrapper.displayName = 'BlockWrapper';