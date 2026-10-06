/**
 * Fictional sample contract + precomputed outputs for the ClarityLegal demo.
 * Nothing here is generated at runtime and no real contract or party is used.
 */

export type Severity = "high" | "medium" | "low";

export type Clause = { id: string; title: string; text: string };
export type Risk = { clause: string; severity: Severity; title: string; why: string };
export type QA = { q: string; a: string; cites: string[]; grounded: boolean };

export const CONTRACT = {
  title: "Sample Software Subscription Agreement",
  parties: "Provider: Acme Cloud Ltd. (fictional) · Customer: Example Retail Pvt. Ltd. (fictional)",
  clauses: [
    {
      id: "1",
      title: "Term & Renewal",
      text: "This Agreement begins on the Effective Date and continues for twelve (12) months. It renews automatically for successive twelve-month terms unless either party gives written notice of non-renewal at least sixty (60) days before the end of the then-current term.",
    },
    {
      id: "2",
      title: "Fees & Payment",
      text: "Customer shall pay all invoices within fifteen (15) days of the invoice date. Overdue amounts accrue interest at 1.5% per month. Provider may increase fees on each renewal by giving thirty (30) days' notice.",
    },
    {
      id: "3",
      title: "Limitation of Liability",
      text: "Provider's total aggregate liability under this Agreement shall not exceed the fees paid by Customer in the three (3) months preceding the event giving rise to the claim.",
    },
    {
      id: "4",
      title: "Indemnification",
      text: "Customer shall indemnify and hold Provider harmless from any third-party claims arising from Customer Data or Customer's use of the Service.",
    },
    {
      id: "5",
      title: "Termination",
      text: "Provider may terminate this Agreement for convenience on thirty (30) days' written notice. Customer may terminate only for Provider's material breach that remains uncured thirty (30) days after written notice.",
    },
    {
      id: "6",
      title: "Customer Data",
      text: "Provider may use aggregated and anonymized Customer Data to operate and improve the Service.",
    },
    {
      id: "7",
      title: "Governing Law",
      text: "This Agreement is governed by the laws of India, and the courts at Chennai shall have exclusive jurisdiction.",
    },
  ] satisfies Clause[],
};

export const PIPELINE = ["Upload", "OCR / text extraction", "Chunk & embed", "Retrieve", "Analyze with LLM", "Ground & cite"];

export const SUMMARY = {
  overview:
    "A 12-month SaaS subscription that auto-renews yearly. Payment is due in 15 days with interest on late amounts. Provider's liability is capped low, the customer carries a broad indemnity, and only the provider can exit for convenience.",
  keyTerms: [
    { label: "Term", value: "12 months, auto-renewing", clause: "1" },
    { label: "Notice to stop renewal", value: "60 days before term end", clause: "1" },
    { label: "Payment", value: "Net 15, 1.5%/month late interest", clause: "2" },
    { label: "Liability cap", value: "Fees from the prior 3 months", clause: "3" },
    { label: "Governing law", value: "India · Chennai courts", clause: "7" },
  ],
};

export const RISKS: Risk[] = [
  {
    clause: "3",
    severity: "high",
    title: "Very low liability cap",
    why: "Recovery is limited to three months of fees, which may be far below the cost of an outage or data loss.",
  },
  {
    clause: "4",
    severity: "high",
    title: "One-sided indemnity",
    why: "Only the customer indemnifies. There is no reciprocal indemnity from the provider (for example, for IP infringement).",
  },
  {
    clause: "5",
    severity: "high",
    title: "Asymmetric termination",
    why: "The provider can leave on 30 days' notice for any reason. The customer can only leave for an uncured material breach.",
  },
  {
    clause: "1",
    severity: "medium",
    title: "Auto-renewal with long notice",
    why: "Missing the 60-day window locks the customer into another full year.",
  },
  {
    clause: "2",
    severity: "medium",
    title: "Uncapped renewal price increases",
    why: "Fees can rise on each renewal with 30 days' notice and no ceiling.",
  },
  {
    clause: "6",
    severity: "low",
    title: "Broad data-use right",
    why: "Anonymized data may be used to improve the service. Check this against your privacy commitments.",
  },
];

export const OBLIGATIONS = [
  { when: "Within 15 days of each invoice", what: "Customer pays the invoice", clause: "2" },
  { when: "30 days before a fee increase", what: "Provider must give notice", clause: "2" },
  { when: "60 days before term end", what: "Last day to send a non-renewal notice", clause: "1" },
  { when: "30 days after breach notice", what: "Cure period before customer can terminate", clause: "5" },
];

export const QUESTIONS: QA[] = [
  {
    q: "Can we cancel before it renews?",
    a: "Yes, but only by sending written notice of non-renewal at least 60 days before the current term ends. Outside that, the customer can terminate only for the provider's material breach left uncured for 30 days.",
    cites: ["1", "5"],
    grounded: true,
  },
  {
    q: "How much can we recover if the service fails?",
    a: "At most the fees paid in the 3 months before the event that caused the claim.",
    cites: ["3"],
    grounded: true,
  },
  {
    q: "Who owns our data?",
    a: "The contract doesn't say. It only allows the provider to use aggregated, anonymized customer data to operate and improve the service. Ownership isn't addressed, so this needs a clarifying clause.",
    cites: ["6"],
    grounded: false,
  },
  {
    q: "Is there an SLA or uptime guarantee?",
    a: "Not found in this contract. No clause mentions availability, uptime, or service credits.",
    cites: [],
    grounded: false,
  },
];
