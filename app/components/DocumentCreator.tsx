"use client";
import React from "react";

import RenderTheme from "@/components/RenderTheme";
import DocumentControls from "@/components/DocumentControls";

export default function DocumentCreator() {
  return (
    <main className="min-h-screen flex flex-row bg-neutral-200/60">
      <RenderTheme />
      <DocumentControls />
    </main>
  );
}
