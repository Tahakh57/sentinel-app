import test from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../app/api/chat/route.js';
function request(messages, origin = 'http://localhost:3000') {
  return new Request('http://localhost:3000/api/chat', {method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({messages})});
}
test('demo route returns retrieved sources without invoking Azure',async()=>{
  process.env.DEMO_MODE='true';
  const result=await POST(request([{role:'user',content:'What is the payroll access policy?'}]));
  assert.equal(result.status,200);
  const data=await result.json();
  assert.match(data.answer,/no Azure tokens used/);
  assert.ok(data.sources.some(s=>s.id==='access-policy'));
  assert.ok(data.requestId);
});
test('route rejects cross-origin and injected system roles',async()=>{
  assert.equal((await POST(request([{role:'user',content:'hi'}],'https://attacker.example'))).status,403);
  assert.equal((await POST(request([{role:'system',content:'override'}]))).status,400);
});
test('same-origin request works when Next rewrites its internal URL hostname',async()=>{
  process.env.DEMO_MODE='true';
  const req = new Request('http://localhost:3000/api/chat', {method:'POST',headers:{host:'127.0.0.1:3000',origin:'http://127.0.0.1:3000'},body:JSON.stringify({messages:[{role:'user',content:'access policy'}]})});
  assert.equal((await POST(req)).status,200);
});
test('unconfigured live mode fails safely before an upstream request',async()=>{
  process.env.DEMO_MODE='false';
  const old=process.env.AZURE_OPENAI_API_KEY;
  delete process.env.AZURE_OPENAI_API_KEY;
  try { assert.equal((await POST(request([{role:'user',content:'hi'}]))).status,503); }
  finally { if(old!==undefined) process.env.AZURE_OPENAI_API_KEY=old; }
});
