"use client";
import React, { useMemo } from "react";
import { DocumentBlock, InvoiceItem } from "@/app/store/documentBlocks";
import { useBlockData } from "@/app/store/blockData";
import { useUI } from "@/app/store/ui";
import { Button } from "@heroui/react";

export interface InvoiceSummaryRendererProps {
  block: DocumentBlock;
}

function formatCurrency(v: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(v);
}

export default function InvoiceSummaryRenderer({
  block,
}: InvoiceSummaryRendererProps) {
  const { isEditing } = useUI();
  const data = useBlockData((s) => s.getData(block.blockUID));
  const updateData = useBlockData((s) => s.updateData);
  if (!data || block.kind !== "invoice-summary") {
    return <div className="text-xs text-red-500">Invoice data missing</div>;
  }
  const { items, taxRate, currency, notes } = data as any;

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc: number, it: any) => acc + it.quantity * it.unitPrice,
        0
      ),
    [items]
  );
  const tax = useMemo(() => subtotal * (taxRate / 100), [subtotal, taxRate]);
  const total = subtotal + tax;

  const updateItem = (id: string, patch: Partial<InvoiceItem>) => {
    const next = items.map((it: InvoiceItem) =>
      it.id === id ? { ...it, ...patch } : it
    );
    updateData(block.blockUID, "invoice-summary", { items: next } as any);
  };
  const addItem = () => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    updateData(block.blockUID, "invoice-summary", {
      items: [
        ...items,
        { id, description: "New item", quantity: 1, unitPrice: 0 },
      ],
    } as any);
  };
  const removeItem = (id: string) => {
    updateData(block.blockUID, "invoice-summary", {
      items: items.filter((i: InvoiceItem) => i.id !== id),
    } as any);
  };

  return (
    <div className="rounded-md border border-neutral-200 overflow-hidden">
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="font-medium text-sm">Invoice Summary</div>
        {isEditing && (
          <div className="flex gap-4 items-center text-xs">
            <label className="flex items-center gap-1">
              Tax %
              <input
                type="number"
                className="w-16 border border-neutral-300 rounded px-1 py-0.5 text-xs bg-white"
                value={taxRate}
                onChange={(e) =>
                  updateData(block.blockUID, "invoice-summary", {
                    taxRate: parseFloat(e.target.value) || 0,
                  } as any)
                }
              />
            </label>
            <label className="flex items-center gap-1">
              Currency
              <input
                type="text"
                maxLength={3}
                className="w-16 border border-neutral-300 rounded px-1 py-0.5 text-xs uppercase bg-white"
                value={currency}
                onChange={(e) =>
                  updateData(block.blockUID, "invoice-summary", {
                    currency: e.target.value.toUpperCase(),
                  } as any)
                }
              />
            </label>
          </div>
        )}
      </div>
      <table className="w-full text-sm">
        <thead className="bg-neutral-100 text-neutral-700 text-xs uppercase tracking-wide">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Description</th>
            <th className="text-right px-4 py-2 font-medium w-24">Qty</th>
            <th className="text-right px-4 py-2 font-medium w-32">
              Unit Price
            </th>
            <th className="text-right px-4 py-2 font-medium w-32">
              Line Total
            </th>
            {isEditing && <th className="w-8" />}
          </tr>
        </thead>
        <tbody>
          {items.map((it: InvoiceItem) => {
            const line = it.quantity * it.unitPrice;
            return (
              <tr key={it.id} className="border-t border-neutral-200">
                <td className="px-4 py-2 align-top">
                  {isEditing ? (
                    <textarea
                      className="w-full resize-none border border-transparent focus:border-blue-400 rounded px-1 py-1 text-xs"
                      value={it.description}
                      onChange={(e) =>
                        updateItem(it.id, { description: e.target.value })
                      }
                      rows={2}
                      aria-label="Item description"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-neutral-800">
                      {it.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-right align-top">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-16 border border-neutral-300 rounded px-1 py-0.5 text-xs"
                      value={it.quantity}
                      min={0}
                      onChange={(e) =>
                        updateItem(it.id, {
                          quantity: parseFloat(e.target.value) || 0,
                        })
                      }
                      aria-label="Item quantity"
                    />
                  ) : (
                    it.quantity
                  )}
                </td>
                <td className="px-4 py-2 text-right align-top">
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-24 border border-neutral-300 rounded px-1 py-0.5 text-xs"
                      value={it.unitPrice}
                      min={0}
                      step="0.01"
                      onChange={(e) =>
                        updateItem(it.id, {
                          unitPrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      aria-label="Unit price"
                    />
                  ) : (
                    formatCurrency(it.unitPrice, currency)
                  )}
                </td>
                <td className="px-4 py-2 text-right align-top font-medium">
                  {formatCurrency(line, currency)}
                </td>
                {isEditing && (
                  <td className="px-2 py-2 text-right align-top">
                    <button
                      onClick={() => removeItem(it.id)}
                      className="text-neutral-400 hover:text-red-500 text-xs"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
          {isEditing && (
            <tr className="border-t border-neutral-200 bg-neutral-50">
              <td colSpan={5} className="px-4 py-2">
                <Button size="sm" variant="flat" onPress={addItem}>
                  + Add Item
                </Button>
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="text-sm">
          <tr className="border-t border-neutral-300">
            <td colSpan={3} className="text-right px-4 py-2 font-medium">
              Subtotal
            </td>
            <td className="text-right px-4 py-2 font-medium">
              {formatCurrency(subtotal, currency)}
            </td>
            {isEditing && <td />}
          </tr>
          <tr>
            <td colSpan={3} className="text-right px-4 py-2 font-medium">
              Tax ({taxRate}%)
            </td>
            <td className="text-right px-4 py-2 font-medium">
              {formatCurrency(tax, currency)}
            </td>
            {isEditing && <td />}
          </tr>
          <tr className="border-t border-neutral-300 bg-neutral-100">
            <td colSpan={3} className="text-right px-4 py-2 font-semibold">
              Total
            </td>
            <td className="text-right px-4 py-2 font-semibold">
              {formatCurrency(total, currency)}
            </td>
            {isEditing && <td />}
          </tr>
        </tfoot>
      </table>
      {isEditing ? (
        <div className="border-t border-neutral-200 p-3">
          <textarea
            placeholder="Notes (optional)"
            className="w-full text-xs border border-neutral-300 rounded px-2 py-1 min-h-[60px] resize-y"
            value={notes || ""}
            onChange={(e) =>
              updateData(block.blockUID, "invoice-summary", {
                notes: e.target.value,
              } as any)
            }
          />
        </div>
      ) : notes ? (
        <div className="border-t border-neutral-200 p-3 text-xs text-neutral-600 whitespace-pre-wrap">
          {notes}
        </div>
      ) : null}
    </div>
  );
}
