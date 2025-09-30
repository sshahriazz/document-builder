import type { FeeStructure, FeeSummaryContent, FeeOption } from "@/app/store/document/documentBlocks";

export function migrateFeeStructure(content: FeeSummaryContent, to: FeeStructure): FeeSummaryContent {
  let options = content.options.slice();
  if (to === 'single') {
    const chosen = options.find(o => o.selected) || options[0];
    const one: FeeOption = { ...chosen };
    delete one.selected;
    return { ...content, structure: 'single', options: [one] };
  }
  if (to === 'packages') {
    const selectedFound = options.some(o => o.selected);
    if (!selectedFound && options.length) {
      options = options.map((o, i) => ({ ...o, selected: i === 0 }));
    } else {
      let seen = false;
      options = options.map(o => {
        const sel = !seen && o.selected === true;
        if (sel) seen = true;
        return { ...o, selected: sel };
      });
      if (!seen && options.length) options[0].selected = true;
    }
    return { ...content, structure: 'packages', options };
  }
  // multi-select
  const any = options.some(o => o.selected);
  if (!any && options.length) options = options.map((o, i) => ({ ...o, selected: i === 0 }));
  else options = options.map(o => ({ ...o, selected: !!o.selected }));
  return { ...content, structure: 'multi-select', options };
}
