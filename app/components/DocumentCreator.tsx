"use client";
import React from "react";

import RenderHeader from "@/components/RenderHeader";
import DocumentControls from "@/components/DocumentControls";

export default function DocumentCreator() {
  return (
    <main className="min-h-screen flex flex-row bg-neutral-200/60">
      <RenderHeader />
      <DocumentControls />
    </main>
  );
}
