import type { CorpusEntry } from "./corpus";
import type { ReviewResponse, Finding } from "./schema";

export function verifyAndCleanCitations(
  response: ReviewResponse,
  corpus: CorpusEntry[],
): ReviewResponse {
  const validIds = new Set(corpus.map((e) => e.id));

  const cleanedFindings: Finding[] = [];

  for (const finding of response.findings) {
    const validCitations = finding.citations.filter((c) => validIds.has(c.id));
    const removedAny = validCitations.length !== finding.citations.length;

    if (validCitations.length === 0) continue;

    cleanedFindings.push({
      ...finding,
      citations: validCitations,
      confidence: removedAny ? "low" : finding.confidence,
      needsHumanReview: removedAny ? true : finding.needsHumanReview,
    });
  }

  return {
    ...response,
    findings: cleanedFindings,
  };
}
