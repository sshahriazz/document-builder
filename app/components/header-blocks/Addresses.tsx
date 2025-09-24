"use client";
import React from "react";
import { EditableText } from "@/components/Block";
import { useHeaderContent } from "@/app/store/header/headerContent";
import { Button } from "@heroui/react";
import { useUI } from "@/store/ui";
import { useHeaderStyle } from "@/store/themeStyle";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Delete02Icon } from "@hugeicons/core-free-icons";

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
  const { data, setAddressLine, addAddressLine, removeAddressLine } = useHeaderContent();
  const { isEditing } = useUI();
  const { data: styleData } = useHeaderStyle();
  const addresses = data[who].address;
  const labelPrefix =
    ariaLabelPrefix || (who === "from" ? "Sender" : "Recipient");

  return (
    <div aria-labelledby={labelledById} className="space-y-0.5">
      {addresses.map((line, i) => (
        <div key={`addr-${i}`} className="flex items-center gap-2 group">
          <EditableText
            value={line}
            style={{
              color: styleData.textColor,
            }}
            className="text-sm leading-relaxed opacity-90 flex-1"
            onChange={(v) => setAddressLine(who, i, v)}
            editable={isEditing}
            autoFocus={isEditing && i === addresses.length - 1 && line === ""}
            ariaLabel={`${labelPrefix} address line ${i + 1}`}
          />
          {isEditing && addresses.length > 1 && (
            <Button
              size="sm"
              isIconOnly
              variant="light"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
              onPress={() => removeAddressLine(who, i)}
              aria-label={`Remove ${labelPrefix} address line ${i + 1}`}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} color="currentColor" />
            </Button>
          )}
        </div>
      ))}
      {showAdd && isEditing && (
        <Button isIconOnly size="sm" className="mt-1 text-xs" onPress={() => addAddressLine(who)}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" />
        </Button>
      )}
    </div>
  );
}

export default Addresses;
