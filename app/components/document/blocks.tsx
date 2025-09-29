"use client";
import React from "react";
import TiptapEditor from "@/app/components/editor/TipTap";
import Toolbar from "@/app/components/editor/Toolbar";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { useUI } from "@/app/store/ui";
import { isBlockOfType } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";
import { debounce } from "@/app/lib/debounce";
import BubbleMenu from "../editor/BubbleMenu";
import FloatingMenu from "../editor/FloatingMenu";

// --- Rich Text Block ---
export function RichTextBlock({ block }: { block: Extract<AnyDocumentBlock,{type:"rich-text"}> }) {
  const { updateContent } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const debounced = React.useMemo(() => debounce((html: string) => {
    updateContent(block.uuid, () => ({ html }));
  }, 400), [block.uuid, updateContent]);
  return (
    <div className="prose prose-sm prose-neutral max-w-none leading-relaxed">
      <TiptapEditor
        editable={isEditing}
        initialContent={block.content.html}
        onUpdateHtml={debounced}
      >
        {(editor) => (
          isEditing ? (
            <div className="mb-2">
              <Toolbar editor={editor} />
              <BubbleMenu editor={editor}  />
              <FloatingMenu editor={editor}  />
            </div>
          ) : null
        )}
      </TiptapEditor>
    </div>
  );
}

// --- Text Area Block ---
export function TextAreaBlock({ block }: { block: Extract<AnyDocumentBlock,{type:"text-area"}> }) {
  const { updateContent } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const debounced = React.useMemo(() => debounce((val: string) => {
    updateContent(block.uuid, () => ({ text: val }));
  }, 300), [block.uuid, updateContent]);
  return (
    <div className="w-full">
      {isEditing ? (
        <textarea
          className="w-full min-h-[120px] p-4 text-sm leading-relaxed bg-transparent border border-gray-200 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          defaultValue={block.content.text}
          onChange={(e) => debounced(e.target.value)}
          placeholder="Enter your text here..."
        />
      ) : (
        <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap min-h-[60px] text-gray-800">
          {block.content.text || "No content"}
        </div>
      )}
    </div>
  );
}

// --- Invoice Summary Block ---
export function InvoiceSummaryBlock({ block }: { block: Extract<AnyDocumentBlock,{type:"invoice-summary"}> }) {
  const { updateContent, patchContent } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const { items, taxRate, currency, notes } = block.content;
  const debouncedItems = React.useRef<Record<string, ReturnType<typeof debounce>>>({});
  const ensureItemDebouncer = (id: string) => {
    if (!debouncedItems.current[id]) {
      debouncedItems.current[id] = debounce(<T extends keyof typeof items[number]>(field: T, value: any, idx: number) => {
        updateContent(block.uuid, prev => {
          const c = prev as typeof block.content;
          return { ...c, items: c.items.map((x,i)=> i===idx? { ...x, [field]: value }: x) } as any;
        });
      }, 280);
    }
    return debouncedItems.current[id];
  };
  const debouncedTax = React.useMemo(() => debounce((val:number)=> patchContent(block.uuid,{ taxRate: val }),280),[block.uuid, patchContent]);
  const debouncedNotes = React.useMemo(() => debounce((val:string)=> patchContent(block.uuid,{ notes: val }),280),[block.uuid, patchContent]);

  // Add item (immediate optimistic update)
  const handleAddItem = () => {
    const newId = `it_${Date.now().toString(36)}`;
    updateContent(block.uuid, prev => {
      const c = prev as typeof block.content;
      return { ...c, items: [...c.items, { id: newId, description: "New item", quantity: 1, unitPrice: 0 }] } as any;
    });
  };

  // Delete item (immediate update)
  const handleDeleteItem = (id: string) => {
    updateContent(block.uuid, prev => {
      const c = prev as typeof block.content;
      return { ...c, items: c.items.filter(it => it.id !== id) } as any;
    });
  };

  const subtotal = items.reduce((sum,i)=> sum + i.quantity * i.unitPrice, 0);
  const tax = subtotal * (taxRate/100);
  const total = subtotal + tax;

  return (
    <div className="space-y-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b-2 border-gray-200">
            <th className="py-3 text-xs font-semibold uppercase tracking-wider text-gray-600">Description</th>
            <th className="py-3 w-20 text-xs font-semibold uppercase tracking-wider text-gray-600">Qty</th>
            <th className="py-3 w-28 text-xs font-semibold uppercase tracking-wider text-gray-600">Unit Price</th>
            <th className="py-3 w-28 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Total</th>
            {isEditing && <th className="py-3 w-10 text-right"> </th>}
          </tr>
        </thead>
        <tbody>
          {items.map((it,idx)=> {
            const lineTotal = it.quantity * it.unitPrice;
            return (
              <tr key={it.id} className="border-b last:border-none">
                <td className="py-3">
                  {isEditing ? (
                    <input
                      className="w-full bg-transparent outline-none text-sm leading-relaxed focus:bg-gray-50 rounded px-2 py-1 border border-transparent focus:border-gray-300"
                      defaultValue={it.description}
                      onChange={(e)=> ensureItemDebouncer(it.id)("description", e.target.value, idx)}
                      placeholder="Item description"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-800">{it.description}</span>
                  )}
                </td>
                <td className="py-3">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-16 bg-transparent outline-none text-sm text-center focus:bg-gray-50 rounded px-2 py-1 border border-transparent focus:border-gray-300 tabular-nums"
                      defaultValue={it.quantity}
                      onChange={(e)=> ensureItemDebouncer(it.id)("quantity", Number(e.target.value)||0, idx)}
                      min="0"
                    />
                  ) : (
                    <span className="text-sm tabular-nums text-gray-700">{it.quantity}</span>
                  )}
                </td>
                <td className="py-3">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-24 bg-transparent outline-none text-sm focus:bg-gray-50 rounded px-2 py-1 border border-transparent focus:border-gray-300 tabular-nums"
                      defaultValue={it.unitPrice}
                      step={0.01}
                      onChange={(e)=> ensureItemDebouncer(it.id)("unitPrice", Number(e.target.value)||0, idx)}
                      min="0"
                    />
                  ) : (
                    <span className="text-sm tabular-nums text-gray-700">{currency} {it.unitPrice.toFixed(2)}</span>
                  )}
                </td>
                <td className="py-3 text-right">
                  <span className="text-sm font-medium tabular-nums text-gray-800">{currency} {lineTotal.toFixed(2)}</span>
                </td>
                {isEditing && (
                  <td className="py-3 text-right">
                    <button
                      aria-label="Delete item"
                      onClick={() => handleDeleteItem(it.id)}
                      className="text-xs px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors border border-red-200"
                    >✕</button>
                  </td>
                )}
              </tr>
            );
          })}
          {isEditing && (
            <tr>
              <td colSpan={5} className="pt-4">
                <button
                  onClick={handleAddItem}
                  className="text-sm px-4 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors border border-blue-200 font-medium"
                >+ Add Item</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex flex-col items-end space-y-3 text-sm border-t border-gray-200 pt-4">
        <div className="flex gap-12 items-center">
          <span className="text-gray-600 font-medium">Subtotal</span>
          <span className="tabular-nums font-medium text-gray-800">{currency} {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex gap-12 items-center">
          <span className="text-gray-600 font-medium">Tax</span>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <input
                type="number"
                className="w-16 bg-transparent outline-none text-right text-sm focus:bg-gray-50 rounded px-2 py-1 border border-transparent focus:border-gray-300 tabular-nums"
                defaultValue={taxRate}
                onChange={(e)=> debouncedTax(Number(e.target.value)||0)}
                min="0"
                max="100"
                step="0.1"
              />
            ) : (
              <span className="text-sm text-gray-600">({taxRate}%)</span>
            )}
            <span className="tabular-nums font-medium text-gray-800">{currency} {tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex gap-12 items-center border-t border-gray-300 pt-3">
          <span className="text-lg font-semibold text-gray-900">Total</span>
          <span className="text-lg font-bold tabular-nums text-gray-900">{currency} {total.toFixed(2)}</span>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Notes</label>
        {isEditing ? (
          <textarea
            className="w-full min-h-[80px] p-3 text-sm leading-relaxed bg-gray-50 border border-gray-200 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
            defaultValue={notes || ""}
            onChange={(e)=> debouncedNotes(e.target.value)}
            placeholder="Add any additional notes or terms..."
          />
        ) : (
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-gray-700 min-h-[40px]">
            {notes || "No additional notes"}
          </div>
        )}
      </div>
    </div>
  );
}

export function renderBlockComponent(block: AnyDocumentBlock) {
  if (isBlockOfType(block, "rich-text")) return <RichTextBlock block={block} />;
  if (isBlockOfType(block, "text-area")) return <TextAreaBlock block={block} />;
  if (isBlockOfType(block, "invoice-summary")) return <InvoiceSummaryBlock block={block} />;
  return null;
}
