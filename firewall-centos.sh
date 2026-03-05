#!/bin/bash

# firewalld 防火墙配置

# 启动防火墙
systemctl start firewalld
systemctl enable firewalld

# 开放端口
firewall-cmd --permanent --add-service=ssh
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# 重新加载
firewall-cmd --reload

# 查看状态
firewall-cmd --list-all

echo "防火墙配置完成！"