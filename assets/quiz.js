/* Quizloop engine: funnel data model, templates, share-link encoding, the quiz player and tracking.
   Used by the builder (app.html), the live funnel page (f.html) and the landing page demo. */
(function () {
  const uid = () => Math.random().toString(36).slice(2, 9);

  // ---------- templates (original example content; every field is editable in the builder) ----------
  const TEMPLATES = {
    skincare: {
      label: 'Product finder', blurb: 'Recommend the right product for each shopper.',
      funnel: {
        name: 'Skin type finder', theme: { accent: '#e2557a', mode: 'light' },
        intro: { kicker: '60-second skin quiz', title: 'Find the routine your skin actually wants', subtitle: 'Answer 4 quick questions and get a routine matched to your skin type.', button: 'Start the quiz' },
        outcomes: [
          { key: 'dry', title: 'Thirsty skin', description: 'Your skin loses moisture fast and feels tight by midday. A rich cream and a gentle, non-foaming cleanser will make the biggest difference.', price: '$34', ctaText: 'Get the Hydration Set', ctaUrl: 'https://example.com/hydration-set' },
          { key: 'oily', title: 'Shine-prone skin', description: 'Your skin makes plenty of oil, especially across the T-zone. A light gel moisturiser and a weekly clay mask keep things balanced without stripping.', price: '$29', ctaText: 'Get the Balance Set', ctaUrl: 'https://example.com/balance-set' },
          { key: 'combo', title: 'Combination skin', description: 'Oily in some places, dry in others. A two-zone routine works best: lighter products on the T-zone, richer care on the cheeks.', price: '$39', ctaText: 'Get the Two-Zone Set', ctaUrl: 'https://example.com/two-zone-set' },
        ],
        questions: [
          { text: 'How does your skin feel an hour after washing?', answers: [['Tight, a bit uncomfortable', 'dry'], ['Already a little shiny', 'oily'], ['Shiny nose, dry cheeks', 'combo']] },
          { text: 'How often do you get breakouts?', answers: [['Rarely', 'dry'], ['Often', 'oily'], ['Now and then, mostly on my T-zone', 'combo']] },
          { text: 'What does your foundation do by evening?', answers: [['Looks patchy or flaky', 'dry'], ['Slides off with the shine', 'oily'], ['Holds on my cheeks, fades on my nose', 'combo']] },
          { text: 'Your biggest skin goal right now?', answers: [['More comfort and glow', 'dry'], ['Less shine, clearer pores', 'oily'], ['Everything evened out', 'combo']] },
        ],
        capture: { enabled: true, title: 'Where should we send your routine?', subtitle: 'Get your results plus a 10% code by email.', button: 'Show my results', required: false },
      },
    },
    coach: {
      label: 'Lead quiz for coaches', blurb: 'Qualify leads and book calls.',
      funnel: {
        name: 'Fitness level check', theme: { accent: '#1fb58f', mode: 'dark' },
        intro: { kicker: 'Free 2-minute assessment', title: 'Which training plan fits your life right now?', subtitle: 'Five questions. A plan you can actually stick to.', button: 'Take the assessment' },
        outcomes: [
          { key: 'start', title: 'The Fresh Start', description: 'You are building the habit, so short sessions win. Three 25-minute workouts a week will build momentum without burning you out.', price: 'Free call', ctaText: 'Book a free planning call', ctaUrl: 'https://example.com/book' },
          { key: 'build', title: 'The Builder', description: 'You have consistency. Now you need structure: progressive strength work four days a week with one long conditioning day.', price: '$49/mo', ctaText: 'Start the Builder plan', ctaUrl: 'https://example.com/builder' },
          { key: 'peak', title: 'The Performer', description: 'You train hard and want measurable progress. Periodised blocks, tracked lifts and weekly check-ins will break your plateau.', price: '$99/mo', ctaText: 'Apply for 1:1 coaching', ctaUrl: 'https://example.com/apply' },
        ],
        questions: [
          { text: 'How many days did you train last week?', answers: [['0–1', 'start'], ['2–3', 'build'], ['4 or more', 'peak']] },
          { text: 'How long can you train per session?', answers: [['20–30 minutes', 'start'], ['45 minutes', 'build'], ['An hour or more', 'peak']] },
          { text: 'What usually stops you?', answers: [['Getting started at all', 'start'], ['Not knowing what to do next', 'build'], ['Hitting a plateau', 'peak']] },
          { text: 'Where do you train?', answers: [['At home', 'start'], ['A regular gym', 'build'], ['Gym plus sport or events', 'peak']] },
          { text: 'How do you want to feel in 90 days?', answers: [['Like exercise is normal for me', 'start'], ['Visibly stronger', 'build'], ['At my best ever', 'peak']] },
        ],
        capture: { enabled: true, title: 'Get your plan', subtitle: 'Enter your email and we will send the full plan for your result.', button: 'See my plan', required: true },
      },
    },
    saas: {
      label: 'Plan picker', blurb: 'Point visitors to the right pricing plan.',
      funnel: {
        name: 'Which plan fits you?', theme: { accent: '#ff4d2e', mode: 'light' },
        intro: { kicker: 'Not sure which plan?', title: 'Find your plan in 30 seconds', subtitle: 'Three questions and we will point you to the right one.', button: 'Find my plan' },
        outcomes: [
          { key: 'solo', title: 'Starter', description: 'Perfect for running your first funnels on your own. Everything you need, nothing you don’t.', price: '$29/mo', ctaText: 'Start with Starter', ctaUrl: 'https://example.com/starter' },
          { key: 'team', title: 'Pro', description: 'For growing brands running ads every week: unlimited funnels, full ad tracking and A/B tests.', price: '$79/mo', ctaText: 'Go Pro', ctaUrl: 'https://example.com/pro' },
          { key: 'agency', title: 'Agency', description: 'Client workspaces, white-label funnels and reporting you can send straight to clients.', price: '$199/mo', ctaText: 'Talk to us', ctaUrl: 'https://example.com/agency' },
        ],
        questions: [
          { text: 'Who are the funnels for?', answers: [['My own business', 'solo'], ['My company’s brands', 'team'], ['My clients', 'agency']] },
          { text: 'How much do you spend on ads per month?', answers: [['Under $1k', 'solo'], ['$1k–$20k', 'team'], ['$20k+', 'agency']] },
          { text: 'How many people will build funnels?', answers: [['Just me', 'solo'], ['2–5', 'team'], ['A whole team', 'agency']] },
        ],
        capture: { enabled: false, title: 'Where should we send this?', subtitle: '', button: 'See my plan', required: false },
      },
    },
  };

  // build a full funnel object from a template (fresh ids so copies never collide)
  function fromTemplate(key) {
    const t = JSON.parse(JSON.stringify(TEMPLATES[key].funnel));
    const keyToId = {};
    const outcomes = t.outcomes.map(o => { const id = uid(); keyToId[o.key] = id; const { key: _, ...rest } = o; return { id, ...rest }; });
    return {
      id: uid(), version: 1, updated: Date.now(),
      name: t.name, theme: t.theme, intro: t.intro, capture: t.capture, outcomes,
      questions: t.questions.map(q => ({ id: uid(), text: q.text, answers: q.answers.map(([text, k]) => ({ id: uid(), text, outcome: keyToId[k] || '' })) })),
      tracking: { pixelId: '', webhook: '' },
    };
  }
  function blankFunnel() {
    const f = fromTemplate('saas');
    f.name = 'Untitled funnel';
    return f;
  }

  // ---------- share links: the whole funnel travels in the URL hash, compressed ----------
  const b64url = bytes => { let s = ''; for (const b of bytes) s += String.fromCharCode(b); return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); };
  const unb64url = str => { const s = atob(str.replace(/-/g, '+').replace(/_/g, '/')); return Uint8Array.from(s, c => c.charCodeAt(0)); };
  async function encode(funnel) {
    const { id, updated, ...pub } = funnel;
    const json = new TextEncoder().encode(JSON.stringify(pub));
    if (typeof CompressionStream === 'function') {
      const buf = await new Response(new Blob([json]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer();
      return 'z' + b64url(new Uint8Array(buf));
    }
    return 'j' + b64url(json);
  }
  async function decode(str) {
    const kind = str[0], bytes = unb64url(str.slice(1));
    let json = bytes;
    if (kind === 'z') json = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
    return JSON.parse(new TextDecoder().decode(json));
  }

  // ---------- tracking for live funnels ----------
  function loadPixel(pixelId) {
    if (!/^\d{6,20}$/.test(pixelId || '') || window.fbq) return;
    /* Meta's standard Pixel loader */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
  // which of our events map to Meta standard events (so ads can optimise for them)
  const STANDARD = { quiz_complete: 'CompleteRegistration', lead: 'Lead', offer_click: 'InitiateCheckout' };
  function trackLive(funnel, name, data) {
    if (window.fbq) {
      if (STANDARD[name]) window.fbq('track', STANDARD[name], data);
      window.fbq('trackCustom', 'Quiz_' + name, data);
    }
  }
  function sendWebhook(url, payload) {
    if (!/^https:\/\//.test(url || '')) return;
    try { fetch(url, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(payload) }); } catch (e) { /* lead delivery is best effort */ }
  }

  // ---------- the player ----------
  const CSS = `
  .qlp{--a:#ff4d2e;--bg:#fff;--fg:#16181d;--mut:#6b6f7a;--card:#f4f3ef;--line:#e4e2db;font-family:"Figtree",system-ui,sans-serif;background:var(--bg);color:var(--fg);min-height:100%;display:flex;flex-direction:column;box-sizing:border-box;padding:22px 20px 26px;}
  .qlp.dark{--bg:#121417;--fg:#f2f1ed;--mut:#9aa0aa;--card:#1d2026;--line:#2b2f37;}
  .qlp *{box-sizing:border-box}
  .qlp-bar{height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin-bottom:22px}
  .qlp-bar i{display:block;height:100%;background:var(--a);transition:width .35s ease}
  .qlp-body{flex:1;display:flex;flex-direction:column;justify-content:center;gap:16px;animation:qlpIn .35s ease}
  @keyframes qlpIn{from{opacity:0;transform:translateY(8px)}}
  .qlp-kicker{font-size:.78rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--a)}
  .qlp h1,.qlp h2{font-family:"Bricolage Grotesque","Figtree",system-ui,sans-serif;margin:0;line-height:1.08;letter-spacing:-.02em;text-wrap:balance}
  .qlp h1{font-size:clamp(1.7rem,6.4vw,2.3rem)}
  .qlp h2{font-size:clamp(1.3rem,5vw,1.65rem)}
  .qlp p{margin:0;color:var(--mut);line-height:1.5}
  .qlp-step{font-size:.8rem;color:var(--mut);font-weight:600}
  .qlp-answers{display:flex;flex-direction:column;gap:10px}
  .qlp-ans{display:flex;align-items:center;gap:12px;text-align:left;width:100%;padding:15px 16px;border-radius:14px;border:1.5px solid var(--line);background:var(--card);color:var(--fg);font:600 1rem "Figtree",system-ui,sans-serif;cursor:pointer;transition:border-color .15s,transform .1s}
  .qlp-ans:hover{border-color:var(--a)}
  .qlp-ans:active{transform:scale(.99)}
  .qlp-ans.sel{border-color:var(--a);background:color-mix(in srgb,var(--a) 12%,var(--card))}
  .qlp-ans b{flex:0 0 26px;height:26px;border-radius:8px;display:grid;place-items:center;font-size:.8rem;background:var(--bg);color:var(--mut);border:1px solid var(--line)}
  .qlp-btn{width:100%;padding:16px;border:0;border-radius:14px;background:var(--a);color:#fff;font:700 1.05rem "Figtree",system-ui,sans-serif;cursor:pointer;text-decoration:none;text-align:center;display:block;box-shadow:0 6px 18px -8px var(--a)}
  .qlp-btn:focus-visible,.qlp-ans:focus-visible,.qlp-in:focus-visible{outline:3px solid color-mix(in srgb,var(--a) 50%,transparent);outline-offset:2px}
  .qlp-in{width:100%;padding:15px 16px;border-radius:14px;border:1.5px solid var(--line);background:var(--card);color:var(--fg);font:500 1rem "Figtree",system-ui,sans-serif}
  .qlp-skip{background:none;border:0;color:var(--mut);font:600 .9rem "Figtree",system-ui,sans-serif;cursor:pointer;text-decoration:underline;padding:6px}
  .qlp-result{background:var(--card);border:1.5px solid var(--line);border-radius:18px;padding:20px;display:flex;flex-direction:column;gap:12px}
  .qlp-price{font-family:"Bricolage Grotesque",system-ui,sans-serif;font-weight:700;font-size:1.4rem;color:var(--fg)}
  .qlp-err{color:#d33;font-size:.85rem;min-height:1.2em}
  .qlp-foot{margin-top:18px;text-align:center;font-size:.72rem;color:var(--mut)}
  .qlp-foot a{color:inherit}
  `;
  function injectCss() { if (document.getElementById('qlp-css')) return; const s = document.createElement('style'); s.id = 'qlp-css'; s.textContent = CSS; document.head.appendChild(s); }
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  // mount(container, funnel, { onEvent(name, data), badge: bool }) -> { destroy }
  function mount(root, funnel, opts = {}) {
    injectCss();
    const emit = (name, data = {}) => { try { opts.onEvent && opts.onEvent(name, data); } catch (e) { /* never let tracking break the quiz */ } };
    const wrap = el('div', 'qlp' + (funnel.theme && funnel.theme.mode === 'dark' ? ' dark' : ''));
    wrap.style.setProperty('--a', (funnel.theme && funnel.theme.accent) || '#ff4d2e');
    root.innerHTML = ''; root.appendChild(wrap);
    const qs = funnel.questions || [], outs = funnel.outcomes || [];
    const total = qs.length + (funnel.capture && funnel.capture.enabled ? 1 : 0) + 1;
    let step = -1, picks = [], email = '';

    function frame(progress) {
      wrap.innerHTML = '';
      if (progress != null) { const bar = el('div', 'qlp-bar'), i = el('i'); i.style.width = Math.round(progress * 100) + '%'; bar.appendChild(i); wrap.appendChild(bar); }
      const body = el('div', 'qlp-body'); wrap.appendChild(body);
      if (opts.badge !== false) { const f = el('div', 'qlp-foot'); f.innerHTML = 'Made with <a href="https://patricknerbas.github.io/random/" target="_blank" rel="noopener">Quizloop</a>'; wrap.appendChild(f); }
      return body;
    }

    function intro() {
      const b = frame(null), it = funnel.intro || {};
      if (it.kicker) b.appendChild(el('div', 'qlp-kicker', it.kicker));
      b.appendChild(el('h1', '', it.title || 'Untitled quiz'));
      if (it.subtitle) b.appendChild(el('p', '', it.subtitle));
      const go = el('button', 'qlp-btn', it.button || 'Start'); go.type = 'button';
      go.onclick = () => { emit('quiz_start'); step = 0; question(); };
      b.appendChild(go);
      emit('view');
    }

    function question() {
      if (!qs.length) return after();
      const q = qs[step], b = frame((step + 1) / total);
      b.appendChild(el('div', 'qlp-step', `Question ${step + 1} of ${qs.length}`));
      b.appendChild(el('h2', '', q.text || 'Untitled question'));
      const list = el('div', 'qlp-answers');
      (q.answers || []).forEach((a, i) => {
        const btn = el('button', 'qlp-ans'); btn.type = 'button';
        btn.appendChild(el('b', '', String.fromCharCode(65 + i))); btn.appendChild(el('span', '', a.text || '…'));
        btn.onclick = () => {
          btn.classList.add('sel'); picks[step] = a;
          emit('answer', { question: step + 1, answer: a.text });
          setTimeout(() => { step++; step < qs.length ? question() : after(); }, 220);
        };
        list.appendChild(btn);
      });
      b.appendChild(list);
      if (step > 0) { const back = el('button', 'qlp-skip', '← Back'); back.type = 'button'; back.onclick = () => { step--; question(); }; b.appendChild(back); }
    }

    function scored() {
      const tally = {}; outs.forEach(o => tally[o.id] = 0);
      picks.forEach(a => { if (a && a.outcome in tally) tally[a.outcome]++; });
      let best = outs[0]; for (const o of outs) if (tally[o.id] > tally[best.id]) best = o;
      return best;
    }

    function after() {
      emit('quiz_complete', { result: (scored() || {}).title || '' });
      if (funnel.capture && funnel.capture.enabled) capture(); else result();
    }

    function capture() {
      const c = funnel.capture, b = frame((total - 1) / total);
      b.appendChild(el('h2', '', c.title || 'Where should we send your result?'));
      if (c.subtitle) b.appendChild(el('p', '', c.subtitle));
      const form = el('form'); form.style.cssText = 'display:flex;flex-direction:column;gap:10px';
      const inp = el('input', 'qlp-in'); inp.type = 'email'; inp.placeholder = 'you@email.com'; inp.autocomplete = 'email'; inp.required = !!c.required; inp.setAttribute('aria-label', 'Email');
      const err = el('div', 'qlp-err'), btn = el('button', 'qlp-btn', c.button || 'Show my result'); btn.type = 'submit';
      form.append(inp, err, btn);
      form.onsubmit = e => {
        e.preventDefault();
        const v = inp.value.trim();
        if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { err.textContent = 'That email doesn’t look right.'; return; }
        if (!v && c.required) { err.textContent = 'Enter your email to see your result.'; return; }
        email = v; if (v) emit('lead', { email: v, result: (scored() || {}).title || '' });
        result();
      };
      b.appendChild(form);
      if (!c.required) { const skip = el('button', 'qlp-skip', 'Skip and show my result'); skip.type = 'button'; skip.onclick = () => result(); b.appendChild(skip); }
      setTimeout(() => inp.focus({ preventScroll: true }), 50);
    }

    function result() {
      const o = scored() || { title: 'Your result', description: '' }, b = frame(1);
      b.appendChild(el('div', 'qlp-kicker', 'Your result'));
      const card = el('div', 'qlp-result');
      card.appendChild(el('h2', '', o.title));
      if (o.description) card.appendChild(el('p', '', o.description));
      if (o.price) card.appendChild(el('div', 'qlp-price', o.price));
      if (o.ctaText) {
        const a = el('a', 'qlp-btn', o.ctaText);
        a.href = /^https?:\/\//.test(o.ctaUrl || '') ? o.ctaUrl : '#'; a.target = '_top'; a.rel = 'noopener';
        a.onclick = e => { emit('offer_click', { result: o.title, url: o.ctaUrl || '' }); if (opts.preview) e.preventDefault(); };
        card.appendChild(a);
      }
      b.appendChild(card);
      const again = el('button', 'qlp-skip', 'Retake the quiz'); again.type = 'button'; again.onclick = () => { picks = []; step = -1; intro(); };
      b.appendChild(again);
      emit('result_view', { result: o.title, email: email || undefined, answers: picks.map(p => p && p.text) });
    }

    intro();
    return { destroy() { root.innerHTML = ''; } };
  }

  window.Quizloop = { TEMPLATES, fromTemplate, blankFunnel, encode, decode, mount, loadPixel, trackLive, sendWebhook, STANDARD, uid };
})();
