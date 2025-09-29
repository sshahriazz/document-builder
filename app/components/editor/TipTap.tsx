"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

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
        if (onUpdateHtml) onUpdateHtml(editor.getHTML());
      },
      onCreate() {
        onReady?.();
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

  return (
    <div className="w-full">
      {children?.(editor)}
      <EditorContent editor={editor} className={className} />
    </div>
  );
};

export default TiptapEditor;
