// Lightweight static file server for Next.js static export (out/)
// Serves files from /var/www/my-blog/out when run from PM2 (cwd should be /var/www/my-blog)
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const root = path.resolve(__dirname, 'out');
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;

const mimeTypes = {
  '.html': 'text/html',
  '.htm': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal Server Error');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const parsed = url.parse(req.url);
    let pathname = decodeURIComponent(parsed.pathname || '/');
    if (pathname.endsWith('/')) {
      pathname += 'index.html';
    }
    // 防止目录遍历
    const safePath = path.normalize(path.join(root, pathname));
    if (!safePath.startsWith(root)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    fs.stat(safePath, (err, stats) => {
      if (!err && stats.isFile()) {
        serveFile(safePath, res);
      } else {
        // 尝试回落到 index.html（单页应用场景）
        const indexPath = path.join(root, 'index.html');
        fs.stat(indexPath, (e2, s2) => {
          if (!e2 && s2.isFile()) {
            serveFile(indexPath, res);
          } else {
            res.statusCode = 404;
            res.end('Not Found');
          }
        });
      }
    });
  } catch (ex) {
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
});

server.listen(port, () => {
  console.log(`Static server listening on http://localhost:${port}/ (root: ${root})`);
});
