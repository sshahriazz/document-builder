"use client";
import React from "react";

import RenderHeader from "@/app/components/RenderHeader";
import DocumentControls from "@/components/DocumentControls";
import RenderDocument from "@/components/RenderDocument";

export default function DocumentCreator() {
  return (
    <main className="min-h-screen flex flex-row bg-neutral-200/60">
      <div className="flex-1 w-full">
        <RenderHeader />
        <RenderDocument />
      </div>

      <DocumentControls />
    </main>
  );
}
