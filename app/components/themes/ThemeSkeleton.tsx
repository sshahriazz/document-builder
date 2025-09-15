"use client";
import React from "react";

// A lightweight skeleton that matches the theme preview layout to avoid CLS
export default function ThemeSkeleton() {
  return (
    <div className="headerPreview w-[90%] relative mx-auto my-10 border border-neutral-300 min-h-[500px]">
      <div className="absolute top-4 right-4 z-10 h-8 w-40 bg-neutral-200/70 rounded animate-pulse" />
      <div className="w-[70%] mx-auto mt-20">
        <div className="space-y-6 animate-pulse">
          <div className="h-10 bg-neutral-200 rounded" />
          <div className="h-6 w-1/2 bg-neutral-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-3">
              <div className="h-3 w-16 bg-neutral-200 rounded" />
              <div className="h-20 bg-neutral-200 rounded" />
            </div>
            <div className="space-y-3">
              <div className="h-3 w-12 bg-neutral-200 rounded" />
              <div className="h-20 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
