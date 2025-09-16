"use client";
import React from "react";
import TiptapEditor from "@/app/components/editor/TipTap";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { useUI } from "@/app/store/ui";
import { isBlockOfType } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock } from "@/app/store/document/documentBlocks";
import { debounce } from "@/app/lib/debounce";

// --- Rich Text Block ---
export function RichTextBlock({ block }: { block: Extract<AnyDocumentBlock,{type:"rich-text"}> }) {
  const { updateContent } = useDocumentBlocksStore();
  const isEditing = useUI(s => s.isEditing);
  const debounced = React.useMemo(() => debounce((html: string) => {
    updateContent(block.uuid, () => ({ html }));
  }, 400), [block.uuid, updateContent]);
  return (
    <div className="border rounded-md bg-white p-4 shadow-sm">
      <TiptapEditor
        editable={isEditing}
        initialContent={block.content.html}
        onUpdateHtml={debounced}
      />
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
    <textarea
      className="w-full min-h-32 border rounded-md p-3 text-sm font-mono bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-400"
      readOnly={!isEditing}
      defaultValue={block.content.text}
      onChange={(e) => debounced(e.target.value)}
    />
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
    <div className="border rounded-md bg-white p-4 shadow-sm space-y-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-1">Description</th>
            <th className="py-1 w-20">Qty</th>
            <th className="py-1 w-28">Unit</th>
            <th className="py-1 w-28 text-right">Line</th>
            {isEditing && <th className="py-1 w-10 text-right"> </th>}
          </tr>
        </thead>
        <tbody>
          {items.map((it,idx)=> {
            const lineTotal = it.quantity * it.unitPrice;
            return (
              <tr key={it.id} className="border-b last:border-none">
                <td className="py-1">
                  {isEditing ? (
                    <input
                      className="w-full bg-transparent outline-none"
                      defaultValue={it.description}
                      onChange={(e)=> ensureItemDebouncer(it.id)("description", e.target.value, idx)}
                    />
                  ) : it.description}
                </td>
                <td className="py-1">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-16 bg-transparent outline-none"
                      defaultValue={it.quantity}
                      onChange={(e)=> ensureItemDebouncer(it.id)("quantity", Number(e.target.value)||0, idx)}
                    />
                  ) : it.quantity}
                </td>
                <td className="py-1">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-24 bg-transparent outline-none"
                      defaultValue={it.unitPrice}
                      step={0.01}
                      onChange={(e)=> ensureItemDebouncer(it.id)("unitPrice", Number(e.target.value)||0, idx)}
                    />
                  ) : it.unitPrice.toFixed(2)}
                </td>
                <td className="py-1 text-right tabular-nums">{lineTotal.toFixed(2)}</td>
                {isEditing && (
                  <td className="py-1 text-right">
                    <button
                      aria-label="Delete item"
                      onClick={() => handleDeleteItem(it.id)}
                      className="text-[11px] px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                    >✕</button>
                  </td>
                )}
              </tr>
            );
          })}
          {isEditing && (
            <tr>
              <td colSpan={5} className="pt-2">
                <button
                  onClick={handleAddItem}
                  className="text-xs px-3 py-1 rounded bg-neutral-200 hover:bg-neutral-300 border border-neutral-300"
                >+ Add Item</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex flex-col items-end space-y-1 text-sm">
        <div className="flex gap-8"><span>Subtotal</span><span className="tabular-nums">{subtotal.toFixed(2)}</span></div>
        <div className="flex gap-8 items-center">
          <span>Tax ({taxRate}%)</span>
          {isEditing ? (
            <input
              type="number"
              className="w-20 bg-transparent outline-none text-right"
              defaultValue={taxRate}
              onChange={(e)=> debouncedTax(Number(e.target.value)||0)}
            />
          ) : <span className="tabular-nums">{tax.toFixed(2)}</span>}
        </div>
        <div className="flex gap-8 font-semibold"><span>Total</span><span className="tabular-nums">{total.toFixed(2)} {currency}</span></div>
      </div>
      <div>
        <label className="block text-xs uppercase tracking-wide text-neutral-500 mb-1">Notes</label>
        {isEditing ? (
          <textarea
            className="w-full min-h-20 bg-neutral-50 border rounded p-2 text-sm"
            defaultValue={notes || ""}
            onChange={(e)=> debouncedNotes(e.target.value)}
          />
        ) : (
          <p className="text-sm whitespace-pre-wrap">{notes}</p>
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
