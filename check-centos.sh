#!/bin/bash

# CentOS 环境检查脚本

echo "🔍 检查服务状态..."

# 检查 PM2
echo "PM2 进程状态："
pm2 status

# 检查 Nginx
echo "Nginx 状态："
systemctl status nginx --no-pager

# 检查 firewalld
echo "防火墙状态："
systemctl status firewalld --no-pager

# 检查端口
echo "端口占用："
netstat -tlnp | grep -E ':(80|443|3000|22)'

# 检查 SSL
if [ -f "/etc/letsencrypt/live/你的域名/cert.pem" ]; then
    echo "✅ SSL 证书已安装"
    openssl x509 -in /etc/letsencrypt/live/你的域名/cert.pem -text -noout | grep "Not After"
else
    echo "❌ SSL 证书未安装"
fi

echo "✅ 检查完成！"