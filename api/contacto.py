# Função Vercel: /api/contacto  (lógica em _cys.py)
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _cys import vercel_handler

handler = vercel_handler('contacto')
