"use client";
import React from "react";
import { EditableText } from "./Block";
import { useHeaderContent } from "../store/headerContent";
import { Button } from "@heroui/react";
import { useUI } from "../store/ui";
import { useHeaderStyle } from "../store/themeStyle";

type Who = "from" | "to";

export function Addresses({
  who,
  labelledById,
  ariaLabelPrefix = "",
  showAdd = true,
}: {
  who: Who;
  labelledById?: string;
  ariaLabelPrefix?: string;
  showAdd?: boolean;
}) {
  const { data, setAddressLine, addAddressLine } = useHeaderContent();
  const { isEditing } = useUI();
  const { data: styleData } = useHeaderStyle();
  const addresses = data[who].address;
  const labelPrefix =
    ariaLabelPrefix || (who === "from" ? "Sender" : "Recipient");

  return (
    <div aria-labelledby={labelledById}>
      {addresses.map((line, i) => (
        <EditableText
          key={`addr-${i}`}
          value={line}
          style={{
            color: styleData.textColor,
          }}
          onChange={(v) => setAddressLine(who, i, v)}
          editable={isEditing}
          autoFocus={isEditing && i === addresses.length - 1 && line === ""}
          ariaLabel={`${labelPrefix} address line ${i + 1}`}
        />
      ))}
      {showAdd && isEditing && (
        <Button className="" onPress={() => addAddressLine(who)}>
          +
        </Button>
      )}
    </div>
  );
}

export default Addresses;
