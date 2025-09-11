"use client";
import React from "react";
import { EditableText } from "./Block";
import { useHeaderContent } from "../store/headerContent";
import Emails from "./Emails";
import Addresses from "./Addresses";
import { useUI } from "../store/ui";
import { useHeaderStyle } from "../store/headerStyle";

export function To({ labelledById }: { labelledById?: string }) {
  const { data, setPartyField } = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  const { isEditing } = useUI();
  const to = data.to;
  return (
    <div aria-labelledby={labelledById}>
      <EditableText
        style={{
          color: styleData.textColor,
        }}
        value={to.name}
        onChange={(v) => setPartyField("to", "name", v)}
        editable={isEditing}
        ariaLabel="Recipient name"
      />
      <Emails who="to" showAdd={isEditing} />
      <Addresses who="to" showAdd={isEditing} />
    </div>
  );
}
