"""
Servidor local de desenvolvimento: serve o site e as funções /api/* como na Vercel.
Uso:  python dev_server.py [porta]
Lê variáveis de um ficheiro .env (opcional) na mesma pasta. Sem DATABASE_URL usa SQLite em _data/.
"""
import os, sys
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qsl

ROOT = os.path.dirname(os.path.abspath(__file__))
env = os.path.join(ROOT, '.env')
if os.path.exists(env):
    for line in open(env, encoding='utf-8'):
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"'))
os.environ.setdefault('ADMIN_PASSWORD', 'cyscomp-local')
os.environ.setdefault('APP_SECRET', 'segredo-local-apenas-para-testes')

sys.path.insert(0, os.path.join(ROOT, 'api'))
import _cys  # noqa: E402


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def _api(self):
        u = urlparse(self.path)
        name = u.path[len('/api/'):].strip('/').removesuffix('.py')
        if name not in _cys.ROUTES:
            self.send_error(404); return
        n = int(self.headers.get('content-length') or 0)
        body = self.rfile.read(n) if n else b''
        status, hdrs, out = _cys.dispatch(name, self.command, dict(parse_qsl(u.query)), dict(self.headers), body, self.client_address[0])
        self.send_response(status)
        for k, v in hdrs.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(out)

    def do_GET(self):
        p = urlparse(self.path).path
        if p.startswith('/api/'):
            return self._api()
        if p.startswith(('/_data', '/.env', '/api')) or p.endswith('.py'):
            self.send_error(404); return
        if p == '/admin':
            self.path = '/admin.html'
        return super().do_GET()

    def do_POST(self):
        if urlparse(self.path).path.startswith('/api/'):
            return self._api()
        self.send_error(405)


if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
    print(f'CYSCOMP em http://localhost:{port}  ·  painel: http://localhost:{port}/admin')
    ThreadingHTTPServer(('127.0.0.1', port), Handler).serve_forever()
