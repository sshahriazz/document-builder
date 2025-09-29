import React from 'react'
import {BubbleMenu as EBMenu} from '@tiptap/react/menus'
import {type Editor} from '@tiptap/react'

import MenuButton from './MenuButton'
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
} from '@hugeicons/core-free-icons'

export interface BubbleMenuProps {
  editor: Editor | null;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor }) => {
    if (!editor) return null;
  return (
    <EBMenu editor={editor}  className="z-50">
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
    </EBMenu>
  )
}

export default BubbleMenu