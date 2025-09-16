"use client";
import React from "react";
import { useHeaderContent } from "@/app/store/header/headerContent";

export function Dates({ labelledById }: { labelledById?: string }) {
  const { data, set } = useHeaderContent();
  return (
    <div aria-labelledby={labelledById}>
      <p>sent: {data.sentDate}</p>
      <p>Accepted: {data.acceptedDate}</p>
    </div>
  );
}
