# AWS 部署与回退

本次采用独立版本目录，原官网目录和旧进程保留用于回退。数据库迁移只新增表、字段和索引，保留现有账号、收藏与投递。

## 运行位置

- 域名：https://orangetalents.net 和 https://www.orangetalents.net。
- 新版本目录：`/home/ubuntu/orange-releases/release-20261025-80da13e`。应用使用目录内 `.runtime/node`（Node 22），没有替换系统 Node。
- 新 PM2 进程：`orange-talents-opportunities`，仅监听 `127.0.0.1:3001`。
- 旧 PM2 进程：`orange-talents`，监听 3000；旧目录：`/home/ubuntu/orange-talents-website`。
- Nginx 站点配置：`/etc/nginx/sites-available/orangetalents`；部署前原配置保存在新版本目录的 `nginx-before.conf`。
- 邮件任务由 ubuntu 的 crontab 每 5 分钟运行，使用 flock 防重入，日志写入版本目录的 `mail-retry.log`。
- PM2 开机恢复由 `pm2-ubuntu.service` 启用，进程列表通过 `pm2 save` 保存。

## 配置与数据

`.env.local` 保留生产 DATABASE_URL、JWT_SECRET 和 ADMIN_EMAILS；SMTP 使用公司 Gmail 应用密码，不能提交到 Git。MK 名单尚未提供，因此 JOB_EDITOR_EMAILS 留空。新增权限前需核实员工身份和已注册的网站账号。

NEXT_PUBLIC_SITE_URL 在 Linux 构建时设为主域名；ALLOWED_ORIGINS 显式列出 www 域名。Nginx 上传上限 6m，应用简历上限 5 MB。部署包不包含 .env、测试数据库或真实凭据。

## 回退

先确认旧进程健康，再恢复原代理配置：

```sh
curl -f http://127.0.0.1:3000/ >/dev/null
sudo cp /home/ubuntu/orange-releases/release-20261025-80da13e/nginx-before.conf /etc/nginx/sites-available/orangetalents
sudo nginx -t && sudo systemctl reload nginx
```

保留新数据库表和投递记录，不删除已收到的简历。仅在确有必要且已保存上线后新增数据时，才从数据库备份恢复。下一次部署必须重新备份，并确认剩余磁盘空间足以同时容纳新版和回退版本。

## 2026-10-25 验收与磁盘处理

20 项 Linux 自动回归测试、类型检查、生产构建通过；AWS 备用端口完成 12 项检查，包含真实 Gmail 投递。公网切换后完成 9 项检查，覆盖双域名、构建资源、2 MB 请求通过 Nginx 后进入应用鉴权、匿名管理接口拒绝。临时测试账号已清理，原 17 个账号、1 条投递和 4 条收藏保留。浏览器完整交互验收尚未在本轮执行，不能将 HTTP 检查视为视觉验收。

没有扩容或新增付费资源。APT 下载缓存和可重建索引已清理；45 份历史 journal 文件在运维电脑完整归档后，保留最近约 200 MB 系统日志。`/etc/systemd/journald.conf.d/60-orange-storage-limit.conf` 设置 SystemMaxUse=200M、SystemKeepFree=500M 和 RuntimeMaxUse=50M，降低再次占满系统盘的风险。当前 8 GB 系统盘剩余空间仍有限，后续部署前必须再次核查容量。系统已有一个未完成配置的内核更新，本次未处理该更新，也未重启服务器。
