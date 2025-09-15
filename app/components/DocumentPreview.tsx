"use client";
import React from "react";

import RenderHeader from "@/app/components/RenderHeader";
import DocumentControls from "@/components/DocumentControls";
import { useUI, initUI } from "../store/ui";
import RenderDocument from "./RenderDocument";

// Initialize UI defaults before first render
initUI({ isEditing: false });

export default function DocumentPreview() {
  return (
    <main className="min-h-screen flex flex-col">
      <RenderHeader />
      <RenderDocument />
    </main>
  );
}
