"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { debounce } from "@/app/lib/debounce";
import { ImageExtension } from "./extentions/ImageExtention";
import "./editor-styles.css";

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
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
          paragraph: {
            HTMLAttributes: {
              class: 'text-base leading-relaxed',
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc list-outside ml-4',
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal list-outside ml-4',
            },
          },
          listItem: {
            HTMLAttributes: {
              class: 'leading-relaxed',
            },
          },
          blockquote: {
            HTMLAttributes: {
              class: 'border-l-4 border-neutral-300 pl-4 italic text-neutral-700',
            },
          },
          code: {
            HTMLAttributes: {
              class: 'bg-neutral-100 text-rose-600 px-1.5 py-0.5 rounded text-sm font-mono',
            },
          },
          codeBlock: {
            HTMLAttributes: {
              class: 'bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-sm overflow-x-auto',
            },
          },
          horizontalRule: {
            HTMLAttributes: {
              class: 'my-6 border-neutral-300',
            },
          },
        }),
        Highlight.configure({
          HTMLAttributes: {
            class: 'bg-yellow-200 text-neutral-900 px-0.5 rounded',
          },
        }),
        TextAlign.configure({ 
          types: ["heading", "paragraph"],
          alignments: ['left', 'center', 'right', 'justify'],
        }),
        ImageExtension.configure({
          inline: false,
          allowBase64: true,
        }),
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
          class: "outline-none prose prose-neutral max-w-none focus:outline-none",
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
