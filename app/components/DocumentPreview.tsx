"use client";
import React from "react";

import RenderTheme from "@/app/components/RenderHeader";
import DocumentControls from "@/components/DocumentControls";
import { useUI, initUI } from "../store/ui";

// Initialize UI defaults before first render
initUI({ isEditing: false });

export default function DocumentPreview() {
  const { isEditing } = useUI();

  return (
    <main className="min-h-screen flex flex-row">
      <RenderTheme />
    </main>
  );
}
