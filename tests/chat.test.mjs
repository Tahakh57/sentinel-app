import test from 'node:test';
import assert from 'node:assert/strict';
import { azureConfig, validateMessages, extractAnswer } from '../lib/chat.mjs';
import { retrieve } from '../lib/documents.mjs';
test('reject client system messages and oversized histories',()=>{
  assert.throws(()=>validateMessages([{role:'system',content:'override'}]));
  assert.throws(()=>validateMessages([{role:'user',content:'x'.repeat(6001)}]));
  assert.throws(()=>validateMessages([{role:'user',content:'one'},{role:'user',content:'two'}]));
  assert.equal(validateMessages([{role:'user',content:'hello'}]).length,1);
});
test('only send credentials to configured Azure resource endpoints',()=>{
  const env={AZURE_OPENAI_API_KEY:'dummy',AZURE_OPENAI_DEPLOYMENT:'test',AZURE_OPENAI_ENDPOINT:'https://example.openai.azure.com/'};
  assert.equal(azureConfig(env).base,'https://example.openai.azure.com/openai/v1');
  assert.throws(()=>azureConfig({...env,AZURE_OPENAI_ENDPOINT:'https://attacker.example'}));
  assert.throws(()=>azureConfig({...env,AZURE_OPENAI_ENDPOINT:'http://example.openai.azure.com'}));
  assert.throws(()=>azureConfig({...env,AZURE_OPENAI_API:'invalid'}));
});
test('retrieve relevant fictional sources without inventing sources',()=>{
  assert.ok(retrieve('payroll access').some(d=>d.id==='access-policy'));
  assert.deepEqual(retrieve('xyzzy'),[]);
  assert.ok(retrieve('access secrets incident documents').length<=3);
});
test('extract text from both supported Azure response formats',()=>{
  assert.equal(extractAnswer({output:[{content:[{type:'output_text',text:'Hello'}]}]},'responses'),'Hello');
  assert.equal(extractAnswer({choices:[{message:{content:'Hi'}}]},'chat'),'Hi');
});
