"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import MenuButton from "./MenuButton";
import {
  TextBoldIcon,
  TextItalicIcon,
  TextStrikethroughIcon,
  TextColorIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyCenterIcon,
  TextIcon,
  TextFontIcon,
} from '@hugeicons/core-free-icons';

export interface ToolbarProps {
  editor: Editor | null;
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, className }) => {
  // Rerender toolbar on selection/transaction so active states update live
  const [, setVersion] = React.useState(0);
  React.useEffect(() => {
    if (!editor) return;
    const bump = () => setVersion((v) => (v + 1) % 1000);
    editor.on("selectionUpdate", bump);
    editor.on("transaction", bump);
    editor.on("update", bump);
    return () => {
      editor.off("selectionUpdate", bump);
      editor.off("transaction", bump);
      editor.off("update", bump);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1 p-1 border border-gray-200 rounded-md bg-white ${className ?? ""}`}>
      {/* Headings */}
      <MenuButton
        text="Heading 1"
        icon={TextFontIcon}
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <MenuButton
        text="Heading 2"
        icon={TextFontIcon}
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <MenuButton
        text="Heading 3"
        icon={TextFontIcon}
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <MenuButton
        text="Paragraph"
        icon={TextIcon}
        active={editor.isActive("paragraph")}
        onClick={() => editor.chain().focus().setParagraph().run()}
      />

      <span className="mx-1 h-6 w-px bg-gray-200" />

      {/* Marks */}
      <MenuButton
        text="Bold"
        icon={TextBoldIcon}
        active={editor.isActive("bold")}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <MenuButton
        text="Italic"
        icon={TextItalicIcon}
        active={editor.isActive("italic")}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <MenuButton
        text="Strike"
        icon={TextStrikethroughIcon}
        active={editor.isActive("strike")}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <MenuButton
        text="Highlight"
        icon={TextColorIcon}
        active={editor.isActive("highlight")}
        onClick={() => (editor as any).chain().focus().toggleHighlight().run()}
      />

      <span className="mx-1 h-6 w-px bg-gray-200" />

      {/* Alignment */}
      <MenuButton
        text="Align Left"
        icon={TextAlignLeftIcon}
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => (editor as any).chain().focus().setTextAlign("left").run()}
      />
      <MenuButton
        text="Align Center"
        icon={TextAlignCenterIcon}
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => (editor as any).chain().focus().setTextAlign("center").run()}
      />
      <MenuButton
        text="Align Right"
        icon={TextAlignRightIcon}
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => (editor as any).chain().focus().setTextAlign("right").run()}
      />
      <MenuButton
        text="Justify"
        icon={TextAlignJustifyCenterIcon}
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => (editor as any).chain().focus().setTextAlign("justify").run()}
      />

      <span className="mx-1 h-6 w-px bg-gray-200" />

      {/* Lists */}
      <MenuButton
        text="Bullet List"
        icon={TextIcon}
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <MenuButton
        text="Ordered List"
        icon={TextIcon}
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />

      {/* Blockquote & Code */}
      <MenuButton
        text="Blockquote"
        icon={TextIcon}
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <MenuButton
        text="Code Block"
        icon={TextIcon}
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <span className="mx-1 h-6 w-px bg-gray-200" />

      {/* Undo/Redo */}
      <MenuButton
        text="Undo"
        icon={TextIcon}
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <MenuButton
        text="Redo"
        icon={TextIcon}
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      />

      <span className="mx-1 h-6 w-px bg-gray-200" />

      {/* Clear formatting */}
      <MenuButton
        text="Clear Formatting"
        icon={TextIcon}
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      />
    </div>
  );
};

export default Toolbar;