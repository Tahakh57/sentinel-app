# Vercel production checklist: free demo deployment

This is a private prototype using Groq, not a production security appliance. Avoid enabling a paid trial or add-on to complete a checklist. Hobby is for personal/non-commercial use; review a suitable plan before commercializing.

## Implemented

- [x] Next.js production deployment and lockfile-pinned dependencies.
- [x] Server-side provider configuration; no NEXT_PUBLIC credential variables.
- [x] Groq key in Vercel sensitive environment storage; local environment files ignored by Git and deployment uploads.
- [x] Vercel Authentication configured for all deployments.
- [x] Health endpoint and successful hosted model-response check.
- [x] Declare @vercel/analytics and add Analytics from @vercel/analytics/next to the root layout. No custom events containing prompts, responses, identities, or credentials.
- [ ] Complete npm install and regenerate package-lock.json, then build and deploy Analytics. DNS currently blocks installation; the source change has not been built or deployed.
- [ ] Install @vercel/speed-insights and add SpeedInsights from @vercel/speed-insights/next, sampled at 10% to conserve the free allowance. Sampling does not guarantee staying within every quota.
- [ ] Include analytics components only in Vercel deployments; local Docker remains independent.
- [x] Security headers: nosniff, deny framing, conservative referrer policy, camera/microphone/geolocation disabled.
- [x] Private-demo search indexing disabled via robots metadata and response header.
- [x] App title, description, and vector app icon.
- [x] Input validation, same-origin browser checks, provider timeout, and bounded output tokens.
- [x] Metadata-only model completion logs.
- [x] Chat and retrieval regression tests.

## Vercel settings and operational checks

- [ ] Confirm Web Analytics is enabled in the project dashboard and verify a page view arrives.
- [ ] Confirm Speed Insights is enabled and verify real browser measurements arrive.
- [ ] Review current free-plan quotas and usage. Do not opt into paid analytics/events.
- [ ] Review the linked GitHub repository, root directory, and automatic-deployment branch before relying on Git deployments. CLI uploads use only chat-app.
- [ ] Check mobile/desktop layout and keyboard interaction.
- [ ] Confirm unauthenticated requests remain blocked after deployment.
- [ ] Rotate the Groq key previously shared in chat and update local/Vercel secrets.
- [ ] Review Vercel runtime logs and function/provider error rates periodically.

Vercel provides deployment history, generated HTTPS domains, and build logs without requiring a custom paid monitoring integration. Dashboard data availability and retention follow your plan; they are not unlimited. No custom domain purchase, paid password protection, database, external uptime subscription, or premium observability add-on is required for this private demo.

## Beyond this prototype

Persistent rate limiting, end-user authentication, S3 telemetry export, durable audit records, alerting, and a backup-tested monitoring store remain separate work. The process-local concurrency cap is not a distributed rate limiter on Vercel. Web Analytics and Speed Insights measure the website; they do not replace AI security telemetry.

References: https://vercel.com/docs/production-checklist, https://vercel.com/docs/analytics/quickstart, https://vercel.com/docs/speed-insights/quickstart, https://vercel.com/docs/plans/hobby

## Current deployment status

The security headers, metadata, icon, and Analytics integration changes are local only. Analytics package installation and redeployment were blocked by DNS timeouts for registry.npmjs.org and api.vercel.com. Run npm install to regenerate the lockfile before building; npm ci will not accept the pending dependency change until the lockfile is updated. The existing hosted app remains unchanged. Verify current free allowances in Vercel's dashboard before enabling new services.
