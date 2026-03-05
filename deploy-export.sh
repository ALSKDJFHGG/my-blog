#!/bin/bash
set -euo pipefail

# 部署脚本：静态导出并同步到服务器
SERVER_USER=${SERVER_USER:-root}
SERVER_HOST=${SERVER_HOST:?需要设置服务器地址，如 SERVER_HOST=1.2.3.4}
REMOTE_ROOT=${REMOTE_ROOT:-/var/www/my-blog}
REMOTE_OUT_DIR="${REMOTE_ROOT}/out"

# 本地测试模式入口：若传入 --local-test，则仅在本地导出并启动一个简单静态服务器进行测试
if [ "${1:-}" = "--local-test" ]; then
  echo "[部署-本地测试] 开始本地静态导出测试"
  echo "[部署-本地测试] 构建应用..."
  npm run build
  echo "[部署-本地测试] 静态导出由构建阶段完成，不需要单独执行 npm run export" 
  if [ ! -d "out" ]; then
    echo "Error: 本地导出结果目录 'out' 未找到，请确认执行了 'npm run export'。"
    exit 1
  fi
  echo "[部署-本地测试] 启动本地静态服务器..."
  if command -v http-server >/dev/null 2>&1; then
    npx http-server out -p 8080 &
    PID=$!
    echo "本地静态服务器已启动，访问 http://localhost:8080  (PID=$PID)"
  elif command -v python3 >/dev/null 2>&1; then
    (cd out && python3 -m http.server 8080) &
    PID=$!
    echo "本地静态服务器已启动，访问 http://localhost:8080  (PID=$PID)"
  else
    echo "未检测到可用的本地静态服务器（需要 http-server 或 Python http.server）。"
    exit 1
  fi
  exit 0
fi

echo "[部署] 开始静态导出部署"

echo "[部署] 构建应用..."
npm run build

echo "[部署] 静态导出阶段由构建产物输出，不再单独执行 export" 

if [ ! -d "out" ]; then
  echo "Error: 导出结果目录 'out' 未找到，请确认执行了 'npm run export'。"
  exit 1
fi

echo "[部署] 打包导出并传输到服务器..."
tar -czf out.tar.gz -C out .
scp out.tar.gz ${SERVER_USER}@${SERVER_HOST}:/tmp/my-blog-out.tar.gz

echo "[部署] 远端解压并部署静态站点..."
ssh ${SERVER_USER}@${SERVER_HOST} bash -lc '
set -euo pipefail
DEST="'"${REMOTE_OUT_DIR}"'"; mkdir -p "$DEST"; tar -xzf /tmp/my-blog-out.tar.gz -C "$DEST";'

echo "[部署] 重新加载 Nginx (如使用静态导出，请确保 Nginx 指向 /out 目录) ..."
ssh ${SERVER_USER}@${SERVER_HOST} bash -lc 'systemctl reload nginx || true'

echo "[部署] 部署完成。"
echo "请在服务器上确保 Nginx 配置正确指向 ${REMOTE_OUT_DIR}，并根据需要配置域名与 SSL。"
