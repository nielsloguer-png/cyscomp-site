"""
CYSCOMP — prepara a sequência de frames da intro.
Entrada: frames PNG a 16 fps extraídos de _gen/clips/c1..c3.mp4 (pasta RAW).
Saída:   assets/seq/d (desktop 1600px), assets/seq/m (telemóvel 540x960)
         assets/seq/seq.json com a posição do medalhão por frame
         (o logótipo vectorial é desenhado por cima em hero.js).
Uso: python -I _gen/frames.py <pasta_raw>
"""
import json, os, sys, glob
import cv2, numpy as np
from PIL import Image

RAW = sys.argv[1]
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT_D = os.path.join(ROOT, 'assets', 'seq', 'd')
OUT_M = os.path.join(ROOT, 'assets', 'seq', 'm')
for d in (OUT_D, OUT_M):
    os.makedirs(d, exist_ok=True)
    for f in glob.glob(os.path.join(d, '*.webp')): os.remove(f)

# ordem: clip a completo, b e c sem o 1.º frame (igual ao último do clip anterior)
files = sorted(glob.glob(os.path.join(RAW, 'a_*.png')))
files += sorted(glob.glob(os.path.join(RAW, 'b_*.png')))[1:]
files += sorted(glob.glob(os.path.join(RAW, 'c_*.png')))[1:]
na = len(glob.glob(os.path.join(RAW, 'a_*.png')))
nb = len(glob.glob(os.path.join(RAW, 'b_*.png'))) - 1


def ramp(i, a, b):
    return float(np.clip((i - a) / (b - a), 0, 1))


def opacity(i):
    """Logótipo visível só quando o escudo está sólido e de frente."""
    if i < na:                       # clip 1: dados → escudo
        return ramp(i, 74, 86)
    j = i - na                        # clip 2: rotação + cúpula
    if j < nb:
        return max(1 - ramp(j, 3, 11), ramp(j, 60, 70))
    return 1.0                        # clip 3: escudo desliza para a direita


def detect(img, prev):
    g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (5, 5), 1.5)
    cs = cv2.HoughCircles(g, cv2.HOUGH_GRADIENT, dp=1.2, minDist=40, param1=60, param2=26, minRadius=80, maxRadius=150)
    if cs is None: return None
    cs = cs[0]
    if prev is not None:
        cs = sorted(cs, key=lambda c: (c[0] - prev[0]) ** 2 + (c[1] - prev[1]) ** 2 + (4 * (c[2] - prev[2])) ** 2)
        c = cs[0]
        if (c[0] - prev[0]) ** 2 + (c[1] - prev[1]) ** 2 > 60 ** 2: return None
        return c
    cs = sorted(cs, key=lambda c: abs(c[1] - 536) + abs(c[0] - 960))
    return cs[0]


n = len(files)
op = [opacity(i) for i in range(n)]
pos = [None] * n
prev = None
for i, f in enumerate(files):
    if op[i] <= 0: prev = None; continue
    img = cv2.imread(f)
    c = detect(img, prev)
    if c is not None:
        pos[i] = [float(c[0]), float(c[1]), float(c[2])]; prev = pos[i]

# preencher falhas por interpolação e suavizar (média móvel de 5)
idx = [i for i in range(n) if pos[i]]
arr = np.array([pos[i] for i in idx])
full = np.zeros((n, 3))
for k in range(3): full[:, k] = np.interp(range(n), idx, arr[:, k])
sm = full.copy()
for i in range(n):
    if op[i] <= 0: continue
    lo, hi = max(0, i - 2), min(n, i + 3)
    win = [j for j in range(lo, hi) if op[j] > 0]
    sm[i] = full[win].mean(axis=0)

H, Wd = 1072, 1920
CW = round(H * 9 / 16)                 # largura do recorte vertical (telemóvel)
track_d, track_m = [], []
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB')
    im.resize((1600, round(1600 * H / Wd)), Image.LANCZOS).save(os.path.join(OUT_D, f'f{i:04d}.webp'), quality=74, method=5)
    # recorte vertical que acompanha o escudo
    cx = sm[i][0] if i >= na + nb else Wd / 2
    left = int(np.clip(cx - CW / 2, 0, Wd - CW))
    im.crop((left, 0, left + CW, H)).resize((540, 960), Image.LANCZOS).save(os.path.join(OUT_M, f'f{i:04d}.webp'), quality=72, method=5)
    x, y, r = sm[i]
    track_d.append([round(x / Wd, 5), round(y / H, 5), round(r / Wd, 5), round(op[i], 3)])
    track_m.append([round((x - left) / CW, 5), round(y / H, 5), round(r / CW, 5), round(op[i], 3)])

seq = {'count': n, 'fps': 16, 'ext': 'webp',
       'd': {'dir': 'assets/seq/d', 'track': track_d},
       'm': {'dir': 'assets/seq/m', 'track': track_m}}
# como script (e não JSON) para funcionar também ao abrir o site directamente do disco (file://)
open(os.path.join(ROOT, 'assets', 'seq', 'seq.js'), 'w').write('window.CYS_SEQ=' + json.dumps(seq, separators=(',', ':')) + ';')
print('frames', n, 'detectados', len(idx))
