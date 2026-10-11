export const dynamic = 'force-dynamic';
export async function GET() {
  const demo = process.env.DEMO_MODE === 'true';
  const configured = Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY && process.env.AZURE_OPENAI_DEPLOYMENT);
  return Response.json({ status: 'ok', mode: demo ? 'demo' : 'azure', configured: demo || configured });
}
