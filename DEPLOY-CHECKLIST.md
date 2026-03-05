# 部署检查清单（静态导出方案）

- 本地构建与导出
  - [ ] 能否在本地执行 npm install 并成功执行 npm run build 与 npm run export？
  - [ ] out/ 目录存在且包含 index.html、static/、_next/static 等静态资源。
  - [ ] 文章、路由、静态资源是否能在本地静态服务器访问。

- 服务器准备
  - [ ] 目标服务器为 Linux，具备 2GB+ RAM（本场景为 2GB 内存，确认 swap 已配置）
  - [ ] Nginx 已安装并可工作，版本兼容
  - [ ] 80/443 端口对外开放，防火墙允许访问
  - [ ] 证书申请与域名解析（如使用 HTTPS）

- 部署步骤
  - [ ] 通过 deploy-export.sh 进行导出并传输到服务器（out 目录落地到 /var/www/my-blog/out）
  - [ ] 服务器上的 Nginx 配置指向静态导出目录
  - [ ] 部署后执行 nginx -t 确认配置正确
  - [ ] 通过域名访问站点，验证首页、文章页、标签筛选等功能是否正常
  - [ ] PM2 静态服务（如果使用静态导出）已配置并启动：pm2 start ecosystem.static.json
  - [ ] Nginx 配置针对静态导出优化（如静态资源缓存、gzip、http2 等）完成

- 回滚与备份
  - [ ] 记录上一次导出版本，确保需要时可快速回滚
  - [ ] 备份 /var/www/my-blog/out/ 到可恢复的备份目录

- 监控与后续
  - [ ] 监控服务器内存/磁盘使用情况，确保静态导出不会耗尽资源
  - [ ] 如未来需要，添加 CI/CD 自动化部署流程
