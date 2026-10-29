# CYSCOMP — publicar o site com o servidor

O site é estático (HTML/CSS/JS) e as funções do servidor estão em `api/` (Python), prontas para a **Vercel**, onde o site actual já está alojado.

| Funcionalidade | Endereço | O que faz |
|---|---|---|
| Inscrição online | `POST /api/inscricao` | Grava a inscrição, envia email à CYSCOMP e confirmação ao formando |
| Contacto | `POST /api/contacto` | Grava o pedido e envia email ao comercial |
| Verificar certificado | `GET /api/verificar?c=CYS-2026-XXXXX` | Consulta o registo oficial de certificados |
| Painel de gestão | `/admin` | Inscrições, contactos, emissão/revogação de certificados com QR, exportação CSV |

Protecções incluídas: palavra-passe do painel e sessões assinadas (8 h), limite de tentativas de login (8 em 15 min), limite de pedidos por IP nos formulários e na verificação, campo-armadilha contra robôs, consultas parametrizadas (sem injecção SQL), cabeçalhos de segurança (HSTS, CSP, X-Frame-Options) e ficheiros internos fora do alcance público.

---

## 1. Base de dados (5 min)
1. Entrar em **vercel.com** → projecto do site da CYSCOMP → separador **Storage** → **Create Database** → **Neon (Postgres)** → plano gratuito → região mais próxima (ex.: Frankfurt).
2. Ligar a base ao projecto. A Vercel cria automaticamente a variável `DATABASE_URL`.
   As tabelas são criadas sozinhas no primeiro pedido.

## 2. Variáveis de ambiente
Em **Settings → Environment Variables** (Production), acrescentar (ver `.env.example`):

| Variável | Valor |
|---|---|
| `ADMIN_PASSWORD` | palavra-passe forte para o painel `/admin` |
| `APP_SECRET` | texto aleatório com 40+ caracteres (não partilhar) |
| `SMTP_HOST` | servidor de correio do domínio — hoje `ws4.angoweb.net` (confirmar no painel AngoWeb; pode ser `mail.cyscomp.co.ao`) |
| `SMTP_PORT` | `465` (SSL) ou `587` (STARTTLS) |
| `SMTP_USER` / `SMTP_PASS` | caixa que envia, ex.: `info@cyscomp.co.ao` e a respectiva palavra-passe |
| `MAIL_FROM` | `CYSCOMP <info@cyscomp.co.ao>` |
| `MAIL_INSCRICOES` | `info@cyscomp.co.ao` |
| `MAIL_CONTACTOS` | `comercial@cyscomp.co.ao` |
| `SITE_URL` | `https://www.cyscomp.co.ao` |

Recomendado: criar uma caixa só para envios automáticos (ex.: `noreply@cyscomp.co.ao`) em vez de usar a palavra-passe da caixa principal.

## 3. Publicar
- **Com GitHub (recomendado):** criar um repositório privado com o conteúdo desta pasta `website/`, e em Vercel → **Add New → Project → Import** escolher esse repositório (Framework: *Other*, sem comando de build). Cada alteração enviada para o GitHub publica automaticamente.
- **Sem GitHub:** instalar o Vercel CLI (`npm i -g vercel`) e, dentro de `website/`, correr `vercel --prod`.

Os ficheiros `_gen/` (clips e imagens-chave originais), `_data/` (base local) e `dev_server.py` não são publicados (`.vercelignore`).

## 4. Depois de publicar — verificar
1. Abrir `https://www.cyscomp.co.ao/admin` e entrar com `ADMIN_PASSWORD`.
2. Fazer uma inscrição de teste em `/inscricao.html` → deve aparecer no painel e chegar email a `info@`.
3. No painel → **Certificados** → emitir um certificado de teste → **QR** → abrir o link → deve dizer “Certificado autêntico”.
4. Revogar esse certificado de teste.

## 5. Emitir certificados no dia-a-dia
Painel → **Inscrições** → *Emitir certificado* (preenche os dados do formando) → **Emitir** → **QR** → *Descarregar QR (SVG)* e colocar o QR e o código `CYS-AAAA-XXXXX` no modelo do certificado. O QR abre `verificar.html?c=CÓDIGO`.

## Testar no computador
```
python dev_server.py
```
Abre `http://localhost:5173` (site) e `http://localhost:5173/admin` (palavra-passe local: `cyscomp-local`). Sem `DATABASE_URL`, usa uma base SQLite em `_data/`. Sem `SMTP_HOST`, os emails não são enviados mas os pedidos ficam gravados.
