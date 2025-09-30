// Initial document blocks seed data and helper
// This keeps seeding explicit (not auto-run on import) so you can choose where to hydrate.

import { AnyDocumentBlock } from "./documentBlocks";
import { useDocumentBlocksStore } from "./documentBlocksStore";
import { useDocumentConfig } from "./documentConfig";

/**
 * Three starter blocks (one per block type) with stable UUIDs.
 * You can duplicate / modify as needed.
 */
export const initialDocumentBlocks: AnyDocumentBlock[] = [
  {
    uuid: "blk_rich_welcome",
    type: "rich-text",
    content: {
      html: "<h1>Welcome</h1><p>This is your first rich text block.</p>"
    },
    position: 0,
    style: { fontSize: 18, marginBottom: 16 }
  },
  {
    uuid: "blk_text_notes",
    type: "text-area",
    content: {
      text: "Internal notes: refine messaging before sending to client."
    },
    position: 1, // will be shifted to 2 when fee-summary is inserted during seeding
    style: { monospace: true, marginTop: 12 }
  }
];

/**
 * Hydrate the store with the initial blocks.
 * Call this once in a client component (e.g. inside a useEffect in a Provider) if you want defaults.
 */
export function seedDocumentBlocks(force = false) {
  const state = useDocumentBlocksStore.getState();
  if (!force && state.order.length > 0) return; // avoid overwriting existing user data unless forced
  // Build fee-summary using current document config for currency and default structure
  const cfg = useDocumentConfig.getState();
  const feeBlock: AnyDocumentBlock = {
    uuid: "blk_fee_summary",
    type: "fee-summary",
    content: {
      structure: cfg.defaultStructure,
      currency: cfg.currency,
      taxRate: 0,
      options: [
        {
          id: "opt_starter",
          summary: "<p><strong>Starter Package</strong></p><p>Basic deliverables suitable for small engagements.</p>",
          items: [{ id: "it_one_time", name: "One-time Fee", qty: 1, unitPrice: 2500 }],
          taxRate: 0,
          currency: cfg.currency,
          selected: cfg.defaultStructure === 'packages' ? false : undefined,
        },
        {
          id: "opt_six_month",
          summary: "<p><strong>6-Month Package</strong></p><p>Monthly retainer over 6 months for the agreed-upon services.</p>",
          items: [{ id: "it_monthly_6", name: "Monthly Fee", qty: 6, unitPrice: 2000 }],
          taxRate: 0,
          currency: cfg.currency,
          selected: cfg.defaultStructure === 'packages',
        },
        {
          id: "opt_premium",
          summary: "<p><strong>Premium Package</strong></p><p>Expanded scope, priority support, and additional reviews.</p>",
          items: [{ id: "it_monthly_6_p", name: "Monthly Fee", qty: 6, unitPrice: 3000 }],
          taxRate: 0,
          currency: cfg.currency,
          selected: cfg.defaultStructure === 'packages' ? false : undefined,
        }
      ]
    } as any,
    position: 1,
    style: { marginTop: 20, marginBottom: 24 }
  };

  const scopeBlock: AnyDocumentBlock = {
    uuid: "blk_scope_services",
    type: "scope-of-services",
    content: {
      html:
        "<h2>Scope of Services</h2>" +
        "<p><u>Bookkeeping:</u> I will handle the day-to-day bookkeeping tasks, including recording financial transactions, reconciling accounts, and maintaining general ledgers.</p>" +
        "<p>&nbsp;</p>" +
        "<p><u>Tax Compliance:</u> I will ensure your business remains compliant with tax regulations by preparing and filing your tax returns, including income tax, sales tax, and any other applicable taxes.</p>" +
        "<p>&nbsp;</p>" +
        "<p><u>Financial Analysis:</u> I will analyze your financial data to provide insights into your business's performance, identify areas of improvement, and make informed financial decisions.</p>" +
        "<p>&nbsp;</p>" +
        "<p><u>Advisory Services:</u> I will be available for consultation and provide financial advice on matters such as budgeting, cash flow management, and business planning.</p>",
    } as any,
    position: 2,
    style: { marginTop: 24, marginBottom: 24 }
  };

  const deliverablesBlock: AnyDocumentBlock = {
    uuid: "blk_deliverables",
    type: "deliverables",
    content: {
      html:
        "<h2>Deliverables</h2>" +
        "<ul>" +
        "<li>Accurate and up-to-date financial records.</li>" +
        "<li>Timely and reliable financial statements.</li>" +
        "<li>Completed tax returns and compliance documentation.</li>" +
        "<li>Financial analysis reports and recommendations.</li>" +
        "<li>Advisory services and consultations as needed.</li>" +
        "</ul>",
    } as any,
    position: 3,
    style: { marginTop: 12, marginBottom: 24 }
  };

  const yourSectionBlock: AnyDocumentBlock = {
    uuid: "blk_your_section",
    type: "your-section",
    content: {
      html:
        "<h2>Your Section Title</h2>" +
        "<p>Lorem ipsum dolor sit amet, ea eum solum pertinax evertitur, vocent saperet denique eu vim, adhuc nullam doming ut sed. Posidonium argumentum ut nec, usu et ubique oblique suavitate.</p>" +
        "<p>Persius facilis nam in, pro nibh volumus ad, ad nemore reprehendunt ius. In est modo malorum appareat. Eu ceteros delectus vim, qui aperiri intellegat omittantur ut. An sed quis euismod delenit, per simul contentiones et, sint dicit constituam eos ex.</p>" +
        "<h3>Why Us?</h3>" +
        "<p>Lorem ipsum dolor sit amet, ea eum solum pertinax evertitur, vocent saperet denique eu vim, adhuc nullam doming ut sed. Posidonium argumentum ut nec, usu et ubique oblique suavitate.</p>",
    } as any,
    position: 4,
    style: { marginTop: 12, marginBottom: 24 }
  };

  const filesBlock: AnyDocumentBlock = {
    uuid: "blk_files_attachments",
    type: "files-and-attachments",
    content: { title: "Files & Attachments", showDescription: false, description: "", files: [] } as any,
    position: 6,
    style: { marginTop: 12, marginBottom: 24 }
  };

  const termsBlock: AnyDocumentBlock = {
    uuid: "blk_terms_conditions",
    type: "terms-and-conditions",
    content: {
      html:
        "<h2>Terms and Conditions</h2>" +
        "<ul>" +
        "<li>The retainer agreement will be valid for an initial period of [duration, e.g., 6 months], with the option to renew upon mutual agreement.</li>" +
        "<li>Payment terms: The retainer fee will be invoiced monthly, with payment due within [number of days, e.g., 15 days] of the invoice date.</li>" +
        "<li>Termination: Either party may terminate this agreement with [notice period, e.g., 30 days] written notice.</li>" +
        "<li>Confidentiality: All financial information shared during our partnership will be treated as confidential and will not be disclosed to any third parties.</li>" +
        "<li>Ownership: All financial records and documents will be returned to [Client's Company] upon termination of the agreement.</li>" +
        "</ul>" +
        "<p>&nbsp;</p>" +
        "<p>I am confident that my accounting expertise and attention to detail will contribute significantly to maintaining your business's financial health. I would be delighted to work with you as your dedicated accountant and provide you with accurate financial information and valuable insights.</p>" +
        "<p>&nbsp;</p>" +
        "<p>Please review the proposal, and feel free to reach out with any questions, concerns, or suggested modifications. I am available for a meeting or a call at your convenience to discuss the details further.</p>" +
        "<p>&nbsp;</p>" +
        "<p>Thank you for considering this proposal, and I look forward to the opportunity to collaborate with you.</p>",
    } as any,
    position: 5,
    style: { marginTop: 12, marginBottom: 24 }
  };

  const base = initialDocumentBlocks;
  const textBlock = { ...base[1], position: 7 } as AnyDocumentBlock;
  const blocks: AnyDocumentBlock[] = [base[0], feeBlock, scopeBlock, deliverablesBlock, yourSectionBlock, termsBlock, filesBlock, textBlock];
  state.replaceAll(blocks);
}

/**
 * Example usage (not executed here):
 *
 * import { useEffect } from 'react';
 * import { seedDocumentBlocks } from '@/app/store/document/initialBlocks';
 *
 * export function DocumentProvider({ children }: { children: React.ReactNode }) {
 *   useEffect(() => { seedDocumentBlocks(); }, []);
 *   return <>{children}</>;
 * }
 */
