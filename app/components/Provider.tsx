"use client";
import { HeroUIProvider } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { useUI } from "../store/ui";
import { Button } from "@heroui/react";
import { loadAllInitialData } from "../lib/loadInitialData";

function Provider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    loadAllInitialData().finally(() => {
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <HeroUIProvider>
      <div className="relative">
        {/* Optional global toggle button for demo/testing. Can be removed or relocated. */}
        {loading ? (
          <div className="p-6 text-sm text-neutral-500">
            Loading document...
          </div>
        ) : (
          children
        )}
      </div>
    </HeroUIProvider>
  );
}

export default Provider;
