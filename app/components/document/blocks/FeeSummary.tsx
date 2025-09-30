"use client";
import React from "react";
import { nanoid } from "nanoid";
import { useUI } from "@/app/store/ui";
import { useDocumentBlocksStore } from "@/app/store/document/documentBlocksStore";
import type {
  AnyDocumentBlock,
  FeeOption,
  FeeLineItem,
} from "@/app/store/document/documentBlocks";
import { formatCurrency } from "@/app/lib/formatCurrency";
import { optionSubtotal, optionTax, optionTotal } from "@/app/lib/fees";
import { useDocumentConfig } from "@/app/store/document/documentConfig";
import { migrateFeeStructure } from "@/app/lib/feeStructure";
import TiptapEditor from "@/app/components/editor/TipTap";
import BubbleMenu from "../../editor/BubbleMenu";
import FloatingMenu from "../../editor/FloatingMenu";
import { ErrorBoundary } from "../../ErrorBoundary";

type Props = { block: Extract<AnyDocumentBlock, { type: "fee-summary" }> };

function sumOption(option: FeeOption): number {
  const subtotal = option.items.reduce((s, it) => s + it.qty * it.unitPrice, 0);
  const tax = subtotal * (option.taxRate / 100);
  return subtotal + tax;
}

function FeeCard({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-md ${
        active ? "bg-green-50/40" : "bg-transparent"
      } hover:bg-gray-50 transition p-6`}
    >
      <div className="text-2xl font-semibold text-gray-800 text-center mb-6">
        {label}
      </div>
      {children}
    </button>
  );
}

export default function FeeSummary({ block }: Props) {
  const isEditing = useUI((s) => s.isEditing);
  const cfg = useDocumentConfig();
  const { updateContent, mutateContent } =
    useDocumentBlocksStore();
  const content = block.content;
  const [choosePackage, setChoosePackage] = React.useState(false);

  const setStructure = (structure: typeof content.structure) => {
    updateContent(
      block.uuid,
      (prev) => migrateFeeStructure(prev as any, structure) as any
    );
  };

  const addOption = () => {
    updateContent(block.uuid, (prev) => {
      const c = prev as typeof content;
      const newOpt: FeeOption = {
        id: `opt_${Date.now().toString(36)}`,
        summary: "",
        items: [],
        taxRate: c.taxRate,
        currency: c.currency,
        selected:
          c.structure === "multi-select"
            ? false
            : c.structure === "packages"
            ? false
            : undefined,
      };
      return { ...c, options: [...c.options, newOpt] } as any;
    });
  };

  // Helpers to update items immutably (avoid structuredClone runtime issues)
  const updateItem = (
    optIndex: number,
    itemIndex: number,
    patch: Partial<FeeLineItem>
  ) => {
    mutateContent(block.uuid, (draft: any) => {
      Object.assign(draft.options[optIndex].items[itemIndex], patch);
    });
  };

  const addRow = (optIndex: number) => {
    const it: FeeLineItem = {
      id: nanoid(),
      name: "Item name",
      qty: 0,
      unitPrice: 0,
    };
    mutateContent(block.uuid, (draft: any) => {
      draft.options[optIndex].items.push(it);
    });
  };

  const removeRow = (optIndex: number, itemIndex: number) => {
    mutateContent(block.uuid, (draft: any) => {
      draft.options[optIndex].items.splice(itemIndex, 1);
    });
  };

  const updateOption = (idx: number, patch: Partial<FeeOption>) => {
    updateContent(block.uuid, (prev) => {
      const c = prev as typeof content;
      const options = c.options.map((o, i) =>
        i === idx ? { ...o, ...patch } : o
      );
      // enforce radio behavior for packages
      if ("selected" in patch && c.structure === "packages" && patch.selected) {
        for (let i = 0; i < options.length; i++)
          if (i !== idx) (options[i] as FeeOption).selected = false;
      }
      return { ...c, options } as any;
    });
  };

  const removeOption = (idx: number) => {
    updateContent(block.uuid, (prev) => {
      const c = prev as typeof content;
      const options = c.options.filter((_, i) => i !== idx);
      return { ...c, options } as any;
    });
  };

  return (
    <section className="space-y-8">
      {/* Package selection mode (triggered via Change Package) */}
      {choosePackage ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">
              Select your fee structure
            </h3>
            <button
              className="text-sm text-gray-600 underline"
              onClick={() => setChoosePackage(false)}
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeeCard
              label="Single Option"
              active={content.structure === "single"}
              onClick={() => {
                setStructure("single");
                setChoosePackage(false);
              }}
            >
              <div className="h-24 rounded-lg border border-gray-200 bg-gray-100" />
            </FeeCard>
            <FeeCard
              label="Packages"
              active={content.structure === "packages"}
              onClick={() => {
                setStructure("packages");
                setChoosePackage(false);
              }}
            >
              <div className="space-y-3">
                <div className="h-14 rounded-lg border border-gray-200" />
                <div className="h-14 rounded-lg border-2 border-green-500" />
                <div className="h-14 rounded-lg border border-gray-200" />
              </div>
            </FeeCard>
            <FeeCard
              label="Multi-Select"
              active={content.structure === "multi-select"}
              onClick={() => {
                setStructure("multi-select");
                setChoosePackage(false);
              }}
            >
              <div className="space-y-3">
                <div className="h-14 rounded-lg border-2 border-green-500" />
                <div className="h-14 rounded-lg border-2 border-green-500" />
              </div>
            </FeeCard>
          </div>
        </div>
      ) : null}

      {/* Options Panels */}
      {!choosePackage && (
        <div className="space-y-8">
          {/* Header bar with change structure and overall total */}
          <div className="flex items-center justify-between">
       
            <div className="flex items-center gap-4">
              {content.structure === "packages" && (
                <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  One package selected
                </span>
              )}
              <button
                className="text-green-700 font-semibold"
                onClick={() => setChoosePackage(true)}
              >
                Change Structure
              </button>
            </div>
          </div>
          {(content.structure === "single"
            ? content.options.slice(0, 1)
            : content.options
          ).map((opt, idx) => {
            const subtotal = optionSubtotal(opt);
            const tax = optionTax(opt);
            const total = optionTotal(opt);
            const showSelector = content.structure !== "single";
            const selectorType =
              content.structure === "multi-select" ? "checkbox" : "radio";
            return (
              <div key={opt.id} className="">

                  {/* Option header (combined title+description rich text) */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1 pr-4">
                      <ErrorBoundary>
                        <TiptapEditor
                          editable={isEditing}
                          initialContent={(opt as any).summary || ""}
                          onUpdateHtml={(html) => updateOption(idx, { summary: html } as any)}
                        >
                          {(editor) => (
                            isEditing ? (
                              <>
                                <BubbleMenu editor={editor} />
                                <FloatingMenu editor={editor} />
                              </>
                            ) : null
                          )}
                        </TiptapEditor>
                      </ErrorBoundary>
                    </div>
                    {showSelector && (
                      <div className="pl-4">
                        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type={selectorType}
                            checked={!!opt.selected}
                            onChange={(e) =>
                              updateOption(idx, { selected: e.target.checked })
                            }
                          />
                          {content.structure === "packages"
                            ? "Select one"
                            : "Select"}
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Items table */}
                  <div className="mt-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left bg-gray-50/60">
                          <th className="py-2 px-2 text-gray-600">Item</th>
                          <th className="py-2 px-2 w-20 text-gray-600">Qty</th>
                          <th className="py-2 px-2 w-32 text-gray-600">
                            Price
                          </th>
                          <th className="py-2 px-2 w-32 text-right text-gray-600">
                            Line Total
                          </th>
                          {isEditing && (
                            <th className="py-2 px-2 w-10 text-right text-gray-600">
                              {" "}
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {opt.items.map((it, i) => {
                          const line = it.qty * it.unitPrice;
                          return (
                            <tr
                              key={it.id}
                              className="odd:bg-white even:bg-gray-50/30"
                            >
                              <td className="py-2 px-2">
                                {isEditing ? (
                                  <input
                                    className="w-full bg-transparent outline-none"
                                    defaultValue={it.name}
                                    onChange={(e) =>
                                      updateItem(idx, i, {
                                        name: e.target.value,
                                      })
                                    }
                                  />
                                ) : (
                                  <span className="font-medium text-gray-800">
                                    {it.name}
                                  </span>
                                )}
                                {isEditing ? (
                                  <input
                                    className="w-full text-xs text-gray-600 bg-transparent outline-none"
                                    placeholder="Description (optional)"
                                    defaultValue={(it as any).description || ""}
                                    onChange={(e) =>
                                      updateItem(idx, i, {
                                        description: e.target.value,
                                      } as any)
                                    }
                                  />
                                ) : (it as any).description ? (
                                  <div className="text-xs text-gray-600">
                                    {(it as any).description}
                                  </div>
                                ) : null}
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  type="number"
                                  min={0}
                                  className="w-16 bg-transparent outline-none text-center border border-transparent focus:border-gray-300 rounded"
                                  defaultValue={it.qty}
                                  onChange={(e) =>
                                    updateItem(idx, i, {
                                      qty: Number(e.target.value) || 0,
                                    })
                                  }
                                />
                              </td>
                              <td className="py-2 px-2">
                                <input
                                  type="number"
                                  min={0}
                                  step="0.01"
                                  className="w-28 bg-transparent outline-none text-right border border-transparent focus:border-gray-300 rounded"
                                  defaultValue={it.unitPrice}
                                  onChange={(e) =>
                                    updateItem(idx, i, {
                                      unitPrice: Number(e.target.value) || 0,
                                    })
                                  }
                                />
                              </td>
                              <td className="py-2 px-2 text-right tabular-nums">
                                {formatCurrency(line, opt.currency)}
                              </td>
                              {isEditing && (
                                <td className="py-2 px-2 text-right">
                                  <button
                                    aria-label="Delete line item"
                                    onClick={() => removeRow(idx, i)}
                                    className="text-xs px-2 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200"
                                  >
                                    ✕
                                  </button>
                                </td>
                              )}
                            </tr>
                          );
                        })}
                        {isEditing && (
                          <tr>
                            <td colSpan={isEditing ? 5 : 4} className="pt-3">
                              <button
                                onClick={() => addRow(idx)}
                                className="text-green-700 font-medium"
                              >
                                + Add line item
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals strip */}
                  <div className="mt-6 text-sm">
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex justify-between w-full max-w-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="tabular-nums">
                          {formatCurrency(subtotal, opt.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between w-full max-w-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <span>Tax</span>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                step={0.1}
                                defaultValue={opt.taxRate}
                                onChange={(e) => {
                                  const v = Number(e.target.value);
                                  const clamped = isNaN(v)
                                    ? 0
                                    : Math.max(0, Math.min(100, v));
                                  updateOption(idx, { taxRate: clamped });
                                }}
                                className="w-20 bg-transparent outline-none text-right border border-transparent focus:border-gray-300 rounded px-2 py-1"
                              />
                              <span>%</span>
                            </>
                          ) : (
                            <span>Tax ({opt.taxRate.toFixed(1)}%)</span>
                          )}
                        </span>
                        <span className="tabular-nums">
                          {formatCurrency(tax, opt.currency)}
                        </span>
                      </div>
                      {cfg.requireUpfront && (
                        <div className="flex justify-between w-full max-w-sm">
                          <span className="text-gray-600">
                            Upfront ({cfg.upfrontPercent}%)
                          </span>
                          <span className="tabular-nums">
                            {formatCurrency(
                              total * (cfg.upfrontPercent / 100),
                              opt.currency
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between w-full max-w-sm border-t pt-2">
                        <span className="font-semibold text-lg">Total</span>
                        <span className="font-bold tabular-nums">
                          {formatCurrency(total, opt.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
               
                {/* Upfront requirement banner (document-level) */}
                {cfg.requireUpfront && (
                  <div className="bg-amber-50/40 text-amber-800 text-xs px-6 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span>Payment requirement:</span>
                      <strong>{cfg.upfrontPercent}% upfront</strong>
                      <span className="text-amber-700">
                        (document currency {cfg.currency})
                      </span>
                    </span>
                  </div>
                )}
                {isEditing && content.structure !== "single" && (
                  <div className="px-6 pb-5 flex justify-between text-sm text-gray-600">
                    <button
                      onClick={() => removeOption(idx)}
                      className="text-red-600"
                    >
                      Remove option
                    </button>
                    {idx === content.options.length - 1 && (
                      <button
                        onClick={addOption}
                        className="text-green-700 font-semibold"
                      >
                        Add New Option
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {isEditing && content.structure === "single" && (
            <div className="flex justify-end">
              <button
                onClick={addOption}
                className="text-green-700 font-semibold"
              >
                Add Alternative Option
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
