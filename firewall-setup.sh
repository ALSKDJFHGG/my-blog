#!/bin/bash

# 防火墙配置脚本

# 允许 SSH
ufw allow ssh

# 允许 HTTP 和 HTTPS
ufw allow 80
ufw allow 443

# 启用防火墙
ufw --force enable

# 查看状态
ufw status verbose

echo "防火墙配置完成！"