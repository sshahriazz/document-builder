"use client";
import React, { useEffect } from "react";
import RenderHeader from "@/app/components/RenderHeader";
import DocumentControls from "@/components/DocumentControls";
import { DocumentProvider } from "./document/DocumentProvider";
import { DocumentList } from "./document/DocumentList";
import { useHeaderContent } from "../store/header/headerContent";
import { useHeaderStyle } from "../store/themeStyle";
import { useDocumentBlocksStore } from "../store/document/documentBlocksStore";
import { type AnyDocumentBlock } from "../store/document/documentBlocks";
import { saveSnapshot } from "@/app/lib/documentPersistence";
import { useDocumentConfig } from "@/app/store/document/documentConfig";



export default function DocumentCreator() {
  const {data: headerData} = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  const docConfig = useDocumentConfig();
  // Select raw primitives for stable derivation
  const order = useDocumentBlocksStore(s => s.order);
  const byId = useDocumentBlocksStore(s => s.byId);



  useEffect(() => {
    const blocks = order.map((uuid, index) => ({ ...byId[uuid], position: index })) as AnyDocumentBlock[];
    const snapshot = {
      headerData: headerData,
      headerStyle: styleData,
      documentBlocks: blocks,
      documentConfig: {
        currency: docConfig.currency,
        defaultStructure: docConfig.defaultStructure,
        requireUpfront: docConfig.requireUpfront,
        upfrontPercent: docConfig.upfrontPercent,
        expirationDate: docConfig.expirationDate
      } as Record<string, unknown>
    };
    // persist
    if (typeof window !== 'undefined') {
      saveSnapshot(snapshot);
    }
  }, [headerData, styleData, order, byId, docConfig]);
  
  return (
    <main className="min-h-screen flex flex-row">
      <div className="flex-1 w-full p-10 max-h-screen overflow-y-auto">
        <DocumentProvider seed>
          <div className="border-t border-b border-l border-r border-gray-200">
            <RenderHeader />
          </div>
          <DocumentList />
        </DocumentProvider>
      </div>
      <DocumentControls />
    </main>
  );
}
