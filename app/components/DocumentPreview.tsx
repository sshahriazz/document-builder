"use client";
import React, { useEffect, useState } from "react";
import RenderHeader from "@/app/components/RenderHeader";
import { loadSnapshot } from "@/app/lib/documentPersistence";
import { useHeaderContent } from "@/app/store/header/headerContent";
import { useHeaderStyle } from "@/app/store/themeStyle";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { BlockWrapper } from "./document/BlockWrapper";
import { renderBlockComponent } from "./document/blocks";
import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";
import { initUI } from "../store/ui";
initUI({isEditing: false});

export default function DocumentPreview() {
  const setHeader = useHeaderContent(s => s.setMany);
  const setStyle = useHeaderStyle(s => s.setMany);
  const replaceBlocks = useDocumentBlocksStore(s => s.replaceAll);
  const order = useDocumentBlocksStore(s => s.order);
  const byId = useDocumentBlocksStore(s => s.byId);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const snap = loadSnapshot();
    if (snap) {
      setHeader(snap.headerData as any);
      setStyle(snap.headerStyle as any);
      replaceBlocks(snap.documentBlocks.map((b,i) => ({ ...b, position: i })) as AnyDocumentBlock[]);
    }
    setHydrated(true);
  }, [setHeader, setStyle, replaceBlocks]);

  const blocks: AnyDocumentBlock[] = React.useMemo(() => {
    return order.map((uuid, index) => ({ ...byId[uuid], position: index })) as AnyDocumentBlock[];
  }, [order, byId]);

  return (
    <main className="min-h-screen flex flex-row bg-neutral-100">
      <div className="flex-1 w-full p-10 space-y-10">
        <RenderHeader />
        {!hydrated && <div className="text-sm text-neutral-500">Loading saved document...</div>}
        {hydrated && (
          <div className="space-y-10">
            {blocks.map(b => (
              // <BlockWrapper key={b.uuid} block={b} total={blocks.length}>
              <div key={b.uuid}>

                {renderBlockComponent(b)}
              </div>

              // </BlockWrapper>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
