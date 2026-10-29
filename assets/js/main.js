/* =========================================================
   CYSCOMP — interacções comuns a todas as páginas
   ========================================================= */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.CYS = window.CYS || {};

  /* ---------- Scroll suave (Lenis) ---------- */
  if (window.Lenis && !reduce) {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.2), smoothWheel: true });
    CYS.lenis = lenis;
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const t = document.querySelector(url.hash);
      if (t) { e.preventDefault(); lenis.scrollTo(t, { offset: -80 }); history.replaceState(null, '', url.hash); }
    });
  }

  /* ---------- Loader ---------- */
  const loader = $('#loader');
  if (loader) {
    const hide = () => setTimeout(() => loader.classList.add('is-done'), 250);
    document.addEventListener('cys:hero-ready', hide, { once: true });
    setTimeout(hide, 3500);
  }

  /* ---------- Navegação ---------- */
  const nav = $('#nav');
  const burger = $('.nav__burger');
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('.nav__links a').forEach((a) => a.addEventListener('click', () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); }));
  const secure = $('#secure');
  if (location.protocol !== 'https:' && !/^(localhost|127\.)/.test(location.hostname)) {
    secure.classList.add('is-off'); $('.secure__txt', secure).textContent = 'Ligação não cifrada';
  }

  /* ---------- Intro: actos sincronizados com o scroll ---------- */
  const intro = $('#intro');
  const acts = intro ? $$('.act', intro) : [];
  const pct = $('#introPct');
  const FADE = 0.05;
  function onScroll() {
    nav.classList.toggle('is-solid', window.scrollY > 40 || !intro);
    if (!intro) return;
    const r = intro.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - window.innerHeight));
    intro.style.setProperty('--p', p.toFixed(4));
    intro.style.setProperty('--shade', clamp((p - 0.74) / 0.12).toFixed(3));
    if (pct) pct.textContent = String(Math.round(p * 100)).padStart(2, '0');
    acts.forEach((el) => {
      const a = parseFloat(el.dataset.in), b = parseFloat(el.dataset.out);
      const o = Math.min(clamp((p - a) / FADE), clamp((b - p) / FADE));
      el.style.opacity = o.toFixed(3);
      el.style.transform = `translate3d(0, ${((1 - o) * (p < a + FADE ? 28 : -28)).toFixed(1)}px, 0)`;
      el.classList.toggle('is-on', o > 0.01);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Reveal + contagens ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      $$('[data-count]', e.target).concat(e.target.matches('[data-count]') ? [e.target] : []).forEach(countUp);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  CYS.reveal = (root = document) => $$('.reveal:not(.is-in)', root).forEach((el) => {
    const sib = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(sib.indexOf(el), 6) * 70}ms`;
    io.observe(el);
  });
  function countUp(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    const end = parseInt(el.dataset.count, 10), t0 = performance.now(), dur = reduce ? 1 : 1600;
    const step = (t) => {
      const k = clamp((t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - k, 4)));
      el.textContent = String(v).padStart(String(end).length, '0');
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Relógio de Luanda ---------- */
  const clock = $('#clock');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('pt-PT', { timeZone: 'Africa/Luanda', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick(); setInterval(tick, 1000);
  }

  /* ---------- Sectores (separadores) ---------- */
  const tabs = $$('.sectors__tabs [role="tab"]');
  const panels = $$('.sectors__panels .panel');
  if (tabs.length) {
    const select = (i, focus) => {
      tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
      panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    select(0);
  }

  /* ---------- Luz sob o cursor nos cartões ---------- */
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`);
    c.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  /* ---------- Consola do SOC (simulação ilustrativa) ---------- */
  const feed = $('#feed');
  if (feed) {
    const events = [
      ['crit', 'EDR', 'Tentativa de execução de ransomware bloqueada', 'contido'],
      ['high', 'SIEM', 'Login anómalo · conta privilegiada · fora de horário', 'em análise'],
      ['med', 'IDS', 'Varrimento de portas a partir de IP externo', 'bloqueado'],
      ['ok', 'SOC', 'Playbook de phishing executado', 'fechado'],
      ['high', 'EMAIL', 'Campanha de phishing dirigida à direcção financeira', 'quarentena'],
      ['med', 'WAF', 'Injecção SQL em portal público', 'bloqueado'],
      ['crit', 'NDR', 'Comunicação com servidor C2 conhecido', 'isolado'],
      ['ok', 'VULN', 'Patch crítico aplicado e verificado por re-scan', 'verificado'],
      ['med', 'IAM', 'Múltiplas falhas de MFA · utilizador remoto', 'notificado'],
      ['high', 'OT', 'Alteração não autorizada em controlador SCADA', 'escalado'],
      ['ok', 'INTEL', 'Indicadores de compromisso actualizados', 'aplicado'],
      ['med', 'DLP', 'Envio de ficheiro sensível para domínio externo', 'travado']
    ];
    const label = { crit: 'CRÍTICO', high: 'ALTO', med: 'MÉDIO', ok: 'OK' };
    const tfmt = new Intl.DateTimeFormat('pt-PT', { timeZone: 'Africa/Luanda', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    let k = 0;
    const push = () => {
      const [lv, src, msg, st] = events[k++ % events.length];
      const ln = document.createElement('div');
      ln.className = 'ln';
      ln.innerHTML = `<span class="t">${tfmt.format(new Date())}</span>  <span class="lv lv--${lv}">${label[lv]}</span> ${src.padEnd(5, ' ')} · ${msg} <span class="t">→ ${st}</span>`;
      feed.appendChild(ln);
      while (feed.children.length > 20) feed.firstChild.remove();
    };
    for (let i = 0; i < 10; i++) push();
    if (!reduce) setInterval(push, 1800);
  }

  /* ---------- Grelhas de logótipos ---------- */
  const tile = (o, key) => `<figure class="logo-tile${key ? ' logo-tile--key' : ''}"><img src="assets/img/logos/${o.logo}.png" alt="${o.nome}" loading="lazy">${o.nota ? `<figcaption>${o.nota}</figcaption>` : ''}</figure>`;
  const lp = $('#logos-parceiros'), lc = $('#logos-clientes');
  if (lp && CYS.parceiros) lp.innerHTML = CYS.parceiros.map((o, i) => tile(o, i < 2)).join('');
  if (lc && CYS.clientes) lc.innerHTML = CYS.clientes.map((o) => tile(o)).join('');

  /* ---------- Notícias (cartões) ---------- */
  CYS.postCard = (n, feature) => `
    <a class="post${feature ? ' post--feature' : ''} reveal" href="noticias.html?n=${n.id}">
      <div class="post__img"><img src="${n.img}" alt="" loading="lazy"><span class="tag">${n.tag}</span></div>
      <div>
        <div class="post__meta">${CYS.fmtData(n.data)}</div>
        <h3>${n.titulo}</h3>
        <p style="margin-top:10px">${n.resumo}</p>
      </div>
    </a>`;
  const hn = $('#home-news');
  if (hn && CYS.noticias) hn.innerHTML = [...CYS.noticias].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 3).map((n) => CYS.postCard(n)).join('');

  /* ---------- Selos de certificação (faixa contínua) ---------- */
  const bt = $('#badges');
  if (bt && CYS.cursos) {
    const imgs = CYS.cursos.filter((c) => c.img).map((c) => `<img src="${c.img}" alt="${c.sigla} — ${c.nome}" loading="lazy">`).join('');
    bt.innerHTML = `<div class="badges__track">${imgs}</div><div class="badges__track" aria-hidden="true">${imgs}</div>`;
  }

  /* ---------- Formulário de contacto (API; email como alternativa sem ligação) ---------- */
  const cform = $('#form');
  if (cform) cform.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cform.checkValidity()) { cform.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(cform));
    const btn = $('button[type="submit"]', cform), note = $('.form__note', cform);
    if (window.CYS_CONTACT_ENDPOINT) {
      btn.disabled = true; btn.textContent = 'A enviar…';
      try {
        const r = await fetch(window.CYS_CONTACT_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.ok) {
          cform.innerHTML = '<div class="success"><div class="success__ico">✓</div><h2 style="margin:0 0 8px;font-size:26px;font-weight:500">Pedido recebido</h2><p>Um especialista da CYSCOMP vai contactá-lo brevemente. Em caso de incidente em curso, ligue +244 938 447 195.</p></div>';
          return;
        }
        note.textContent = j.erro || 'Não foi possível enviar. Tente novamente.';
        btn.disabled = false; btn.innerHTML = 'Pedir contacto confidencial <span class="btn__arrow">→</span>';
        return;
      } catch (err) { btn.disabled = false; btn.innerHTML = 'Pedir contacto confidencial <span class="btn__arrow">→</span>'; }
    }
    const body = `Nome: ${d.nome}\nEmpresa: ${d.empresa}\nEmail: ${d.email}\nTelefone: ${d.telefone || ''}\nSector: ${d.sector}\n\n${d.mensagem || ''}`;
    location.href = `mailto:comercial@cyscomp.co.ao?subject=${encodeURIComponent('Pedido de contacto — ' + d.empresa)}&body=${encodeURIComponent(body)}`;
  });

  /* ---------- Verificação rápida (home) ---------- */
  const vq = $('#verify-quick');
  if (vq) vq.addEventListener('submit', (e) => {
    e.preventDefault();
    const c = new FormData(vq).get('c').trim();
    location.href = `verificar.html${c ? '?c=' + encodeURIComponent(c) : ''}`;
  });

  CYS.reveal();
})();
