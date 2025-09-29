"use client";
import React from "react";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { renderBlockComponent } from "./blocks/blocks";
import { BlockWrapper } from "./BlockWrapper";
import { useMemo } from "react";
import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";

export function DocumentList() {
  // Select primitive / stable slices to avoid returning fresh arrays in selector (prevents Next.js getSnapshot loop warning)
  const order = useDocumentBlocksStore(s => s.order);
  const byId = useDocumentBlocksStore(s => s.byId);
  const blocks: AnyDocumentBlock[] = useMemo(() => {
    return order.map((uuid, index) => {
      const ent = byId[uuid];
      return { ...ent, position: index } as AnyDocumentBlock;
    });
  }, [order, byId]);

  return <div className="space-y-5">{blocks.map(b => (
    <BlockWrapper key={b.uuid} block={b} total={blocks.length}>
      {renderBlockComponent(b)}
    </BlockWrapper>
  ))}</div>;
}
