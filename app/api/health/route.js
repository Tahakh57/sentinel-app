export const dynamic = 'force-dynamic';
export async function GET() {
  const demo = process.env.DEMO_MODE === 'true';
  const provider = process.env.LLM_PROVIDER || 'azure';
  const configured = provider === 'groq' ? Boolean(process.env.GROQ_API_KEY) : provider === 'azure' && Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_DEPLOYMENT);
  return Response.json({ status: 'ok', mode: demo ? 'demo' : provider, configured: demo || configured });
}
