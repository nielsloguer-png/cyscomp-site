/* CYSCOMP — ligação do site à API (funções em /api, alojadas na Vercel).
   Sem API (ficheiro aberto do disco ou pré-visualização estática no GitHub Pages),
   os formulários usam o email como alternativa e a verificação usa os registos de demonstração. */
if (/^https?:$/.test(location.protocol) && !/\.github\.io$/.test(location.hostname)) {
  window.CYS_FORM_ENDPOINT = '/api/inscricao';
  window.CYS_CONTACT_ENDPOINT = '/api/contacto';
  window.CYS_VERIFY_ENDPOINT = '/api/verificar';
}
