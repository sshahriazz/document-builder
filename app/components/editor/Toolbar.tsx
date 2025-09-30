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
import "./extentions/ImageExtention";

export interface ToolbarProps {
  editor: Editor | null;
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ editor, className }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (src) {
        editor.chain().focus().setImage({ src }).run();
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageFromUrl = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

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

      <span className="mx-1 h-6 w-px bg-gray-200" />

      {/* Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        title="Upload Image"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      <button
        onClick={handleImageFromUrl}
        className="p-1.5 rounded hover:bg-gray-100 transition-colors"
        title="Insert Image from URL"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </button>
    </div>
  );
};

export default Toolbar;