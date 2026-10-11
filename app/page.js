'use client';
import { useEffect, useRef, useState } from 'react';
const suggestions = ['What data can the support agent access?', 'How should we handle secrets in prompts?', 'Walk me through an AI security incident.', 'When is document retrieval suspicious?'];
export default function Home() {
  const [messages,setMessages] = useState([]);
  const [input,setInput] = useState('');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [status,setStatus] = useState(null);
  const [rag,setRag] = useState([]);
  const end = useRef(null);
  useEffect(() => { fetch('/api/health').then(r=>r.json()).then(setStatus).catch(()=>setError('Unable to connect to the app.')); },[]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); },[messages,busy]);
  async function send(text) {
    if (busy || !text.trim()) return;
    const previous = messages;
    const next = [...previous,{role:'user',content:text.trim()}];
    setMessages(next); setInput(''); setError(''); setBusy(true);
    try {
      const response = await fetch('/api/chat',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({messages:next.map(({role,content})=>({role,content}))}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed.');
      setMessages([...next,{role:'assistant',content:data.answer,sources:data.sources}]); setRag(data.sources);
    } catch(e) { setError(e.message); setMessages(previous); setInput(text); }
    finally { setBusy(false); }
  }
  return <div className="shell">
    <aside className="sidebar"><a className="brand" href="/">◈ <span>SENTINEL<small>AI SECURITY LAB</small></span></a>
      <button className="new-chat" disabled={busy} onClick={()=>{setMessages([]);setRag([]);setError('');setInput('');}}>＋ New conversation</button>
      <div className="nav-active">◉ &nbsp; Research workspace</div>
      <div className="sidebar-label">KNOWLEDGE BASE</div><div className="collection">▤ &nbsp; Security policies<small>4 fictional reference documents</small></div>
      <div className="sidebar-bottom"><span className="dot"/> Container workspace<small>Credentials stay on the server</small></div>
    </aside>
    <main><header><div>Workspace <span>/</span> <strong>Security assistant</strong></div><div className="mode"><span className="dot"/>{status ? status.mode === 'demo' ? 'Demo mode' : status.configured ? 'Azure configured' : 'Setup required' : 'Connecting'}</div></header>
      <div className="conversation">
        {!messages.length && <section className="welcome"><div className="eyebrow">YOUR AI SECURITY WORKSPACE</div><h1>Explore. Investigate.<br/><span>Understand the risk.</span></h1><p>Ask questions grounded in fictional security policies.<br/>A small, observable starting point for your monitoring lab.</p><div className="suggestions">{suggestions.map((s,i)=><button key={s} disabled={busy} onClick={()=>send(s)}><span>0{i+1}</span>{s}<b>↗</b></button>)}</div></section>}
        {messages.map((m,i)=><article className={`message ${m.role}`} key={i}><div className="avatar">{m.role==='user'?'U':'◈'}</div><div className="message-body"><div className="message-label">{m.role==='user'?'You':'Sentinel'}<small>{m.role==='assistant'?'SECURITY ASSISTANT':''}</small></div><div className="message-text">{m.content}</div>{m.sources?.length>0 && <div className="sources">{m.sources.map(s=><span key={s.id}>▤ {s.title}</span>)}</div>}</div></article>)}
        {busy && <div className="thinking" role="status">◈ &nbsp; Retrieving context and preparing a response…</div>}<div ref={end}/>
      </div>
      <div className="composer-wrap">{error && <div className="error" role="alert">{error}</div>}<form className="composer" onSubmit={e=>{e.preventDefault();send(input);}}><textarea aria-label="Message" placeholder="Ask about access policies, data handling, or incident response…" value={input} maxLength={6000} disabled={busy} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send(input);}}}/><button aria-label="Send message" disabled={busy||!input.trim()}>↑</button></form><div className="composer-note">{status?.mode==='demo'?'Demo responses · no Azure tokens used':'Azure OpenAI · server-side connection'} <span>Enter to send · Shift + Enter for a new line</span></div></div>
    </main>
    <aside className="context"><div className="sidebar-label">SESSION CONTEXT</div><h3>Grounded in your policies</h3><p>Lightweight keyword retrieval over a fictional knowledge base.</p><div className="context-card"><span>RETRIEVED SOURCES</span><strong>{rag.length.toString().padStart(2,'0')}</strong><small>For the latest response</small></div>{rag.map(s=><div className="source-detail" key={s.id}>▤ {s.title}<small>{s.classification}</small></div>)}<div className="context-footer">LOCAL-FIRST LAB<p>No real tools are executed. Chat history stays in this browser tab until you reset or reload.</p></div></aside>
  </div>;
}
