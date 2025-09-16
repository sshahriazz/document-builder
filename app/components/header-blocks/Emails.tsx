"use client";
import React from "react";
import { EditableText } from "@/components/Block";
import { useHeaderContent } from "@/app/store/header/headerContent";
import { Button } from "@heroui/react";
import { useUI } from "@/store/ui";
import { useHeaderStyle } from "@/store/themeStyle";

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
  const { data, setEmail, addEmail } = useHeaderContent();
  const { data: styleData } = useHeaderStyle();
  const { isEditing } = useUI();
  const emails = data[who].email;

  const labelPrefix =
    ariaLabelPrefix || (who === "from" ? "Sender" : "Recipient");

  return (
    <div aria-labelledby={labelledById}>
      {emails.map((email, i) => (
        <EditableText
          style={{
            color: styleData.textColor,
          }}
          key={`email-${i}`}
          value={email}
          onChange={(v) => setEmail(who, i, v.replace(/\n/g, ""))}
          editable={isEditing}
          autoFocus={isEditing && i === emails.length - 1 && email === ""}
          ariaLabel={`${labelPrefix} email ${i + 1}`}
          multiline={false}
        />
      ))}
      {showAdd && isEditing && (
        <Button className="" onPress={() => addEmail(who)}>
          +
        </Button>
      )}
    </div>
  );
}

export default Emails;
