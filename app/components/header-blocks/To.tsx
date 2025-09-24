"use client";
import React from "react";
import { EditableText } from "@/components/Block";
import { useHeaderContent } from "@/app/store/header/headerContent";
import Emails from "./Emails";
import Addresses from "./Addresses";
import { useUI } from "@/store/ui";
import { useHeaderStyle } from "@/store/themeStyle";

export function To({ labelledById }: { labelledById?: string }) {
  const { data, setPartyField } = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  const { isEditing } = useUI();
  const to = data.to;
  return (
    <div aria-labelledby={labelledById} className="space-y-1">
      <EditableText
        style={{
          color: styleData.textColor,
        }}
        className="text-lg font-semibold leading-tight"
        value={to.name}
        onChange={(v) => setPartyField("to", "name", v)}
        editable={isEditing}
        ariaLabel="Recipient name"
      />
      <div className="space-y-0.5">
        <Emails who="to" showAdd={isEditing} />
        <Addresses who="to" showAdd={isEditing} />
      </div>
    </div>
  );
}
