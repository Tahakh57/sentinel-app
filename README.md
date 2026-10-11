# Sentinel chat demo

## Groq provider

Set `LLM_PROVIDER=groq`, `DEMO_MODE=false`, and `GROQ_API_KEY` in your ignored `.env.local`. Default model: `openai/gpt-oss-120b`; override with `GROQ_MODEL`. `GROQ_MAX_OUTPUT_TOKENS` defaults to 2048. The Groq endpoint is fixed server-side and uses bearer authentication. Azure remains available via `LLM_PROVIDER=azure`. Recreate the container after changing settings. Provider credentials are not sent to the browser or copied into Docker images. Live chat sends your conversation and retrieved fictional context to the selected provider. Groq account rate limits apply.

Next.js chat UI with server-side Azure OpenAI calls and keyword retrieval over four fictional security documents. No paid vector database or embedding API is required. This is a chat/RAG demo, not the full monitoring appliance.

## Run in Docker

From this directory in PowerShell:

```powershell
Copy-Item .env.example .env.local
# Edit .env.local locally; do not paste your key into chat or commit it.
docker compose up --build -d
```

Open http://localhost:3000. Initially DEMO_MODE=true returns deterministic responses without contacting Azure. For live chat set DEMO_MODE=false and configure:

- AZURE_OPENAI_ENDPOINT: your resource URL, e.g. https://your-resource.openai.azure.com (or its /openai/v1/ URL).
- AZURE_OPENAI_API_KEY: the Azure resource key; server-only, not NEXT_PUBLIC.
- AZURE_OPENAI_DEPLOYMENT: the deployment name from Azure, not necessarily the model name.
- AZURE_OPENAI_API: responses (default) or chat, depending on deployment support.
- AZURE_OPENAI_MAX_OUTPUT_TOKENS: defaults to 800; includes reasoning tokens where applicable.

After configuration changes run `docker compose up -d --force-recreate`. Credentials are injected at runtime, excluded from the image, and never returned to the browser. Azure networking must permit connections from this container host. The API uses the Azure v1 endpoint, without a dated api-version parameter.

## Local development

```powershell
npm.cmd ci
npm.cmd run dev
```

## Verification

```powershell
npm.cmd test
npm.cmd run build
docker compose ps
docker compose logs chat
```

The health endpoint checks the app and presence of configuration; it does not test Azure connectivity or validate credentials. Application logs emit JSON metadata for completed chats (event ID, document IDs/count, mode, duration), without prompts or model outputs. Failed requests are shown in the UI. S3 export, sensitive-content inspection, durable telemetry, session identities, and detection rules are future monitoring integrations; they are not implemented here.

Chat history is held in tab memory and sent to Azure on each live turn. Retrieved source badges show supplied context, not proof that each model claim is supported. Reference documents are in lib/documents.mjs. The app has no tool execution or file upload.

## Deployment boundaries

Compose exposes only localhost:3000, suitable for your own laptop. The demo has same-origin browser checks, request validation, a 60-second model timeout, and a three-request per-process concurrency cap. It has no user authentication or durable rate limiting. Add authentication, TLS, and shared rate limits before exposing it to others. Never use real sensitive records in the demo.

The container runs as a non-root user. Package versions are pinned in package-lock.json; the Node 24 image tag receives updates. Pin an image digest after validating a release if immutable builds are required.

References: https://learn.microsoft.com/en-us/azure/foundry/openai/api-version-lifecycle and https://nextjs.org/docs/app/api-reference/config/next-config-js/output
