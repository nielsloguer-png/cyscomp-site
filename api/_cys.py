"""
CYSCOMP — núcleo da API (inscrições, contactos, verificação de certificados, painel).

Corre como funções Python na Vercel (api/*.py) e localmente com `python dev_server.py`.
Armazenamento: Postgres se DATABASE_URL estiver definida (produção), senão SQLite local.
Email: SMTP (ex.: servidor AngoWeb do domínio cyscomp.co.ao) se SMTP_HOST estiver definido.

Variáveis de ambiente
  DATABASE_URL        postgres://utilizador:senha@host:5432/base   (produção)
  ADMIN_PASSWORD      palavra-passe do painel /admin
  APP_SECRET          segredo longo e aleatório para assinar sessões do painel
  SMTP_HOST, SMTP_PORT (465 = SSL, 587 = STARTTLS), SMTP_USER, SMTP_PASS
  MAIL_FROM           ex.: "CYSCOMP <info@cyscomp.co.ao>"
  MAIL_INSCRICOES     destino das inscrições (por omissão info@cyscomp.co.ao)
  MAIL_CONTACTOS      destino dos contactos (por omissão comercial@cyscomp.co.ao)
  SITE_URL            ex.: https://www.cyscomp.co.ao (para links nos emails e QR)
"""
import base64, hashlib, hmac, json, os, re, secrets, smtplib, sqlite3, ssl, threading, time, traceback
from datetime import datetime, timezone
from email.message import EmailMessage
from email.utils import formataddr, parseaddr

ENV = os.environ.get
SITE_URL = (ENV('SITE_URL') or 'https://www.cyscomp.co.ao').rstrip('/')
ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'      # sem 0/O e 1/I, para leitura humana
CODE_RE = re.compile(r'^CYS-\d{4}-[A-Z0-9]{5}$')
EMAIL_RE = re.compile(r'^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,}$')


# ---------------------------------------------------------------- base de dados
class DB:
    def __init__(self):
        url = ENV('DATABASE_URL')
        if url:
            import pg8000.native as pg
            from urllib.parse import urlparse, unquote
            u = urlparse(url)
            ctx = ssl.create_default_context()
            self.conn = pg.Connection(user=unquote(u.username or ''), password=unquote(u.password or ''), host=u.hostname,
                                      port=u.port or 5432, database=(u.path or '/').lstrip('/'), ssl_context=ctx)
            self.pg = True
        else:
            path = ENV('SQLITE_PATH') or os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_data', 'cyscomp.db')
            os.makedirs(os.path.dirname(path), exist_ok=True)
            self.conn = sqlite3.connect(path, check_same_thread=False)
            self.conn.row_factory = sqlite3.Row
            self.pg = False
        self.lock = threading.Lock()
        self._schema()

    def q(self, sql, params=()):
        with self.lock:
            try:
                return self._q(sql, params)
            except Exception:
                if not self.pg:
                    raise
                # ligação Postgres fechada entre invocações (comum em serverless): religa uma vez
                self.lock = threading.Lock()
                DB.__init__(self)
                return self._q(sql, params)

    def _q(self, sql, params):
        if self.pg:
            n = [0]
            def rep(_):
                n[0] += 1
                return f':p{n[0]}'
            sql2 = re.sub(r'\?', rep, sql)
            kw = {f'p{i + 1}': v for i, v in enumerate(params)}
            rows = self.conn.run(sql2, **kw)
            cols = [c['name'] for c in (self.conn.columns or [])]
            return [dict(zip(cols, r)) for r in (rows or [])]
        cur = self.conn.execute(sql, params)
        self.conn.commit()
        return [dict(r) for r in cur.fetchall()]

    def _schema(self):
        serial = 'SERIAL PRIMARY KEY' if self.pg else 'INTEGER PRIMARY KEY AUTOINCREMENT'
        for sql in [
            f'''CREATE TABLE IF NOT EXISTS inscricoes (id {serial}, ref TEXT UNIQUE, criado TEXT, estado TEXT,
                curso_id TEXT, curso TEXT, modalidade TEXT, inicio TEXT, horario TEXT, nome TEXT, email TEXT,
                telefone TEXT, documento TEXT, provincia TEXT, profissao TEXT, empresa TEXT, experiencia TEXT,
                pagamento TEXT, factura TEXT, nif TEXT, obs TEXT, ip TEXT)''',
            f'''CREATE TABLE IF NOT EXISTS contactos (id {serial}, criado TEXT, nome TEXT, empresa TEXT, email TEXT,
                telefone TEXT, sector TEXT, mensagem TEXT, ip TEXT)''',
            f'''CREATE TABLE IF NOT EXISTS certificados (id {serial}, codigo TEXT UNIQUE, nome TEXT, curso TEXT,
                horas INTEGER, emissao TEXT, estado TEXT, inscricao_ref TEXT, criado TEXT, notas TEXT)''',
            f'''CREATE TABLE IF NOT EXISTS limites (id {serial}, chave TEXT, t INTEGER)''',
        ]:
            self.q(sql)


_db = None
def db():
    global _db
    if _db is None:
        _db = DB()
    return _db


def now():
    return datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')


# ---------------------------------------------------------------- utilitários
def clean(v, n=300):
    v = '' if v is None else str(v)
    v = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', '', v).strip()
    return v[:n]


def rate_limited(key, limit, window):
    """True se a chave excedeu `limit` pedidos nos últimos `window` segundos."""
    d, t = db(), int(time.time())
    d.q('DELETE FROM limites WHERE t < ?', (t - 86400,))
    n = d.q('SELECT COUNT(*) AS n FROM limites WHERE chave = ? AND t > ?', (key, t - window))[0]['n']
    if n >= limit:
        return True
    d.q('INSERT INTO limites (chave, t) VALUES (?, ?)', (key, t))
    return False


def new_code(prefix):
    year = datetime.now().year
    return f'{prefix}-{year}-' + ''.join(secrets.choice(ALPHABET) for _ in range(5))


def send_mail(to, subject, text, reply_to=None):
    host = ENV('SMTP_HOST')
    if not host or not to:
        return False
    msg = EmailMessage()
    msg['From'] = ENV('MAIL_FROM') or formataddr(('CYSCOMP', ENV('SMTP_USER') or 'info@cyscomp.co.ao'))
    msg['To'] = to
    msg['Subject'] = subject
    if reply_to and EMAIL_RE.match(reply_to):
        msg['Reply-To'] = reply_to
    msg.set_content(text)
    port = int(ENV('SMTP_PORT') or 465)
    try:
        if port == 465:
            s = smtplib.SMTP_SSL(host, port, context=ssl.create_default_context(), timeout=15)
        else:
            s = smtplib.SMTP(host, port, timeout=15)
            s.starttls(context=ssl.create_default_context())
        if ENV('SMTP_USER'):
            s.login(ENV('SMTP_USER'), ENV('SMTP_PASS') or '')
        s.send_message(msg)
        s.quit()
        return True
    except Exception as e:  # o pedido fica gravado mesmo que o email falhe
        print('SMTP erro:', repr(e))
        return False


# ---------------------------------------------------------------- sessão do painel
def _secret():
    s = ENV('APP_SECRET')
    if not s:
        raise RuntimeError('APP_SECRET não definido')
    return s.encode()


def make_token(hours=8):
    payload = base64.urlsafe_b64encode(json.dumps({'exp': int(time.time()) + hours * 3600}).encode()).decode()
    sig = hmac.new(_secret(), payload.encode(), hashlib.sha256).hexdigest()
    return f'{payload}.{sig}'


def check_token(tok):
    try:
        payload, sig = tok.split('.', 1)
        if not hmac.compare_digest(sig, hmac.new(_secret(), payload.encode(), hashlib.sha256).hexdigest()):
            return False
        return json.loads(base64.urlsafe_b64decode(payload))['exp'] > time.time()
    except Exception:
        return False


# ---------------------------------------------------------------- respostas
def J(status, obj):
    return status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store'}, json.dumps(obj, ensure_ascii=False).encode()


def body_json(body):
    try:
        d = json.loads(body or b'{}')
        return d if isinstance(d, dict) else {}
    except Exception:
        return {}


# ---------------------------------------------------------------- endpoints públicos
INSCRICAO_CAMPOS = ['curso_id', 'curso', 'modalidade', 'inicio', 'horario', 'nome', 'email', 'telefone', 'documento',
                    'provincia', 'profissao', 'empresa', 'experiencia', 'pagamento', 'factura', 'nif', 'obs']


def inscricao(method, query, headers, body, ip):
    if method != 'POST':
        return J(405, {'ok': False, 'erro': 'Método não permitido'})
    d = body_json(body)
    if d.get('website'):                     # campo-armadilha para robôs
        return J(200, {'ok': True, 'ref': new_code('CYS-INS')})
    if rate_limited('ins:' + ip, 5, 600):
        return J(429, {'ok': False, 'erro': 'Demasiados pedidos. Tente dentro de alguns minutos.'})
    r = {k: clean(d.get(k), 2000 if k == 'obs' else 300) for k in INSCRICAO_CAMPOS}
    if not r['curso'] and d.get('curso'):
        r['curso'] = clean(d.get('curso'))
    falta = [k for k in ('curso', 'nome', 'email', 'telefone', 'documento') if not r[k]]
    if falta or not EMAIL_RE.match(r['email']):
        return J(400, {'ok': False, 'erro': 'Dados em falta ou inválidos', 'campos': falta})
    ref = new_code('CYS-INS')
    cols = ['ref', 'criado', 'estado', 'ip'] + INSCRICAO_CAMPOS
    vals = [ref, now(), 'nova', ip] + [r[k] for k in INSCRICAO_CAMPOS]
    db().q(f'INSERT INTO inscricoes ({",".join(cols)}) VALUES ({",".join("?" * len(cols))})', vals)

    linhas = '\n'.join(f'{k.capitalize()}: {r[k] or "—"}' for k in INSCRICAO_CAMPOS if k != 'curso_id')
    send_mail(ENV('MAIL_INSCRICOES') or 'info@cyscomp.co.ao', f'Nova inscrição {ref} · {r["curso"]}',
              f'Nova inscrição online recebida em {now()}.\n\nReferência: {ref}\n{linhas}\n\nPainel: {SITE_URL}/admin', reply_to=r['email'])
    enviado = send_mail(r['email'], f'Recebemos a sua inscrição · {ref}',
              f'Olá {r["nome"]},\n\nRecebemos o seu pedido de inscrição na formação "{r["curso"]}" ({r["modalidade"]}).\n'
              f'Referência: {ref}\n\nA equipa da CYSCOMP vai contactá-lo com a confirmação da vaga, a data da turma e as '
              f'condições de pagamento.\n\nQualquer questão: +244 938 447 195 · info@cyscomp.co.ao\n\nCYSCOMP — Cyber Security Company\n{SITE_URL}')
    return J(200, {'ok': True, 'ref': ref, 'mail': enviado})


def contacto(method, query, headers, body, ip):
    if method != 'POST':
        return J(405, {'ok': False, 'erro': 'Método não permitido'})
    d = body_json(body)
    if d.get('website'):
        return J(200, {'ok': True})
    if rate_limited('ct:' + ip, 5, 600):
        return J(429, {'ok': False, 'erro': 'Demasiados pedidos. Tente dentro de alguns minutos.'})
    r = {k: clean(d.get(k), 4000 if k == 'mensagem' else 300) for k in ('nome', 'empresa', 'email', 'telefone', 'sector', 'mensagem')}
    if not r['nome'] or not r['empresa'] or not EMAIL_RE.match(r['email']):
        return J(400, {'ok': False, 'erro': 'Dados em falta ou inválidos'})
    db().q('INSERT INTO contactos (criado, nome, empresa, email, telefone, sector, mensagem, ip) VALUES (?,?,?,?,?,?,?,?)',
           (now(), r['nome'], r['empresa'], r['email'], r['telefone'], r['sector'], r['mensagem'], ip))
    send_mail(ENV('MAIL_CONTACTOS') or 'comercial@cyscomp.co.ao', f'Pedido de contacto · {r["empresa"]}',
              '\n'.join(f'{k.capitalize()}: {v or "—"}' for k, v in r.items()), reply_to=r['email'])
    return J(200, {'ok': True})


def verificar(method, query, headers, body, ip):
    code = clean(query.get('c'), 20).upper().replace(' ', '')
    if rate_limited('vf:' + ip, 60, 600):
        return J(429, {'estado': 'limite', 'erro': 'Demasiadas consultas. Tente dentro de alguns minutos.'})
    if not CODE_RE.match(code):
        return J(404, {'estado': 'inexistente'})
    rows = db().q('SELECT codigo, nome, curso, horas, emissao, estado FROM certificados WHERE codigo = ?', (code,))
    if not rows:
        return J(404, {'estado': 'inexistente'})
    return J(200, rows[0])


# ---------------------------------------------------------------- painel de gestão
def admin(method, query, headers, body, ip):
    a = query.get('a', '')
    d = body_json(body)
    if a == 'login':
        if method != 'POST':
            return J(405, {'ok': False})
        if rate_limited('login:' + ip, 8, 900):
            return J(429, {'ok': False, 'erro': 'Demasiadas tentativas. Aguarde 15 minutos.'})
        pw = ENV('ADMIN_PASSWORD') or ''
        if not pw or not hmac.compare_digest(str(d.get('password', '')), pw):
            return J(401, {'ok': False, 'erro': 'Palavra-passe incorrecta'})
        return J(200, {'ok': True, 'token': make_token()})

    auth = headers.get('authorization') or headers.get('Authorization') or ''
    if not check_token(auth.replace('Bearer ', '')):
        return J(401, {'ok': False, 'erro': 'Sessão expirada'})

    if a == 'resumo':
        q = db().q
        return J(200, {
            'inscricoes': q('SELECT * FROM inscricoes ORDER BY id DESC LIMIT 500'),
            'contactos': q('SELECT * FROM contactos ORDER BY id DESC LIMIT 500'),
            'certificados': q('SELECT * FROM certificados ORDER BY id DESC LIMIT 1000'),
        })

    if a == 'inscricao_estado' and method == 'POST':
        estado = clean(d.get('estado'), 20)
        if estado not in ('nova', 'contactada', 'confirmada', 'concluida', 'cancelada'):
            return J(400, {'ok': False})
        db().q('UPDATE inscricoes SET estado = ? WHERE ref = ?', (estado, clean(d.get('ref'), 40)))
        return J(200, {'ok': True})

    if a == 'certificado' and method == 'POST':
        nome, curso = clean(d.get('nome'), 160), clean(d.get('curso'), 200)
        if not nome or not curso:
            return J(400, {'ok': False, 'erro': 'Nome e formação são obrigatórios'})
        try:
            horas = int(d.get('horas') or 0) or None
        except ValueError:
            horas = None
        emissao = clean(d.get('emissao'), 10) or datetime.now().strftime('%Y-%m-%d')
        if not re.match(r'^\d{4}-\d{2}-\d{2}$', emissao):
            return J(400, {'ok': False, 'erro': 'Data inválida'})
        for _ in range(5):
            code = new_code('CYS')
            if not db().q('SELECT 1 AS x FROM certificados WHERE codigo = ?', (code,)):
                break
        db().q('INSERT INTO certificados (codigo, nome, curso, horas, emissao, estado, inscricao_ref, criado, notas) VALUES (?,?,?,?,?,?,?,?,?)',
               (code, nome, curso, horas, emissao, 'valido', clean(d.get('inscricao_ref'), 40), now(), clean(d.get('notas'), 500)))
        if d.get('inscricao_ref'):
            db().q('UPDATE inscricoes SET estado = ? WHERE ref = ?', ('concluida', clean(d.get('inscricao_ref'), 40)))
        return J(200, {'ok': True, 'codigo': code, 'url': f'{SITE_URL}/verificar.html?c={code}'})

    if a == 'certificado_estado' and method == 'POST':
        estado = clean(d.get('estado'), 20)
        if estado not in ('valido', 'revogado'):
            return J(400, {'ok': False})
        db().q('UPDATE certificados SET estado = ? WHERE codigo = ?', (estado, clean(d.get('codigo'), 20)))
        return J(200, {'ok': True})

    return J(404, {'ok': False, 'erro': 'Acção desconhecida'})


ROUTES = {'inscricao': inscricao, 'contacto': contacto, 'verificar': verificar, 'admin': admin}


def dispatch(name, method, query, headers, body, ip):
    try:
        return ROUTES[name](method, query, headers, body, ip)
    except Exception as e:
        print('Erro API', name, repr(e), flush=True)
        traceback.print_exc()
        return J(500, {'ok': False, 'erro': 'Erro interno. Tente novamente ou contacte info@cyscomp.co.ao.'})


# ---------------------------------------------------------------- adaptador Vercel
def vercel_handler(name):
    from http.server import BaseHTTPRequestHandler
    from urllib.parse import urlparse, parse_qsl

    class Handler(BaseHTTPRequestHandler):
        def _go(self):
            u = urlparse(self.path)
            n = int(self.headers.get('content-length') or 0)
            body = self.rfile.read(min(n, 64 * 1024)) if n else b''
            ip = (self.headers.get('x-forwarded-for') or self.client_address[0] or '').split(',')[0].strip()
            status, hdrs, out = dispatch(name, self.command, dict(parse_qsl(u.query)), dict(self.headers), body, ip)
            self.send_response(status)
            for k, v in hdrs.items():
                self.send_header(k, v)
            self.end_headers()
            self.wfile.write(out)

        do_GET = do_POST = _go

    return Handler
