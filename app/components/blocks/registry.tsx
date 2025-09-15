"use client";
import React, { Suspense } from "react";
import { DocumentBlock } from "@/app/store/documentBlocks";
import TiptapEditor from "../editor/TipTap";
import { useBlockData } from "@/app/store/blockData";
import { useUI } from "@/app/store/ui";
import { useDocumentBlocks } from "@/app/store/documentBlocks";
import { Button } from "@heroui/react";

// Contract each block renderer must satisfy
export interface BlockRendererProps<T extends DocumentBlock = DocumentBlock> {
  block: T;
}

// Rich text inline component (no lazy needed, already imported early elsewhere)
function RichTextRenderer({ block }: BlockRendererProps) {
  const data = useBlockData((s) => s.getData(block.blockUID));
  const update = useBlockData((s) => s.updateData);
  const { isEditing } = useUI();
  const html = (data as any)?.html || "<p></p>";
  return (
    <TiptapEditor
      initialContent={html}
      onUpdateHtml={(newHtml) =>
        update(block.blockUID, block.kind as any, { html: newHtml })
      }
      editable={isEditing}
      className="prose max-w-none"
    />
  );
}

// Lazy load invoice summary (heavier / future charts etc)
const InvoiceSummaryRenderer = React.lazy(() =>
  import("@/app/components/blocks/InvoiceSummaryRenderer").then((m) => ({
    default: m.default,
  }))
);

export type BlockRegistryEntry = {
  kind: string;
  label: string;
  component: React.ComponentType<BlockRendererProps<any>>; // runtime generic
};

const registryArray: BlockRegistryEntry[] = [
  { kind: "rich-text", label: "Rich Text", component: RichTextRenderer }, // generic fallback
  { kind: "overview", label: "Overview", component: RichTextRenderer },
  { kind: "scope", label: "Scope", component: RichTextRenderer },
  { kind: "deliverables", label: "Deliverables", component: RichTextRenderer },
  { kind: "timeline", label: "Timeline", component: RichTextRenderer },
  {
    kind: "invoice-summary",
    label: "Invoice Summary",
    component: InvoiceSummaryRenderer,
  },
];

const registryMap: Record<string, BlockRegistryEntry> = registryArray.reduce(
  (acc, e) => {
    acc[e.kind] = e;
    return acc;
  },
  {} as Record<string, BlockRegistryEntry>
);

export function resolveBlockRenderer(
  block: DocumentBlock
): BlockRegistryEntry | undefined {
  return registryMap[block.kind];
}

export function DynamicBlockRenderer({ block }: { block: DocumentBlock }) {
  // If block.kind missing (legacy data) treat as rich-text
  const effectiveKind = (block as any).kind || "rich-text";
  const entry = resolveBlockRenderer({
    ...block,
    kind: effectiveKind,
  } as DocumentBlock);
  if (!entry) {
    return (
      <div className="border border-amber-300 bg-amber-50 text-amber-800 p-4 rounded text-sm">
        Unknown block kind <code>{String((block as any).kind)}</code>
      </div>
    );
  }
  const Comp = entry.component;
  return (
    <BlockChrome block={block}>
      <Suspense
        fallback={<div className="text-sm text-neutral-500">Loading…</div>}
      >
        <Comp block={block as any} />
      </Suspense>
    </BlockChrome>
  );
}

// Chrome wrapper with move/delete controls when editing & hovered
function BlockChrome({
  block,
  children,
}: {
  block: DocumentBlock;
  children: React.ReactNode;
}) {
  const { isEditing } = useUI();
  const { blocks, moveBlock, removeBlock } = useDocumentBlocks();
  const index = blocks.findIndex((b) => b.blockUID === block.blockUID);
  const total = blocks.length;
  const [hover, setHover] = React.useState(false);

  return (
    <div
      className="group relative border-b border-neutral-200 py-10"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {isEditing && hover && (
        <div className="absolute right-2 top-2 flex gap-1 z-20">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => moveBlock(block.blockUID, index - 1)}
            disabled={index === 0}
          >
            ↑
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={() => moveBlock(block.blockUID, index + 1)}
            disabled={index === total - 1}
          >
            ↓
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="danger"
            onPress={() => removeBlock(block.blockUID)}
          >
            🗑
          </Button>
        </div>
      )}
      {children}
    </div>
  );
}

export default DynamicBlockRenderer;
