/* =========================================================
   CYSCOMP — intro cinematográfica: sequência de frames do
   escudo controlada pelo scroll, com mistura entre frames
   para máxima fluidez. O logótipo oficial (vector) é aplicado
   sobre o medalhão do escudo, seguindo a sua posição frame a
   frame, para ficar sempre nítido e sem distorção.
   Dados da sequência: assets/seq/seq.js (gerado por _gen/frames.py)
   ========================================================= */
(function () {
  const cv = document.getElementById('hero-canvas');
  const intro = document.getElementById('intro');
  if (!cv || !intro) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  let seq = null, frames = [], mobile = false, W = 0, H = 0, DPR = 1;
  let target = 0, shown = 0, last = performance.now(), dirty = true;
  const mark = new Image();
  mark.src = 'assets/img/brand/cyscomp-mark.svg';

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    const m = W < 760;
    if (seq && m !== mobile) { mobile = m; load(); }
    mobile = m; dirty = true;
  }

  function src(i) {
    const s = mobile ? seq.m : seq.d;
    return `${s.dir}/f${String(i).padStart(4, '0')}.${seq.ext}`;
  }

  // carrega por passes (1 em 8, depois 1 em 4, 2, 1): a animação fica utilizável muito cedo
  function load() {
    frames = new Array(seq.count);
    const order = [];
    [8, 4, 2, 1].forEach((step) => { for (let i = 0; i < seq.count; i += step) if (!order.includes(i)) order.push(i); });
    let k = 0, active = 0;
    const next = () => {
      while (active < 6 && k < order.length) {
        const i = order[k++]; active++;
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => { frames[i] = img; active--; dirty = true; if (i === 0) document.dispatchEvent(new Event('cys:hero-ready')); next(); };
        img.onerror = () => { active--; next(); };
        img.src = src(i);
      }
    };
    next();
  }

  function nearest(i) {
    if (frames[i]) return i;
    for (let d = 1; d < 16; d++) { if (frames[i - d]) return i - d; if (frames[i + d]) return i + d; }
    return -1;
  }

  // enquadramento "cover" com ponto focal
  function rect(img) {
    const iw = img.naturalWidth, ih = img.naturalHeight;
    const s = Math.max(W / iw, H / ih);
    const dw = iw * s, dh = ih * s;
    return { x: (W - dw) / 2, y: (H - dh) / 2, w: dw, h: dh };
  }

  function draw() {
    const fpos = shown * (seq.count - 1);
    const i0 = Math.floor(fpos), t = fpos - i0;
    const a = nearest(i0); if (a < 0) return;
    const b = nearest(Math.min(seq.count - 1, i0 + 1));
    const r = rect(frames[a]);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.globalAlpha = 1;
    ctx.drawImage(frames[a], r.x, r.y, r.w, r.h);
    if (b >= 0 && b !== a && t > 0.01) { ctx.globalAlpha = t; ctx.drawImage(frames[b], r.x, r.y, r.w, r.h); ctx.globalAlpha = 1; }

    // logótipo sobre o medalhão (posição interpolada entre frames)
    const tr = (mobile ? seq.m : seq.d).track;
    const A = tr[i0], B = tr[Math.min(seq.count - 1, i0 + 1)] || A;
    if (A && A[3] > 0.01 && mark.complete) {
      const L = (k) => A[k] + (B[k] - A[k]) * t;
      const x = r.x + L(0) * r.w, y = r.y + L(1) * r.h, rad = L(2) * r.w, op = L(3);
      const size = rad * 1.8;
      ctx.save();
      ctx.globalAlpha = op;
      ctx.shadowColor = 'rgba(255, 70, 150, 0.55)';
      ctx.shadowBlur = rad * 0.35;
      ctx.drawImage(mark, x - size / 2, y - size / 2, size, size * (638 / 636));
      ctx.restore();
    }
  }

  function progress() {
    const r = intro.getBoundingClientRect();
    return clamp(-r.top / (r.height - H));
  }

  function loop(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    // a sequência ocupa os primeiros 90% da intro; o resto é a pausa na mensagem
    target = clamp(progress() / 0.9);
    const k = reduce ? 1 : 1 - Math.exp(-dt * 7);
    const prev = shown;
    shown += (target - shown) * k;
    if (Math.abs(shown - prev) > 0.00005 || dirty) { draw(); dirty = false; }
    // a intro desvanece quando a página segue para o conteúdo
    const after = intro.getBoundingClientRect().bottom / H;
    cv.style.opacity = String(clamp(after * 1.6 - 0.15));
    requestAnimationFrame(loop);
  }

  if (window.CYS_SEQ) { seq = window.CYS_SEQ; resize(); load(); requestAnimationFrame(loop); }
  else document.dispatchEvent(new Event('cys:hero-ready'));
  window.addEventListener('resize', resize);
  mark.onload = () => { dirty = true; };
})();
