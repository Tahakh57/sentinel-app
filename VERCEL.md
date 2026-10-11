# Deploy to Vercel

Deploy only this chat-app directory, not the entire security-project repository. Vercel builds Next.js directly; it does not use Docker Compose or the Dockerfile. The local Docker deployment continues to work.

## First deployment

1. Sign in to Vercel. Using the CLI from chat-app: `npx vercel login`, then `npx vercel`. This creates a preview deployment. Alternatively import your Git repository with root directory `04-ai-security-monitoring/chat-app` (adjust to the actual repository-relative path).
2. First preview: set DEMO_MODE=true in Vercel project environment variables. No provider key is needed. Local .env files are excluded from uploads and are not copied automatically to Vercel.
3. Set project Settings > Deployment Protection > All Deployments > Vercel Authentication. Verify protection before enabling live inference. Standard Protection excludes production domains. You and your friend need suitable Vercel access; plan/team permissions may affect collaboration.
4. For live inference, add server-side environment variables for the intended Preview and Production environments: DEMO_MODE=false, LLM_PROVIDER=groq, GROQ_API_KEY (a newly rotated key), GROQ_MODEL=openai/gpt-oss-120b, GROQ_MAX_OUTPUT_TOKENS=2048.
5. Redeploy the preview, test chat, then deploy production with `npx vercel --prod`. Do not turn off protection to make an API test pass.

## Limits

The chat function allows 90 seconds for its 60-second provider timeout; verify your Vercel project's function settings support this duration. In-process concurrency limits are per serverless instance, not an account-wide quota. Authentication and provider limits are necessary for a shared demo; add persistent rate limiting before making live inference public.

The free Hobby plan is for personal, non-commercial use. Use a suitable paid plan when this becomes commercial. Do not enable paid services or trials just to deploy this prototype without reviewing their terms.

## Verification

Check the protected deployment in your authenticated browser: homepage renders, /api/health reports expected mode, and a fictional-policy question returns text with sources. Check an unauthenticated browser cannot reach the live API. Inspect application logs only for metadata, not credentials or prompt content.

References: https://vercel.com/docs/deployment-protection and https://vercel.com/docs/plans/hobby
