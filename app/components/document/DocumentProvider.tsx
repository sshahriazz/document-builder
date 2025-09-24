"use client";
import React, { useEffect } from "react";
import { seedDocumentBlocks } from "@/app/store/document/initialBlocks";

/**
 * DocumentProvider: hydrates the document blocks store on mount if empty.
 * Pass `seed` to load default starter blocks. No props are required for state.
 */
export function DocumentProvider({ seed, children }: { seed?: boolean; children: React.ReactNode }) {
  useEffect(() => {
    if (seed) seedDocumentBlocks();
  }, [seed]);
  return <div className="w-[210mm] mx-auto">{children}</div>;
}
