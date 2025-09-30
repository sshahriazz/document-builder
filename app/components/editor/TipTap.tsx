"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { debounce } from "@/app/lib/debounce";

export interface TiptapEditorProps {
  editable?: boolean; // external control of edit mode
  initialContent?: string; // optional override of starting HTML
  onReady?: () => void; // callback when editor instance is first ready
  onUpdateHtml?: (html: string) => void; // change callback
  className?: string;
  children?: (editor: Editor | null) => React.ReactNode; // render-prop for toolbars
}

// Memo-friendly wrapper. Parent should wrap with React.memo if prop churn is high.
const TiptapEditor: React.FC<TiptapEditorProps> = ({
  editable = true,
  initialContent = "<p>Hello World! 🌎️</p>",
  onReady,
  onUpdateHtml,
  className,
  children,
}) => {
  // Freeze the initial content for the lifetime of this instance to avoid re-instantiation loops.
  const frozenInitial = React.useRef(initialContent).current;
  const updateCbRef = React.useRef(onUpdateHtml);
  updateCbRef.current = onUpdateHtml;

  // Debounce content updates for performance
  const debouncedOnUpdate = React.useMemo(() => {
    if (!updateCbRef.current) return undefined as undefined | ((html: string) => void);
    return debounce((html: string) => updateCbRef.current?.(html), 200);
  }, []);
  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Highlight,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
      ],
      content: frozenInitial,
      editable,
      immediatelyRender: false,
      onUpdate({ editor }) {
        const html = editor.getHTML();
        if (debouncedOnUpdate) debouncedOnUpdate(html);
        else updateCbRef.current?.(html);
      },
      onCreate() {
        onReady?.();
      },
      editorProps: {
        attributes: {
          spellcheck: 'true',
          class: "outline-none prose prose-zinc max-w-none outline-none prose-headings:m-0 prose-p:m-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0",
          role: "textbox",
          "aria-multiline": "true",
        },
      },
    },
    []
  );

  // Efficiently toggle editability without re-instantiating editor.
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  // Keyboard UX: Tab/Shift+Tab for list indent/outdent without circular refs
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom as HTMLElement;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
          editor.chain().focus().liftListItem('listItem').run();
        } else {
          editor.chain().focus().sinkListItem('listItem').run();
        }
      }
    };
    dom.addEventListener('keydown', handler);
    return () => dom.removeEventListener('keydown', handler);
  }, [editor]);

  return (
    <div className="w-full">
      {children?.(editor)}
      <EditorContent editor={editor} className={className} />
    </div>
  );
};

export default TiptapEditor;
