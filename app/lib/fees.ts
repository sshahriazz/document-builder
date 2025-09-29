import type { FeeOption, FeeLineItem, FeeSummaryContent } from "@/app/store/document/documentBlocks";

export function lineTotal(item: FeeLineItem): number {
  return (item.qty || 0) * (item.unitPrice || 0);
}

export function optionSubtotal(opt: FeeOption): number {
  return (opt.items || []).reduce((s, it) => s + lineTotal(it), 0);
}

export function optionTax(opt: FeeOption): number {
  return optionSubtotal(opt) * ((opt.taxRate || 0) / 100);
}

export function optionTotal(opt: FeeOption): number {
  return optionSubtotal(opt) + optionTax(opt);
}

export function selectedOptions(c: FeeSummaryContent): FeeOption[] {
  if (c.structure === 'single') return c.options.slice(0, 1);
  if (c.structure === 'packages') return c.options.filter(o => o.selected).slice(0,1);
  return c.options.filter(o => o.selected);
}

export function blockDisplayTotal(c: FeeSummaryContent): number {
  const opts = selectedOptions(c);
  return opts.reduce((sum, o) => sum + optionTotal(o), 0);
}
