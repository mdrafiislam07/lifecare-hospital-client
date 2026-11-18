'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Icon from './Icons';
import { SITE } from '@/lib/data';
import { API_URL } from '@/lib/config';

const STORE_KEY = 'lc_chat_v1';
const GREETING = {
  role: 'model', local: true,
  text: 'আসসালামু আলাইকুম! আমি **Life Care Hospital**-এর AI Assistant।\nডাক্তার খুঁজে দেওয়া, অ্যাপয়েন্টমেন্ট নেওয়া, বা হাসপাতালের যেকোনো তথ্য জানতে আমাকে জিজ্ঞেস করুন।'
};
const CHIPS = ['আমার সমস্যার জন্য ডাক্তার খুঁজে দিন', 'অ্যাপয়েন্টমেন্ট নিতে চাই', 'হাসপাতালের সেবাসমূহ', 'অ্যাম্বুলেন্স সার্ভিস'];
const YES = /^(ha+|হ্যাঁ|হ্যা|হা|yes|y|ok|okay|confirm|confirmed|kor(o|un)|book kor(o|un)|thik ache|ঠিক আছে|কনফার্ম)[\s.!।]*$/i;
const NO = /^(na|no|nah|cancel|batil|বাতিল|না)[\s.!।]*$/i;

// Login token (jodi thake) - booking user er account e link korar jonno. Na thakleo guest hishebe kaj kore.
function authToken() {
  try {
    for (const k of ['token', 'marh_token', 'lc_token', 'authToken', 'accessToken']) {
      const v = localStorage.getItem(k);
      if (v && v.split('.').length === 3) return v;
    }
  } catch { /* ignore */ }
  return undefined;
}

// **bold**, [label](/path) ar [label](tel:...) - onno kichu HTML hishebe boshbe na
function Inline({ text }) {
  const parts = String(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\((?:\/(?!\/)[^)\s]*|tel:[+\d-]+)\))/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return <a key={i} href={m[2]}>{m[1]}</a>;
    return <span key={i}>{p}</span>;
  });
}
function Rich({ text }) {
  return String(text).split('\n').map((line, i) => (
    <p key={i}><Inline text={line} /></p>
  ));
}

function DoctorCard({ d, onBook }) {
  return (
    <div className="lcc-doc">
      {d.photo ? <img src={d.photo} alt={d.name} loading="lazy" /> : <div className="lcc-doc-ph">{(d.name || '?').slice(0, 1)}</div>}
      <div className="lcc-doc-b">
        <b>{d.name}</b>
        <span>{[d.designation, d.department].filter(Boolean).join(' · ')}</span>
        {d.degrees ? <small>{d.degrees}</small> : null}
        <small>{[d.days?.length ? d.days.join(', ') : null, d.startTime && `${d.startTime}-${d.endTime}`, d.fee != null && `৳${d.fee}`].filter(Boolean).join(' · ')}</small>
        <button type="button" onClick={() => onBook(d)}>অ্যাপয়েন্টমেন্ট নিন</button>
      </div>
    </div>
  );
}

function BookingCard({ b, onConfirm, onCancel }) {
  const s = b.summary;
  const rows = [
    ['ডাক্তার', s.doctor], ['বিভাগ', s.department], ['তারিখ', `${s.date} (${s.weekday})`], ['সময়', s.time],
    ['রোগী', s.patientName], ['মোবাইল', s.phone], s.age != null && ['বয়স', s.age], s.reason && ['সমস্যা', s.reason], s.fee != null && ['ফি', `৳${s.fee}`]
  ].filter(Boolean);
  return (
    <div className="lcc-book">
      <h4>অ্যাপয়েন্টমেন্ট কনফার্মেশন</h4>
      <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl>
      {b.state === 'done' && <p className="lcc-ok">✅ জমা হয়েছে · সিরিয়াল: <b>{b.serial}</b></p>}
      {b.state === 'cancelled' && <p className="lcc-muted">বাতিল করা হয়েছে</p>}
      {b.state === 'failed' && <p className="lcc-err">{b.error}</p>}
      {(b.state === 'ready' || b.state === 'confirming') && (
        <>
          {b.error && <p className="lcc-err">{b.error}</p>}
          <div className="lcc-book-btns">
            <button type="button" className="lcc-yes" disabled={b.state === 'confirming'} onClick={onConfirm}>{b.state === 'confirming' ? 'অপেক্ষা করুন…' : 'Confirm'}</button>
            <button type="button" className="lcc-no" disabled={b.state === 'confirming'} onClick={onCancel}>বাতিল</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const ref = useRef(messages);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  ref.current = messages;

  useEffect(() => {
    try {
      const s = JSON.parse(sessionStorage.getItem(STORE_KEY) || 'null');
      if (Array.isArray(s) && s.length) setMessages(s);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-40).map((m) => (m.booking?.state === 'confirming' ? { ...m, booking: { ...m.booking, state: 'ready' } } : m))));
    } catch { /* ignore */ }
  }, [messages]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, loading, open]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 50); }, [open]);

  const add = (m) => setMessages((p) => [...p, m]);
  const patch = (idx, b) => setMessages((p) => p.map((m, i) => (i === idx ? { ...m, booking: { ...m.booking, ...b } } : m)));
  const pendingIdx = () => {
    const a = ref.current;
    for (let i = a.length - 1; i >= 0; i--) if (a[i].booking) return a[i].booking.state === 'ready' ? i : -1;
    return -1;
  };

  const confirm = useCallback(async (idx) => {
    const b = ref.current[idx]?.booking;
    if (!b || b.state === 'confirming') return;
    patch(idx, { state: 'confirming', error: undefined });
    try {
      const t = authToken();
      const res = await fetch(`${API_URL}/chat/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
        body: JSON.stringify({ token: b.token })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        patch(idx, { state: 'done', serial: data.item.serial });
        add({ role: 'model', text: `✅ আপনার অ্যাপয়েন্টমেন্ট অনুরোধ জমা হয়েছে।\nসিরিয়াল: **${data.item.serial}** · ${data.item.doctor} · ${data.item.date}, ${data.item.timeSlot}\nহাসপাতাল শীঘ্রই কনফার্ম করবে।` });
      } else if (res.status === 429 || res.status >= 500) {
        patch(idx, { state: 'ready', error: data.message || 'এখন সম্ভব হচ্ছে না, একটু পরে আবার চেষ্টা করুন।' });
      } else {
        patch(idx, { state: 'failed', error: data.message || 'বুকিং করা যায়নি।' });
        add({ role: 'model', text: `${data.message || 'বুকিং করা যায়নি।'}\nচাইলে অন্য সময় বা তারিখ বেছে নিন।` });
      }
    } catch {
      patch(idx, { state: 'ready', error: 'সার্ভারে যোগাযোগ করা যাচ্ছে না। ইন্টারনেট চেক করে আবার চেষ্টা করুন।' });
    }
  }, []);

  const cancel = (idx) => {
    patch(idx, { state: 'cancelled' });
    add({ role: 'model', text: 'ঠিক আছে, বুকিং বাতিল করা হয়েছে। আর কিছু জানতে চান?' });
  };

  const send = async (raw) => {
    const text = String(raw ?? input).trim();
    if (!text || loading) return;
    setInput('');
    const history = ref.current.filter((m) => !m.local && m.text).slice(-10).map(({ role, text: t }) => ({ role, text: t })); // notun message add howar AGE
    const pi = pendingIdx();
    add({ role: 'user', text });

    // Pending card thakle "ha" / "na" likhei confirm/cancel (client e, AI er upor nirbhor na)
    if (pi >= 0 && YES.test(text)) return confirm(pi);
    if (pi >= 0 && NO.test(text)) return cancel(pi);

    setLoading(true);
    try {
      const t = authToken();
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
        body: JSON.stringify({ message: text, history })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || 'এখন উত্তর দিতে পারছি না।');
      add({
        role: 'model', text: data.reply,
        doctors: data.doctors?.length ? data.doctors : undefined,
        booking: data.booking?.token ? { ...data.booking, state: 'ready' } : undefined
      });
    } catch (e) {
      add({ role: 'model', error: true, text: e.message || 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
    } finally {
      setLoading(false);
    }
  };

  const bookDoctor = (d) => send(`${d.name} (${d.department}) এর অ্যাপয়েন্টমেন্ট নিতে চাই`);
  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };
  const reset = () => { setMessages([GREETING]); try { sessionStorage.removeItem(STORE_KEY); } catch { /* ignore */ } };

  return (
    <div className="lcc-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {open && (
        <section className="lcc-panel" role="dialog" aria-label="AI Assistant">
          <header>
            <div><b>Life Care AI Assistant</b><small>চিকিৎসা পরামর্শ নয় · তথ্য ও অ্যাপয়েন্টমেন্ট সহায়তা</small></div>
            <button type="button" onClick={reset} aria-label="নতুন চ্যাট" title="নতুন চ্যাট">↺</button>
            <button type="button" onClick={() => setOpen(false)} aria-label="বন্ধ করুন"><Icon name="x" size={18} /></button>
          </header>
          <div className="lcc-msgs" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`lcc-row ${m.role === 'user' ? 'me' : 'bot'}`}>
                <div className={`lcc-bubble${m.error ? ' err' : ''}`}><Rich text={m.text} /></div>
                {m.doctors?.map((d) => <DoctorCard key={d.id} d={d} onBook={bookDoctor} />)}
                {m.booking && <BookingCard b={m.booking} onConfirm={() => confirm(i)} onCancel={() => cancel(i)} />}
              </div>
            ))}
            {messages.length === 1 && !loading && (
              <div className="lcc-chips">{CHIPS.map((c) => <button key={c} type="button" onClick={() => send(c)}>{c}</button>)}</div>
            )}
            {loading && <div className="lcc-row bot"><div className="lcc-bubble lcc-typing"><i /><i /><i /></div></div>}
            <div ref={endRef} />
          </div>
          <footer>
            <div className="lcc-input">
              <textarea ref={inputRef} rows={1} value={input} maxLength={600} placeholder="আপনার প্রশ্ন লিখুন…" onChange={(e) => setInput(e.target.value)} onKeyDown={onKey} aria-label="মেসেজ" />
              <button type="button" onClick={() => send()} disabled={loading || !input.trim()} aria-label="পাঠান">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.4 20.4 21 12 3.4 3.6 3.3 10l12.6 2-12.6 2z" /></svg>
              </button>
            </div>
            {SITE?.hotline ? <p className="lcc-sos">জরুরি অবস্থায় সরাসরি কল করুন: <a href={`tel:${SITE.hotline}`}>{SITE.hotline}</a></p> : null}
          </footer>
        </section>
      )}
      <button type="button" className="lcc-fab" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="AI Assistant খুলুন">
        {!open && <span className="lcc-fab-l">AI Assistant</span>}
        <span className="lcc-fab-i"><Icon name={open ? 'x' : 'chat'} size={26} /></span>
      </button>
    </div>
  );
}

const CSS = `
.lcc-root{position:fixed;right:18px;bottom:18px;z-index:9999;font-family:inherit;color:#0f172a}
.lcc-fab{display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:#2563eb;color:#fff;border-radius:999px;padding:6px 6px 6px 18px;box-shadow:0 8px 24px rgba(37,99,235,.4);font-weight:600;font-size:14px;margin-left:auto}
.lcc-fab-i{width:48px;height:48px;border-radius:50%;background:#1d4ed8;display:grid;place-items:center}
.lcc-fab:not(:has(.lcc-fab-l)){padding:6px}
.lcc-panel{position:absolute;right:0;bottom:70px;width:min(390px,calc(100vw - 24px));height:min(620px,calc(100dvh - 110px));background:#fff;border-radius:16px;box-shadow:0 12px 48px rgba(15,23,42,.28);display:flex;flex-direction:column;overflow:hidden;border:1px solid #e2e8f0}
.lcc-panel header{display:flex;align-items:center;gap:6px;padding:12px 12px 12px 16px;background:linear-gradient(135deg,#1e40af,#2563eb);color:#fff}
.lcc-panel header>div{flex:1;display:flex;flex-direction:column;min-width:0}
.lcc-panel header small{opacity:.85;font-size:11px;line-height:1.3}
.lcc-panel header button{background:rgba(255,255,255,.15);border:0;color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer;display:grid;place-items:center;font-size:16px}
.lcc-msgs{flex:1;overflow-y:auto;padding:14px;background:#f8fafc;display:flex;flex-direction:column;gap:10px}
.lcc-row{display:flex;flex-direction:column;gap:8px;max-width:92%}
.lcc-row.me{align-self:flex-end;align-items:flex-end}
.lcc-row.bot{align-self:flex-start}
.lcc-bubble{padding:9px 13px;border-radius:14px;font-size:14px;line-height:1.55;word-break:break-word}
.lcc-bubble p{margin:0}.lcc-bubble p+p{margin-top:4px}
.lcc-row.bot .lcc-bubble{background:#fff;border:1px solid #e2e8f0;border-bottom-left-radius:4px}
.lcc-row.me .lcc-bubble{background:#2563eb;color:#fff;border-bottom-right-radius:4px}
.lcc-bubble.err{background:#fef2f2;border-color:#fecaca;color:#991b1b}
.lcc-bubble a{color:#2563eb;text-decoration:underline}.lcc-row.me .lcc-bubble a{color:#fff}
.lcc-typing{display:flex;gap:4px;padding:13px 14px}
.lcc-typing i{width:7px;height:7px;border-radius:50%;background:#94a3b8;animation:lccb 1.1s infinite}
.lcc-typing i:nth-child(2){animation-delay:.15s}.lcc-typing i:nth-child(3){animation-delay:.3s}
@keyframes lccb{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}
.lcc-chips{display:flex;flex-wrap:wrap;gap:8px}
.lcc-chips button{background:#fff;border:1px solid #bfdbfe;color:#1d4ed8;border-radius:999px;padding:7px 12px;font-size:13px;cursor:pointer}
.lcc-chips button:hover{background:#eff6ff}
.lcc-doc{display:flex;gap:10px;background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:10px;width:100%}
.lcc-doc img,.lcc-doc-ph{width:52px;height:52px;border-radius:50%;object-fit:cover;flex:none;background:#dbeafe;color:#1d4ed8;display:grid;place-items:center;font-weight:700}
.lcc-doc-b{display:flex;flex-direction:column;gap:1px;font-size:13px;min-width:0}
.lcc-doc-b span,.lcc-doc-b small{color:#475569}.lcc-doc-b small{font-size:12px}
.lcc-doc-b button{align-self:flex-start;margin-top:6px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:8px;padding:5px 10px;font-size:12px;cursor:pointer}
.lcc-book{background:#fff;border:2px solid #2563eb;border-radius:12px;padding:12px;width:100%;font-size:13px}
.lcc-book h4{margin:0 0 8px;font-size:14px;color:#1e40af}
.lcc-book dl{margin:0;display:grid;gap:4px}.lcc-book dl div{display:flex;gap:8px}
.lcc-book dt{width:64px;color:#64748b;flex:none}.lcc-book dd{margin:0;font-weight:600;word-break:break-word}
.lcc-book-btns{display:flex;gap:8px;margin-top:12px}
.lcc-book-btns button{flex:1;border-radius:8px;padding:9px;font-size:14px;font-weight:600;cursor:pointer;border:1px solid #cbd5e1;background:#fff;color:#334155}
.lcc-book-btns .lcc-yes{background:#16a34a;border-color:#16a34a;color:#fff}
.lcc-book-btns button:disabled{opacity:.6;cursor:wait}
.lcc-ok{color:#15803d;margin:10px 0 0}.lcc-err{color:#b91c1c;margin:8px 0 0}.lcc-muted{color:#64748b;margin:10px 0 0}
.lcc-panel footer{border-top:1px solid #e2e8f0;background:#fff;padding:10px 12px 8px}
.lcc-input{display:flex;gap:8px;align-items:flex-end}
.lcc-input textarea{flex:1;resize:none;border:1px solid #cbd5e1;border-radius:12px;padding:9px 12px;font:inherit;font-size:14px;max-height:96px;outline:none}
.lcc-input textarea:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.15)}
.lcc-input button{width:40px;height:40px;border-radius:50%;border:0;background:#2563eb;color:#fff;cursor:pointer;display:grid;place-items:center;flex:none}
.lcc-input button:disabled{background:#cbd5e1;cursor:not-allowed}
.lcc-sos{margin:6px 2px 0;font-size:11.5px;color:#64748b;text-align:center}.lcc-sos a{color:#dc2626;font-weight:600}
@media (max-width:480px){.lcc-root{right:12px;bottom:12px}.lcc-panel{bottom:66px}}
`;
