"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";

export interface TiptapEditorProps {
  editable?: boolean; // external control of edit mode
  initialContent?: string; // optional override of starting HTML
  onReady?: () => void; // callback when editor instance is first ready
  onUpdateHtml?: (html: string) => void; // change callback
  className?: string;
}

// Memo-friendly wrapper. Parent should wrap with React.memo if prop churn is high.
const TiptapEditor: React.FC<TiptapEditorProps> = ({
  editable = true,
  initialContent = "<p>Hello World! 🌎️</p>",
  onReady,
  onUpdateHtml,
  className,
}) => {
  // Freeze the initial content for the lifetime of this instance to avoid re-instantiation loops.
  const frozenInitial = React.useRef(initialContent).current;
  const editor = useEditor(
    {
      extensions: [StarterKit],
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

  return <EditorContent editor={editor} className={className} />;
};

export default TiptapEditor;
