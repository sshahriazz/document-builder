This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Document Blocks Data Model (v2)

The app uses a normalized store (Zustand + Immer + Persist) for dynamic document blocks.

### Entity Shape

```ts
interface DocumentBlockEntity {
	id: string;            // UUID-like internal id
	key: string;           // React key: `${type}-${id}`
	type: string;          // Discriminant (e.g. 'rich-text', 'invoice-summary')
	name: string;          // Human label shown in UI
	position: number;      // Derived ordering index
	styles: BlockStyles;   // Presentational style surface (extensible)
	content: BlockContent; // Discriminated union
}

interface RichTextContent {
	kind: 'rich-text' | 'overview' | 'scope' | 'deliverables' | 'timeline';
	html: string;
}

interface InvoiceSummaryContent {
	kind: 'invoice-summary';
	currency: string;
	taxRate: number;
	items: { id: string; description: string; quantity: number; unitPrice: number }[];
	notes?: string;
}
```

### Store Shape

```ts
type DocumentBlocksStore = {
	byId: Record<string, DocumentBlockEntity>;
	order: string[];             // array of ids controlling order
	hydrated: boolean;
	add(content: BlockContent, overrides?, index?): string;
	updateContent(id: string, patch: Partial<BlockContentSpecific>): void;
	updateStyles(id: string, patch: Partial<BlockStyles>): void;
	rename(id: string, name: string): void;
	move(id: string, toIndex: number): void;
	remove(id: string): void;
	createFromTemplate(templateId: string, index?: number): string;
	replaceAll(blocks: DocumentBlockEntity[]): void;
	clear(): void;
};
```

### Selecting Blocks

```ts
const ordered = useOrderedBlocks(); // derived array in render order
const { add, updateContent, move } = useDocumentBlocks();
```

### Why Normalized?

- O(1) access by id
- Cheap reordering (single order array mutation)
- Colocation of meta + content removes dual store sync complexity
- Easy persistence & migration

### Migration

Legacy blocks (previous `blocks` + separate `blockData`) are loaded via `loadInitialBlocks()` which internally calls `loadLegacy()` to seed entities with default content when raw content isn't available.

### Extending with New Block Types

1. Define a new content interface (e.g. `QuoteContent { kind: 'quote'; text: string; author?: string }`).
2. Add it to the `BlockContent` union.
3. Update the block template list (if template-driven) and registry renderer to map `kind` to a React component.
4. Use `add({ kind: 'quote', text: '', author: '' })` to create instances.

---

This unified model simplifies future enhancements like drag & drop, undo/redo, collaborative cursors, and block-level versioning.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
