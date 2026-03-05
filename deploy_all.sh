#!/usr/bin/env bash
set -euo pipefail

# End-to-end deployment script: local build + static export + remote deploy + nginx/ TLS setup
# Env vars (required/optional):
# - SERVER_HOST: remote server address (required)
# - SERVER_USER: remote user (default: root)
# - REMOTE_ROOT: remote project root (default: /var/www/my-blog)
# - DOMAIN: domain name for nginx config (optional)
# - CERT_EMAIL: email for TLS via certbot (optional, required if DOMAIN provided)
# - SSH_KEY: path to SSH private key (optional)

SERVER_HOST=${SERVER_HOST:-}
if [ -z "$SERVER_HOST" ]; then
  echo "SERVER_HOST is required."
  exit 1
fi

SERVER_USER=${SERVER_USER:-root}
REMOTE_ROOT=${REMOTE_ROOT:-/var/www/my-blog}
REMOTE_OUT_DIR="${REMOTE_ROOT}/out"
DOMAIN="${DOMAIN:-}"
CERT_EMAIL="${CERT_EMAIL:-}"
SSH_KEY="${SSH_KEY:-}"
SSH_OPTS=""
if [ -n "$SSH_KEY" ]; then
  SSH_OPTS="-i $SSH_KEY"
fi

echo "[DEPLOY] 1) Local install & build"
npm install
echo "[DEPLOY] Running build..."
npm run build

if [ ! -d "out" ]; then
  echo "Error: out directory not found after build. Ensure static export is enabled."
  exit 1
fi

echo "[DEPLOY] 2) Package and transfer"
tar -czf out.tar.gz -C out .
scp $SSH_OPTS out.tar.gz ${SERVER_USER}@${SERVER_HOST}:/tmp/my-blog-out.tar.gz

echo "[DEPLOY] 3) Remote deploy (extract to ${REMOTE_OUT_DIR})"
ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} bash -lc '
set -euo pipefail
DEST="'${REMOTE_OUT_DIR}'";
mkdir -p "$DEST";
tar -xzf /tmp/my-blog-out.tar.gz -C "$DEST";
'

echo "[DEPLOY] 4) Update Nginx config (if DOMAIN provided)"
if [ -n "$DOMAIN" ]; then
  cat > /tmp/my-blog-nginx.conf <<EOF
server {
  listen 80;
  server_name ${DOMAIN};
  root ${REMOTE_OUT_DIR};
  index index.html;
  location / {
    try_files \$uri \$uri/ /index.html;
  }
}
EOF
  scp $SSH_OPTS /tmp/my-blog-nginx.conf ${SERVER_USER}@${SERVER_HOST}:/tmp/my-blog-nginx.conf
  ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} bash -lc 'sudo mv /tmp/my-blog-nginx.conf /etc/nginx/conf.d/my-blog-static.conf && sudo nginx -t && sudo systemctl reload nginx'
else
  echo "Domain not provided. Skipping nginx config update. Please configure nginx to serve from ${REMOTE_OUT_DIR} manually."
fi

echo "[DEPLOY] 5) TLS provisioning (optional)"
if [ -n "$DOMAIN" ]; then
  if [ -n "$CERT_EMAIL" ]; then
    ssh $SSH_OPTS ${SERVER_USER}@${SERVER_HOST} bash -lc "sudo certbot --nginx -d ${DOMAIN} -m ${CERT_EMAIL} --agree-tos --non-interactive"
  else
    echo "CERT_EMAIL not provided. Skipping TLS provisioning."
  fi
fi

echo "[DEPLOY] 6) Completion"
if [ -n "$DOMAIN" ]; then
  echo "Deployment finished. Access https://${DOMAIN} to verify."
else
  echo "Deployment finished. DOMAIN not provided; please configure domain & TLS later." 
fi
