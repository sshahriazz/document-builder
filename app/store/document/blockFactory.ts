import { nanoid } from "nanoid";
import { BlockType, BlockContentMap, BlockStyleMap } from "./documentBlocks";
import { useDocumentConfig } from "./documentConfig";

export function createBlock(type: BlockType): { type: BlockType; content: BlockContentMap[BlockType]; style?: BlockStyleMap[BlockType]; uuid: string } {
  switch (type) {
    case "rich-text":
      return { type, uuid: nanoid(), content: { html: "<p>New rich text block</p>" } };
    case "text-area":
      return { type, uuid: nanoid(), content: { text: "New notes" } };
    case "scope-of-services":
      return {
        type,
        uuid: nanoid(),
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
      };
    case "your-section":
      return {
        type,
        uuid: nanoid(),
        content: {
          html:
            "<h2>Your Section Title</h2>" +
            "<p>Lorem ipsum dolor sit amet, ea eum solum pertinax evertitur, vocent saperet denique eu vim, adhuc nullam doming ut sed. Posidonium argumentum ut nec, usu et ubique oblique suavitate.</p>" +
            "<p>Persius facilis nam in, pro nibh volumus ad, ad nemore reprehendunt ius. In est modo malorum appareat. Eu ceteros delectus vim, qui aperiri intellegat omittantur ut. An sed quis euismod delenit, per simul contentiones et, sint dicit constituam eos ex.</p>" +
            "<h3>Why Us?</h3>" +
            "<p>Lorem ipsum dolor sit amet, ea eum solum pertinax evertitur, vocent saperet denique eu vim, adhuc nullam doming ut sed. Posidonium argumentum ut nec, usu et ubique oblique suavitate.</p>",
        } as any,
        style: { marginTop: 12, marginBottom: 24 } as any,
      };
    case "files-and-attachments":
      return {
        type,
        uuid: nanoid(),
        content: {
          title: "Files & Attachments",
          showDescription: false,
          description: "",
          files: [],
        } as any,
      };
    case "terms-and-conditions":
      return {
        type,
        uuid: nanoid(),
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
      };
    case "deliverables":
      return {
        type,
        uuid: nanoid(),
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
      };
    case "fee-summary":
      // Read current config synchronously from the store (safe for client-only usage)
      const cfg = useDocumentConfig.getState();
      return {
        type,
        uuid: nanoid(),
        content: {
          structure: cfg.defaultStructure,
          currency: cfg.currency,
          taxRate: 0,
          options: [
            {
              id: nanoid(),
              summary: 'Starter Package',
              items: [ { id: nanoid(), name: 'One-time Fee', qty: 1, unitPrice: 2500 } ],
              taxRate: 0,
              currency: cfg.currency,
              selected: false,
            },
            {
              id: nanoid(),
              summary: 'Starter Package',
              items: [ { id: nanoid(), name: 'Monthly Fee', qty: 6, unitPrice: 2000 } ],
              taxRate: 0,
              currency: cfg.currency,
              selected: cfg.defaultStructure === 'packages',
            },
            {
              id: nanoid(),
              summary: 'Premium Package',
              items: [ { id: nanoid(), name: 'Monthly Fee', qty: 6, unitPrice: 3000 } ],
              taxRate: 0,
              currency: cfg.currency,
              selected: false,
            }
          ]
        }
      };
    default:
      return { type, uuid: nanoid(), content: {} as BlockContentMap[BlockType] };
  }
}
export const blockTypeLabels: Record<BlockType, string> = {
  "rich-text": "Rich Text",
  "text-area": "Text Area",
  "fee-summary": "Fee Summary",
  "scope-of-services": "Scope of Services",
  "deliverables": "Deliverables",
  "terms-and-conditions": "Terms and Conditions",
  "files-and-attachments": "Files & Attachments",
  "your-section": "Your Section",
};