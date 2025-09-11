"use client";

import React, { useEffect, useRef } from "react";

// Headless, accessible contentEditable primitive.
// No styling is applied; consumers can fully control structure and styles.
export type EditableTextProps = {
  value: string;
  onChange: (v: string) => void;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
  editable?: boolean; // controls whether content is editable
  autoFocus?: boolean; // focus on mount/update for convenience
  ariaLabel?: string;
  ariaLabelledby?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "onChange">;

export const EditableText = React.memo(function EditableText({
  value,
  onChange,
  as: Tag = "div",
  className,
  multiline = false,
  editable = true,
  autoFocus = false,
  ariaLabel,
  ariaLabelledby,
  ...rest
}: EditableTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  // Initialize content and sync only when not focused or external value diverges
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const isFocused = document.activeElement === el;
    if (!isFocused && el.innerText !== value) {
      el.innerText = value ?? "";
    }
  }, [value]);

  // Autofocus and move caret to end when requested and editable
  useEffect(() => {
    if (!editable) return;
    if (!autoFocus) return;
    const el = ref.current;
    if (!el) return;
    // Focus element
    el.focus();
    // Place caret at end
    const selection = window.getSelection?.();
    if (!selection) return;
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [autoFocus, editable]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement;
    onChange(el.innerText);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  };
  const handlePaste = (e: React.ClipboardEvent<HTMLElement>) => {
    // Paste plain text to avoid weird formatting/newlines
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand(
      "insertText",
      false,
      multiline ? text : text.replace(/\n/g, " ")
    );
  };

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      role="textbox"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-multiline={multiline || undefined}
      contentEditable={editable}
      suppressContentEditableWarning
      onInput={editable ? handleInput : undefined}
      onKeyDown={editable ? handleKeyDown : undefined}
      onPaste={editable ? handlePaste : undefined}
      className={className}
      {...rest}
    />
  );
});
// Note: Any composites built from EditableText must live in separate files
// within this folder and remain headless. This file only exports atomic blocks.
