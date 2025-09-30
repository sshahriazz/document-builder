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
  Image01Icon,
} from '@hugeicons/core-free-icons'

export interface BubbleMenuProps {
  editor: Editor | null;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({ editor }) => {
    if (!editor) return null;
  return (
    <EBMenu
      editor={editor}
      shouldShow={({ editor, state }) => {
        // Don't show bubble menu when image is selected
        const { selection } = state;
        const { $from } = selection;
        const node = $from.node();
        
        // Check if current node or parent is an image
        if (node.type.name === 'image') return false;
        if ($from.parent.type.name === 'image') return false;
        
        // Check if selection contains an image
        const hasImage = state.doc.nodesBetween(
          selection.from,
          selection.to,
          (node) => {
            if (node.type.name === 'image') return false;
          }
        );
        
        // Show for text selections
        return !selection.empty;
      }}
      className="z-[9999] pointer-events-auto flex items-center gap-1 p-1 rounded-md border border-gray-200 bg-white/95 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-zinc-700 dark:bg-zinc-900/90"
    >
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

      <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-zinc-700" />

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

      <span className="mx-1 h-6 w-px bg-gray-200 dark:bg-zinc-700" />
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

      {/* Image */}
      <MenuButton
        text="Image"
        icon={Image01Icon}
        active={editor.isActive('image')}
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) {
            (editor as any).chain().focus().setImage({ src: url }).run();
          }
        }}
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
        text="Clear"
        icon={TextIcon}
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      />
    </EBMenu>
  )
}

export default BubbleMenu