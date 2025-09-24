"use client";
import React from "react";
import { useHeaderContent } from "@/app/store/header/headerContent";

export function Dates({ labelledById }: { labelledById?: string }) {
  const { data, set } = useHeaderContent();
  return (
    <div aria-labelledby={labelledById} className="flex items-center gap-4 text-xs opacity-60">
      <div className="flex items-center gap-1.5">
        <span className="font-medium uppercase tracking-wide">Sent:</span>
        <span className="font-normal">{data.sentDate}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="font-medium uppercase tracking-wide">Accepted:</span>
        <span className="font-normal">{data.acceptedDate}</span>
      </div>
    </div>
  );
}
