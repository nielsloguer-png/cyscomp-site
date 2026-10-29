/* =========================================================
   CYSCOMP — cabeçalho e rodapé partilhados por todas as páginas.
   Corre de forma síncrona logo após <body>, para não haver salto.
   ========================================================= */
(function () {
  const page = document.body.dataset.page || 'home';
  const home = page === 'home' ? '' : 'index.html';
  const link = (href, label, key) =>
    `<a href="${href}"${key === page ? ' aria-current="page"' : ''}>${label}</a>`;

  const header = `
<header class="nav" id="nav">
  <div class="wrap nav__inner">
    <a href="index.html" class="brand" aria-label="CYSCOMP — página inicial">
      <img src="assets/img/brand/cyscomp-logo-white.png" alt="CYSCOMP — Cyber Security Company" width="167" height="40">
    </a>
    <nav class="nav__links" aria-label="Principal">
      ${link(home + '#servicos', 'Serviços', 'servicos')}
      ${link('formacoes.html', 'Formações', 'formacoes')}
      ${link(home + '#clientes', 'Clientes', 'clientes')}
      ${link('noticias.html', 'Notícias', 'noticias')}
      ${link('verificar.html', 'Verificar certificado', 'verificar')}
      ${link(home + '#contacto', 'Contacto', 'contacto')}
    </nav>
    <div class="nav__cta">
      <span class="secure mono" id="secure" title="Ligação ao site"><span class="secure__dot"></span><span class="secure__txt">Ligação segura</span></span>
      <a href="inscricao.html" class="btn btn--light btn--sm">Inscrição online</a>
      <button class="nav__burger" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span></button>
    </div>
  </div>
</header>`;

  const footer = `
<footer class="footer">
  <div class="wrap footer__top">
    <div class="footer__brand">
      <img src="assets/img/brand/cyscomp-logo-white.png" alt="CYSCOMP" width="200" height="48">
      <p>Cibersegurança, resposta a incidentes e formação certificada para organizações que não podem parar.</p>
      <div class="footer__seals">
        <span class="seal"><b>1.º</b> Revendedor Autorizado EC-Council em Angola</span>
        <span class="seal">Parceiro CompTIA</span>
      </div>
    </div>
    <div class="footer__cols">
      <div><b>Serviços</b>
        <a href="${home}#servicos">Teste de intrusão</a><a href="${home}#servicos">Análise de vulnerabilidades</a>
        <a href="${home}#servicos">Resposta a incidentes e forense</a><a href="${home}#servicos">Monitorização e SOC</a>
        <a href="${home}#servicos">Consultoria e conformidade</a><a href="${home}#servicos">Outsourcing de técnicos</a></div>
      <div><b>Academia</b>
        <a href="formacoes.html#ec">Certificações EC-Council</a><a href="formacoes.html#comptia">Certificações CompTIA</a>
        <a href="formacoes.html#tecnicos">Cursos técnicos</a><a href="formacoes.html#bootcamps">Bootcamps</a>
        <a href="inscricao.html">Inscrição online</a><a href="verificar.html">Verificar certificado</a></div>
      <div><b>Contacto</b>
        <a href="tel:+244938447195">+244 938 447 195</a><a href="tel:+244934659812">+244 934 659 812</a>
        <a href="mailto:comercial@cyscomp.co.ao">comercial@cyscomp.co.ao</a><a href="mailto:info@cyscomp.co.ao">info@cyscomp.co.ao</a>
        <span>Urbanização Nova Vida, Rua 60, Casa n.º 1597 · Luanda</span></div>
    </div>
  </div>
  <div class="wrap footer__legal mono">
    <span>© ${new Date().getFullYear()} CYSCOMP · Cyber Security Company · NIF 5001909711</span>
    <span>EC-Council e CompTIA são marcas registadas dos respectivos titulares.</span>
  </div>
</footer>`;

  document.getElementById('site-header').outerHTML = header;
  document.addEventListener('DOMContentLoaded', () => {
    const f = document.getElementById('site-footer');
    if (f) f.outerHTML = footer;
  });
})();
