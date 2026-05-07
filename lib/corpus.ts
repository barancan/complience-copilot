export type CorpusEntry = {
  id: string;
  regulation: string;
  clause: string;
  topic: string;
  excerpt: string;
};

export const CORPUS: CorpusEntry[] = [
  {
    id: "AIA-006",
    regulation: "EU AI Act (Regulation (EU) 2024/1689)",
    clause: "Article 6(2) and Annex III",
    topic: "High-risk AI system classification",
    excerpt:
      '"AI systems intended to be used to evaluate the creditworthiness of natural persons or establish their credit score, with the exception of AI systems used for the purpose of detecting financial fraud" are classified as high-risk under Annex III, point 5(b).',
  },
  {
    id: "AIA-009",
    regulation: "EU AI Act",
    clause: "Article 9",
    topic: "Risk management system for high-risk AI",
    excerpt:
      "A risk management system shall be established, implemented, documented and maintained for high-risk AI systems as a continuous iterative process planned and run throughout the entire lifecycle, requiring regular systematic review and updating.",
  },
  {
    id: "AIA-010",
    regulation: "EU AI Act",
    clause: "Article 10",
    topic: "Data and data governance",
    excerpt:
      "High-risk AI systems which make use of techniques involving the training of models with data shall be developed on the basis of training, validation and testing data sets that meet the quality criteria. Data sets shall be relevant, sufficiently representative, and to the best extent possible, free of errors and complete in view of the intended purpose.",
  },
  {
    id: "AIA-014",
    regulation: "EU AI Act",
    clause: "Article 14",
    topic: "Human oversight",
    excerpt:
      "High-risk AI systems shall be designed and developed in such a way, including with appropriate human-machine interface tools, that they can be effectively overseen by natural persons during the period in which they are in use.",
  },
  {
    id: "AIA-050",
    regulation: "EU AI Act",
    clause: "Article 50",
    topic: "Transparency obligations for AI systems",
    excerpt:
      "Providers shall ensure that AI systems intended to interact directly with natural persons are designed and developed in such a way that the natural persons concerned are informed that they are interacting with an AI system, unless this is obvious from the point of view of a reasonably well-informed person.",
  },
  {
    id: "GDPR-005",
    regulation: "GDPR (Regulation (EU) 2016/679)",
    clause: "Article 5(1)(c)",
    topic: "Data minimisation",
    excerpt:
      "Personal data shall be adequate, relevant and limited to what is necessary in relation to the purposes for which they are processed.",
  },
  {
    id: "GDPR-022",
    regulation: "GDPR",
    clause: "Article 22(1)",
    topic: "Automated individual decision-making",
    excerpt:
      "The data subject shall have the right not to be subject to a decision based solely on automated processing, including profiling, which produces legal effects concerning him or her or similarly significantly affects him or her.",
  },
  {
    id: "GDPR-025",
    regulation: "GDPR",
    clause: "Article 25",
    topic: "Data protection by design and by default",
    excerpt:
      "The controller shall implement appropriate technical and organisational measures, such as pseudonymisation, designed to implement data-protection principles in an effective manner and to integrate the necessary safeguards into the processing.",
  },
  {
    id: "MARISK-AT-7-2",
    regulation: "BaFin MaRisk",
    clause: "AT 7.2 (2)–(3)",
    topic: "IT systems integrity and testing",
    excerpt:
      "The IT systems and the related IT processes have to ensure data integrity, availability, authenticity and confidentiality. The IT systems have to be tested before they are used for the first time and after any material changes have been made. They have to then be approved by both the staff responsible for the relevant processes and the staff responsible for the systems.",
  },
  {
    id: "MARISK-AT-8",
    regulation: "BaFin MaRisk",
    clause: "AT 8 (1)–(5)",
    topic: "Activities in new products or markets",
    excerpt:
      "A plan has to be drawn up prior to commencing business activities that relate to new products or markets. This plan is to be based on the result of the risk content analysis performed for these new business activities. The plan and the commencement of ongoing business activities have to be approved by the professional responsible management board member.",
  },
  {
    id: "MARISK-BTO-1-1",
    regulation: "BaFin MaRisk",
    clause: "BTO 1.1 (2)",
    topic: "Lending decisions — two-vote requirement",
    excerpt:
      "Depending on the nature, scale, complexity and risk content of the exposure in question, a lending decision requires two consenting votes by both the front and back office. If these decisions are made by a single committee, the majority structure within that committee has to be defined in such a way that the back office cannot be outvoted.",
  },
  {
    id: "DORA-017",
    regulation:
      "DORA RTS (Commission Delegated Regulation (EU) 2024/1532)",
    clause: "Article 17(1)(a)–(b)",
    topic: "ICT change management",
    excerpt:
      "Financial entities shall include in the ICT change management procedures, in respect of all changes to software, hardware, firmware components, systems, or security parameters: a verification of whether the ICT security requirements have been met; mechanisms to ensure the independence of the functions that approve changes and the functions responsible for requesting and implementing those changes.",
  },
];

export function getCorpusById(id: string): CorpusEntry | undefined {
  return CORPUS.find((entry) => entry.id === id);
}
