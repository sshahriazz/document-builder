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

export function Emails({
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
  const { data, setEmail, addEmail, removeEmail } = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  const { isEditing } = useUI();
  const emails = data[who].email;

  const labelPrefix =
    ariaLabelPrefix || (who === "from" ? "Sender" : "Recipient");

  return (
    <div aria-labelledby={labelledById} className="space-y-0.5">
      {emails.map((email, i) => (
        <div key={`email-${i}`} className="flex items-center gap-2 group">
          <EditableText
            style={{
              color: styleData.textColor,
            }}
            className="text-sm leading-relaxed opacity-90 flex-1"
            value={email}
            onChange={(v) => setEmail(who, i, v.replace(/\n/g, ""))}
            editable={isEditing}
            autoFocus={isEditing && i === emails.length - 1 && email === ""}
            ariaLabel={`${labelPrefix} email ${i + 1}`}
            multiline={false}
          />
          {isEditing && emails.length > 1 && (
            <Button
              size="sm"
              isIconOnly
              variant="light"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
              onPress={() => removeEmail(who, i)}
              aria-label={`Remove ${labelPrefix} email ${i + 1}`}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} color="currentColor" />
            </Button>
          )}
        </div>
      ))}
      {showAdd && isEditing && (
        <Button size="sm" isIconOnly className="mt-1 text-xs" onPress={() => addEmail(who)}>
          <HugeiconsIcon icon={PlusSignIcon} size={16} color="currentColor" />
        </Button>
      )}
    </div>
  );
}

export default Emails;
