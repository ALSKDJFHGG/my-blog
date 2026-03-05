#!/bin/bash

# 部署验证脚本

echo "🔍 检查服务状态..."

# 检查 PM2 状态
echo "PM2 进程状态："
pm2 status

# 检查 Nginx 状态
echo "Nginx 状态："
systemctl status nginx --no-pager

# 检查端口占用
echo "端口占用情况："
netstat -tlnp | grep -E ':(80|443|3000|22)'

# 检查 SSL 证书（如有）
echo "SSL 证书状态："
if [ -f "/etc/letsencrypt/live/你的域名/cert.pem" ]; then
    echo "✅ SSL 证书已安装"
    openssl x509 -in /etc/letsencrypt/live/你的域名/cert.pem -text -noout | grep "Not After"
else
    echo "❌ SSL 证书未安装"
fi

# 检查磁盘空间
echo "磁盘使用情况："
df -h

echo "✅ 检查完成！"