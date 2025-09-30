"use client";
import React from "react";
import { useUI } from "@/app/store/ui";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock, FileAttachmentItem } from "@/app/store/document/documentBlocks";
import { formatBytes } from "@/app/lib/formatBytes";

function isImage(type: string) {
  return /^image\//.test(type);
}

export default function FilesAndAttachments({ block }: { block: Extract<AnyDocumentBlock, { type: "files-and-attachments" }> }) {
  const isEditing = useUI((s) => s.isEditing);
  const { mutateContent, updateContent } = useDocumentBlocksStore();
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Cleanup object URLs on unmount
  React.useEffect(() => {
    const urls = new Set<string>();
    const arr = (block.content as any).files as (FileAttachmentItem[] | undefined);
    if (Array.isArray(arr)) {
      for (const f of arr) {
        const url = (f as any)?.url as unknown;
        if (typeof url === 'string' && url.startsWith("blob:")) urls.add(url);
      }
    }
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePickClick = () => inputRef.current?.click();

  const simulateUpload = (id: string) => {
    // Simulate an upload with progress. Later replace with real uploader.
    let p = 0;
    mutateContent(block.uuid, (draft: any) => {
      const f = draft.files.find((x: FileAttachmentItem) => x.id === id);
      if (f) {
        f.status = "uploading";
        f.progress = 0;
      }
    });
    const timer = setInterval(() => {
      p = Math.min(100, p + 7 + Math.random() * 10);
      mutateContent(block.uuid, (draft: any) => {
        const f = draft.files.find((x: FileAttachmentItem) => x.id === id);
        if (!f) return;
        f.progress = Math.floor(p);
        if (p >= 100) {
          f.status = "uploaded";
          delete f.progress;
        }
      });
      if (p >= 100) clearInterval(timer);
    }, 120);
  };

  const addFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const now = Date.now();
    const newItems: FileAttachmentItem[] = Array.from(files).map((file) => ({
      id: `${now}_${Math.random().toString(36).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      url: URL.createObjectURL(file),
      status: "pending",
      createdAt: Date.now(),
      progress: 0,
    }));
    mutateContent(block.uuid, (draft: any) => {
      draft.files.push(...newItems);
    });
    newItems.forEach((it) => simulateUpload(it.id));
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    // allow re-adding the same file by resetting input value
    e.currentTarget.value = "";
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addFiles(e.dataTransfer.files);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const removeFile = (id: string) => {
    let urlToRevoke: string | null = null;
    mutateContent(block.uuid, (draft: any) => {
      const idx = draft.files.findIndex((f: FileAttachmentItem) => f.id === id);
      if (idx !== -1) {
        const f = draft.files[idx];
        urlToRevoke = f.url;
        draft.files.splice(idx, 1);
      }
    });
    if (typeof urlToRevoke === 'string' && (urlToRevoke as string).startsWith("blob:")) URL.revokeObjectURL(urlToRevoke);
  };

  const renameFile = (id: string, name: string) => {
    mutateContent(block.uuid, (draft: any) => {
      const f = draft.files.find((x: FileAttachmentItem) => x.id === id);
      if (f) f.name = name;
    });
  };

  const content = block.content as any;

  // Title and Description handlers
  const updateTitle = (title: string) => {
    mutateContent(block.uuid, (draft: any) => {
      draft.title = title;
    });
  };

  const toggleShowDescription = (val: boolean) => {
    mutateContent(block.uuid, (draft: any) => {
      draft.showDescription = val;
      if (val && typeof draft.description !== 'string') draft.description = "";
    });
  };

  const updateDescription = (desc: string) => {
    mutateContent(block.uuid, (draft: any) => {
      draft.description = desc;
    });
  };

  return (
    <div>
      {/* Header: Title + Description controls */}
      <div className="mb-4">
        {isEditing ? (
          <input
            defaultValue={content.title ?? "Files & Attachments"}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Block title"
            className="w-full bg-transparent outline-none text-base font-semibold"
          />
        ) : (
          content.title ? (
            <h3 className="text-base font-semibold">{content.title}</h3>
          ) : null
        )}

        {isEditing && (
          <label className="mt-2 flex items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              checked={!!content.showDescription}
              onChange={(e) => toggleShowDescription(e.target.checked)}
            />
            <span>Show description</span>
          </label>
        )}

        {isEditing ? (
          content.showDescription ? (
            <textarea
              defaultValue={content.description ?? ""}
              onChange={(e) => updateDescription(e.target.value)}
              placeholder="Optional description"
              className="mt-2 w-full bg-transparent outline-none text-sm text-neutral-700 border border-neutral-200 rounded-md p-2"
              rows={3}
            />
          ) : null
        ) : content.showDescription && content.description ? (
          <p className="mt-1 text-sm text-neutral-600">{content.description}</p>
        ) : null}
      </div>
      {isEditing && (
        <div
          className="mb-4 rounded-md border border-dashed border-neutral-300 p-4 text-center text-neutral-600 hover:bg-neutral-50"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm">Drag & drop files here, or</div>
            <button
              type="button"
              onClick={handlePickClick}
              className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700"
            >
              Choose files
            </button>
            <div className="text-xs text-neutral-500">Images, PDFs, and documents supported</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={onInputChange}
          />
        </div>
      )}

      {/* List */}
      <div className="grid gap-3">
        {content.files?.length ? (
          content.files.map((f: FileAttachmentItem) => (
            <div key={f.id} className="flex items-center gap-3 rounded-md border border-neutral-200 p-3">
              {/* Preview */}
              <div className="w-16 h-16 rounded-md bg-neutral-100 flex items-center justify-center overflow-hidden">
                {isImage(f.type) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-neutral-500 text-xs">{f.type.split("/")[1] || "file"}</span>
                )}
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    defaultValue={f.name}
                    onChange={(e) => renameFile(f.id, e.target.value)}
                    className="w-full bg-transparent outline-none text-sm font-medium"
                  />
                ) : (
                  <div className="text-sm font-medium truncate">{f.name}</div>
                )}
                <div className="text-xs text-neutral-500">{formatBytes(f.size)} • {f.status}
                  {typeof f.progress === 'number' && (
                    <span className="ml-2">{f.progress}%</span>
                  )}
                </div>

                {f.status === 'uploading' && (
                  <div className="h-1 mt-2 rounded bg-neutral-200 overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${f.progress ?? 0}%` }} />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <a
                  href={f.url}
                  download={f.name}
                  className="text-sm px-2 py-1 rounded border border-neutral-200 hover:bg-neutral-50"
                >
                  Download
                </a>
                {isEditing && (
                  <button
                    onClick={() => removeFile(f.id)}
                    className="text-sm px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-sm text-neutral-500">{isEditing ? "No files yet. Add some above." : "No files attached."}</div>
        )}
      </div>
    </div>
  );
}
