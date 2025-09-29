"use client";
import React from "react";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import { useHeaderContent } from "@/app/store/header/headerContent";
import { formatCurrency } from "@/app/lib/formatCurrency";
import type { AnyBlockEntity } from "@/app/store/document/documentBlocksStore";
import type { DocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import type { AnyDocumentBlock, FeeSummaryContent } from "@/app/store/document/documentBlocks";
import { blockDisplayTotal } from "@/app/lib/fees";
import { useDocumentConfig } from "@/app/store/document/documentConfig";

// Stable selector returning the first fee-summary block entity reference
const selectFeeSummaryBlock = (state: DocumentBlocksStore): AnyBlockEntity | undefined => {
  for (const id of state.order) {
    const b = state.byId[id];
    if (b.type === "fee-summary") return b;
  }
  return undefined;
};

export default function Overview() {
  const header = useHeaderContent(s => s.data);
  const feeBlock = useDocumentBlocksStore(selectFeeSummaryBlock);
  const cfg = useDocumentConfig();

  const { total, currency, structure } = React.useMemo(() => {
    if (!feeBlock || feeBlock.type !== "fee-summary") {
      return { total: 0, currency: cfg.currency, structure: cfg.defaultStructure } as const;
    }
    const content = feeBlock.content as FeeSummaryContent;
    // Prefer proposal-level currency for display to stay in sync with settings
    return { total: blockDisplayTotal(content), currency: cfg.currency, structure: content.structure } as const;
  }, [feeBlock, cfg.currency, cfg.defaultStructure]);

  const structureLabel = React.useMemo(() => {
    switch (structure) {
      case 'single': return 'Single Option';
      case 'packages': return 'Packages';
      case 'multi-select': return 'Multi-Select';
      default: return 'Single Option';
    }
  }, [structure]);

  const upfrontAmount = cfg.requireUpfront ? (total * (cfg.upfrontPercent / 100)) : 0;
  const expirationLabel = cfg.expirationDate ? new Date(cfg.expirationDate + 'T00:00:00').toLocaleDateString() : 'Set Expiration';

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
          <dd className="text-neutral-800">{structureLabel}</dd>
        </div>
        <div className="col-span-2 flex items-center justify-between">
          <dt className="text-neutral-600 font-medium">Amount</dt>
          <dd className="text-neutral-900 font-semibold tabular-nums">{formatCurrency(total, currency)}</dd>
        </div>
        {cfg.requireUpfront && (
          <div className="col-span-2 flex items-center justify-between">
            <dt className="text-neutral-600 font-medium">Upfront</dt>
            <dd className="text-neutral-900 tabular-nums">{cfg.upfrontPercent}% = {formatCurrency(upfrontAmount, currency)}</dd>
          </div>
        )}
        <div className="col-span-2 flex items-center justify-between">
          <dt className="text-neutral-600 font-medium">Expiration Date</dt>
          <dd className={cfg.expirationDate ? "text-neutral-800" : "text-neutral-500"}>{expirationLabel}</dd>
        </div>
      </dl>
    </div>
  );
}
