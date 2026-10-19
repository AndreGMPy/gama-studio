// Servidor estático mínimo para desarrollo local (sin dependencias).
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(fileURLToPath(new URL('..', import.meta.url)));
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

export function iniciarServidor(puerto = Number(process.env.PORT) || 4321) {
  const server = createServer(async (req, res) => {
    try {
      let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (ruta.endsWith('/')) ruta += 'index.html';
      const archivo = normalize(join(RAIZ, ruta));
      if (!archivo.startsWith(RAIZ)) { res.writeHead(403).end(); return; }
      if (!(await stat(archivo)).isFile()) throw new Error('no file');
      res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
      res.end(await readFile(archivo));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404');
    }
  });
  return new Promise((ok, mal) => {
    server.once('error', mal);
    server.listen(puerto, '127.0.0.1', () => ok(server));
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const s = await iniciarServidor();
  console.log(`Gama Studio en http://127.0.0.1:${s.address().port}`);
}
