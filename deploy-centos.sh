#!/bin/bash

# CentOS 部署脚本

echo "🚀 开始部署博客项目..."

# 进入项目目录
cd /var/www/my-blog

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 重启 PM2 进程
echo "🔄 重启服务..."
pm2 restart my-blog

# 重新加载 Nginx
echo "🌐 重新加载 Nginx..."
systemctl reload nginx

# 显示状态
echo "📊 服务状态："
pm2 status
systemctl status nginx --no-pager

echo "✅ 部署完成！"