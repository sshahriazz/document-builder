"use client";
import { HeroUIProvider } from "@heroui/react";
import React from "react";
import { useUI } from "../store/ui";
import { Button } from "@heroui/react";

function Provider({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <div className="relative">
        {/* Optional global toggle button for demo/testing. Can be removed or relocated. */}

        {children}
      </div>
    </HeroUIProvider>
  );
}

export default Provider;
