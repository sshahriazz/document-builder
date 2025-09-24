"use client";
import React from "react";
import { EditableText } from "@/components/Block";
import { useHeaderContent } from "@/app/store/header/headerContent";
import Emails from "./Emails";
import Addresses from "./Addresses";
import { useUI } from "@/store/ui";
import { useHeaderStyle } from "@/store/themeStyle";

export function From({ labelledById }: { labelledById?: string }) {
  const { data, setPartyField } = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  const { isEditing } = useUI();
  const from = data.from;

  return (
    <div aria-labelledby={labelledById} className="space-y-1">
      <EditableText
        style={{
          color: styleData.textColor,
        }}
        className="text-lg font-semibold leading-tight"
        value={from.name}
        onChange={(v) => setPartyField("from", "name", v)}
        editable={isEditing}
        ariaLabel="Sender name"
      />
      <div className="space-y-0.5">
        <Emails who="from" showAdd={isEditing} />
        <Addresses who="from" showAdd={isEditing} />
      </div>
    </div>
  );
}
