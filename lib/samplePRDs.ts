export type SamplePRD = {
  id: string;
  label: string;
  expectedOutcome: string;
  body: string;
};

export const SAMPLE_PRDS: SamplePRD[] = [
  {
    id: "prd-1-dark-mode",
    label: "Clean PRD",
    expectedOutcome: "clean / no findings",
    body: `PRD-1: "Add dark mode toggle to portfolio settings"

We've received recurring user feedback requesting a dark mode option for the
broker app. This PRD scopes a settings-level toggle that switches the entire
app between light and dark themes, persisted per-user via existing user
preferences storage. No data is added, no decisioning logic changes, no new
external dependencies. Estimated effort: 1 sprint, frontend only.`,
  },
  {
    id: "prd-2-insights",
    label: "Mixed-findings PRD",
    expectedOutcome:
      "multiple findings, mix of warnings and human-review flags (transparency obligations, automated profiling under GDPR Art. 22, data minimisation on what's sent externally, MaRisk new-product process, borderline classification on whether this constitutes investment advice)",
    body: `PRD-2: "Personalized investment insights powered by user portfolio analysis"

To improve engagement and help users understand portfolio performance, we
will introduce a new "Insights for you" panel that uses an LLM to generate
personalized commentary on the user's holdings, recent transactions, and
asset allocation. The system reads from existing portfolio data, sends
summarized portfolio context to an external LLM provider (OpenAI), and
displays generated narrative insights in the broker app.

Insights will not include explicit buy/sell recommendations but will
highlight observations like "your portfolio is concentrated in EU equities"
or "your savings rate has decreased over the last quarter". Users will see
a small disclaimer that insights are AI-generated.

We will store the last 10 generated insights per user for 30 days for
caching purposes.`,
  },
  {
    id: "prd-3-credit-limit",
    label: "Blocker PRD",
    expectedOutcome:
      "blocker — high-risk AI under EU AI Act Annex III (creditworthiness assessment), GDPR Art. 22 violation (solely automated decisions affecting individuals), MaRisk BTO 1.1 violation (lending decisions require two consenting votes), DORA change management gaps, human oversight requirement under AI Act Art. 14",
    body: `PRD-3: "Automated credit limit increases for Overnight account customers"

To reduce operational load and improve customer experience, we will deploy
a machine learning model that automatically approves credit limit increases
of up to €50,000 for existing Overnight account customers based on their
account history, transaction patterns, and credit bureau data. Approvals
will execute without human review for requests scoring above a defined
confidence threshold. The model will be retrained quarterly on historical
approval outcomes.

Customers will be notified of the new limit via in-app message and email.`,
  },
];
