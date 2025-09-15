export interface BlockTemplate {
  id: string;
  name: string;
  description?: string;
  initialContent: string;
}

export const blockTemplates: BlockTemplate[] = [
  {
    id: "overview",
    name: "Overview & Goals",
    description: "High-level summary of the project goals",
    initialContent:
      "<h2>Overview & Goals</h2><p>Enter an overview of the project and summarize its goals…</p>",
  },
  {
    id: "scope",
    name: "Scope",
    description: "What is in and out of scope",
    initialContent:
      "<h2>Scope</h2><p>Detail the boundaries of the work, inclusions and exclusions…</p>",
  },
  {
    id: "deliverables",
    name: "Deliverables",
    description: "List expected deliverables",
    initialContent:
      "<h2>Deliverables</h2><ul><li>Item 1</li><li>Item 2</li></ul>",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Milestones and schedule",
    initialContent: "<h2>Timeline</h2><p>Milestones will be listed here…</p>",
  },
];
