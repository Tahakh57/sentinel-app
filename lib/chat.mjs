export function validateMessages(value) {
  if (!Array.isArray(value) || value.length < 1 || value.length > 20) throw new Error('Send between 1 and 20 messages.');
  let size = 0;
  const messages = value.map(m => {
    if (!m || !['user','assistant'].includes(m.role) || typeof m.content !== 'string' || !m.content.trim() || m.content.length > 6000) throw new Error('Each message must contain up to 6,000 characters and a valid role.');
    size += m.content.length;
    return { role: m.role, content: m.content };
  });
  if (size > 24000 || messages.at(-1).role !== 'user' || messages[0].role !== 'user' || messages.some((m,i) => i > 0 && m.role === messages[i-1].role)) throw new Error('Invalid conversation or conversation too long. Start a new chat.');
  return messages;
}
export function azureConfig(env = process.env) {
  if (!env.AZURE_OPENAI_ENDPOINT || !env.AZURE_OPENAI_API_KEY || !env.AZURE_OPENAI_DEPLOYMENT) throw new Error('Set the Azure endpoint, deployment, and API key in .env.local, then restart.');
  const url = new URL(env.AZURE_OPENAI_ENDPOINT);
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || !/\.(openai\.azure\.com|services\.ai\.azure\.com)$/.test(url.hostname)) throw new Error('Use an HTTPS Azure OpenAI resource endpoint.');
  if (!['/', '/openai/v1', '/openai/v1/'].includes(url.pathname)) throw new Error('Use the resource endpoint or its /openai/v1/ URL.');
  const api = env.AZURE_OPENAI_API || 'responses';
  if (!['responses','chat'].includes(api)) throw new Error('AZURE_OPENAI_API must be responses or chat.');
  const maxTokens = Number(env.AZURE_OPENAI_MAX_OUTPUT_TOKENS || 800);
  if (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > 4096) throw new Error('Output token limit must be between 1 and 4096.');
  return { base: `${url.origin}/openai/v1`, key: env.AZURE_OPENAI_API_KEY, deployment: env.AZURE_OPENAI_DEPLOYMENT, api, maxTokens };
}
export function extractAnswer(data, api) {
  if (api === 'chat') return data.choices?.[0]?.message?.content || '';
  return (data.output || []).flatMap(item => item.content || []).filter(c => c.type === 'output_text').map(c => c.text).join('\n');
}
export function providerConfig(env = process.env) {
  const provider = env.LLM_PROVIDER || 'azure';
  if (provider === 'azure') return { ...azureConfig(env), provider, label: 'Azure' };
  if (provider !== 'groq') throw new Error('LLM_PROVIDER must be azure or groq.');
  if (!env.GROQ_API_KEY) throw new Error('Set GROQ_API_KEY in .env.local, then restart.');
  const maxTokens = Number(env.GROQ_MAX_OUTPUT_TOKENS || 2048);
  if (!Number.isInteger(maxTokens) || maxTokens < 1 || maxTokens > 4096) throw new Error('Groq output token limit must be between 1 and 4096.');
  return { provider, label: 'Groq', base: 'https://api.groq.com/openai/v1', key: env.GROQ_API_KEY, deployment: env.GROQ_MODEL || 'openai/gpt-oss-120b', api: 'chat', maxTokens };
}
export function providerHeaders(config) {
  return { 'Content-Type': 'application/json', ...(config.provider === 'groq' ? { Authorization: `Bearer ${config.key}` } : { 'api-key': config.key }) };
}
