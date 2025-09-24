"use client";
import React, { useEffect, useState } from "react";
import RenderHeader from "@/app/components/RenderHeader";
import DocumentControls from "@/components/DocumentControls";
import { DocumentProvider } from "./document/DocumentProvider";
import { DocumentList } from "./document/DocumentList";
import { useHeaderContent } from "../store/header/headerContent";
import { useHeaderStyle } from "../store/themeStyle";
import { useDocumentBlocksStore } from "../store/document/documentBlocksStore";
import { saveSnapshot } from "@/app/lib/documentPersistence";



export default function DocumentCreator() {
  const {data: headerData} = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  // Select raw primitives for stable derivation
  const order = useDocumentBlocksStore(s => s.order);
  const byId = useDocumentBlocksStore(s => s.byId);
  const [document, setDocument] = useState<Record<string, any>>({});



  console.log("header data in DocumentCreator:", document);

  useEffect(() => {
    const blocks = order.map((uuid, index) => ({ ...byId[uuid], position: index }));
    const snapshot = {
      headerData: headerData,
      headerStyle: styleData,
      documentBlocks: blocks
    };
    setDocument(snapshot);
    // persist
    if (typeof window !== 'undefined') {
      saveSnapshot(snapshot as any);
    }
  }, [headerData, styleData, order, byId]);
  
  return (
    <main className="min-h-screen flex flex-row">
      <div className="flex-1 w-full p-10 space-y-10 max-h-screen overflow-y-auto">
        <RenderHeader />
        <DocumentProvider seed>
          <DocumentList />
        </DocumentProvider>
      </div>
      <DocumentControls />
    </main>
  );
}
