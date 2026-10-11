export const documents = [
  { id: 'access-policy', title: 'Agent access policy', classification: 'Internal · fictional', content: 'The support assistant may search support articles and product FAQs. It must not access payroll, employee records, or finance systems. Tool calls require an explicit authorization decision. A denied action must be escalated to a human.' },
  { id: 'data-handling', title: 'Sensitive data handling', classification: 'Internal · fictional', content: 'Never submit passwords, API keys, access tokens, or customer personal information in prompts. Suspected credentials must be masked in telemetry. Use synthetic records and dummy credentials for security demonstrations.' },
  { id: 'incident-response', title: 'Incident response guide', classification: 'Internal · fictional', content: 'Validate an alert, preserve sanitized evidence, identify affected users and documents, assess exposure, and communicate impact. Revocation requires approval and a verified identity-provider integration. This demo does not execute tools or revoke identities.' },
  { id: 'retrieval-policy', title: 'Document retrieval limits', classification: 'Internal · fictional', content: 'Retrieve only documents relevant to the question. Investigate unusually high document counts or bytes returned within a session. Bulk access can be legitimate; tune thresholds against benign activity and application policy.' }
];
export function retrieve(query) {
  const terms = [...new Set(query.toLowerCase().match(/[a-z]{3,}/g) || [])].filter(t => !['the', 'and', 'what', 'how', 'can', 'for', 'are', 'with'].includes(t));
  return documents.map(d => ({ ...d, score: terms.reduce((n,t) => n + (`${d.title} ${d.content}`.toLowerCase().includes(t) ? 1 : 0), 0) })).filter(d => d.score > 0).sort((a,b) => b.score-a.score).slice(0,3);
}
