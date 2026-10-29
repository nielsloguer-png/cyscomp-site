/* =========================================================
   CYSCOMP — "universo" de fundo: rede viva de nós e pacotes
   de dados em trânsito. Canvas 2D leve, presente em todas as
   páginas, com parallax de scroll e reacção ao cursor.
   ========================================================= */
(function () {
  const cv = document.getElementById('ambient');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, DPR, nodes = [], packets = [], mouse = { x: -9999, y: -9999 };

  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 16000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H * 1.6,
      z: 0.35 + Math.random() * 0.65,                 // profundidade (parallax)
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
      hub: Math.random() < 0.08
    }));
  }

  function spawnPacket(a, b) {
    packets.push({ a, b, t: 0, s: 0.006 + Math.random() * 0.01, hot: Math.random() < 0.18 });
  }

  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
  window.addEventListener('pointermove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('resize', build);
  build();

  const LINK = 150;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    const pos = nodes.map((p) => {
      if (!reduce) { p.x += p.vx; p.y += p.vy; }
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      const span = H * 1.6;
      let y = (p.y - scrollY * 0.12 * p.z) % span; if (y < 0) y += span;
      return { x: p.x, y: y - H * 0.3, z: p.z, hub: p.hub };
    });

    // ligações
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i], b = pos[j];
        const dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < LINK) {
          const near = Math.max(0, 1 - Math.hypot((a.x + b.x) / 2 - mouse.x, (a.y + b.y) / 2 - mouse.y) / 220);
          ctx.strokeStyle = `rgba(150, 90, 255, ${((1 - d / LINK) * 0.16 + near * 0.25) * Math.min(a.z, b.z)})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (!reduce && packets.length < 26 && Math.random() < 0.0009) spawnPacket(i, j);
        }
      }
    }

    // nós
    pos.forEach((p) => {
      const r = p.hub ? 2.2 : 1.1;
      ctx.fillStyle = p.hub ? `rgba(255, 110, 150, ${0.55 * p.z})` : `rgba(190, 160, 255, ${0.5 * p.z})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, r * p.z + 0.3, 0, Math.PI * 2); ctx.fill();
      if (p.hub) {
        ctx.strokeStyle = `rgba(255, 90, 140, ${0.18 * p.z})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 7 * p.z, 0, Math.PI * 2); ctx.stroke();
      }
    });

    // pacotes em trânsito
    packets = packets.filter((k) => {
      k.t += k.s;
      const a = pos[k.a], b = pos[k.b];
      if (!a || !b || k.t >= 1) return false;
      const x = a.x + (b.x - a.x) * k.t, y = a.y + (b.y - a.y) * k.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 6);
      g.addColorStop(0, k.hot ? 'rgba(255,120,70,.95)' : 'rgba(230,140,255,.9)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
      return true;
    });

    if (!document.hidden) requestAnimationFrame(frame);
    else document.addEventListener('visibilitychange', () => requestAnimationFrame(frame), { once: true });
  }
  requestAnimationFrame(frame);
})();
