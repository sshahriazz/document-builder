"use client";
import React from "react";
import { EditableText } from "./Block";
import { useHeaderContent } from "../store/headerContent";
import { useHeaderStyle } from "../store/headerStyle";
import { useUI } from "../store/ui";

export function Title() {
  const { data, set } = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  const { isEditing } = useUI();
  return (
    <EditableText
      as="h1"
      style={{
        color: styleData.titleColor,
      }}
      value={data.invoiceName}
      onChange={(v) => set("invoiceName", v)}
      editable={isEditing}
      ariaLabel="Document title"
    />
  );
}
