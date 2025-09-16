"use client";
import React from "react";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { useHeaderContent } from "@/app/store/header/headerContent";
import { formatCurrency } from "@/app/lib/formatCurrency";
import type { AnyBlockEntity } from "@/app/store/document/documentBlocksStore";
import type { DocumentBlocksStore } from "@/app/store/document/documentBlocksStore";

// Stable selector returning the invoice-summary block entity reference (object identity only changes when content actually changes)
const selectInvoiceSummaryBlock = (state: DocumentBlocksStore): AnyBlockEntity | undefined => {
  for (const id of state.order) {
    const b = state.byId[id];
    if (b.type === "invoice-summary") return b;
  }
  return undefined;
};

export default function Overview() {
  const header = useHeaderContent(s => s.data);
  const invoiceBlock = useDocumentBlocksStore(selectInvoiceSummaryBlock);

  const { total, currency } = React.useMemo(() => {
    if (!invoiceBlock || invoiceBlock.type !== "invoice-summary") {
      return { subtotal: 0, tax: 0, total: 0, currency: "USD" };
    }
    const { items, taxRate, currency } = invoiceBlock.content as any;
    const subtotal = items.reduce((sum: number, it: any) => sum + it.quantity * it.unitPrice, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total, currency };
  }, [invoiceBlock]);

  return (
    <div className="border-b border-neutral-200 pb-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Overview</h2>
      <dl className="grid grid-cols-2 gap-y-4 text-sm">
        <div className="col-span-2 flex items-center justify-between">
          <dt className="text-neutral-600 font-medium">Status</dt>
          <dd>
            <span className="inline-flex items-center gap-2 rounded-md bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-neutral-400" /> Drafted
            </span>
          </dd>
        </div>
        <div className="col-span-2 flex items-center justify-between">
          <dt className="text-neutral-600 font-medium">Project</dt>
          <dd className="text-neutral-800">{header.invoiceName || "Untitled"}</dd>
        </div>
        <div className="col-span-2 flex items-center justify-between">
          <dt className="text-neutral-600 font-medium">Fee Structure</dt>
          <dd className="text-neutral-800">Single Option</dd>
        </div>
        <div className="col-span-2 flex items-center justify-between">
          <dt className="text-neutral-600 font-medium">Amount</dt>
          <dd className="text-neutral-900 font-semibold tabular-nums">{formatCurrency(total, currency)}</dd>
        </div>
        <div className="col-span-2 flex items-center justify-between">
          <dt className="text-neutral-600 font-medium">Expiration Date</dt>
            <dd className="text-neutral-500">Set Expiration</dd>
        </div>
      </dl>
    </div>
  );
}
