# Mythos 漏洞整改平台——虚构数据 Demo

> 本文介绍基础 Mock。包含 DSH / Brain / 沙箱 / PR 的完整项目，参阅[项目导航](../README.md)、[架构图](../docs/Mythos_系统架构.md)和[使用说明](../docs/Mythos_使用说明.md)。当前远程入口为 `ubuntu.huaxia2002.cn`，端口以完整项目文档为准。

这版保留了类似企业后台的**深蓝/亮蓝色视觉风格**，但没有任何原公司 Logo、真实用户姓名、内部应用/资源标识。原模块名已统一替换为 **Mythos**，保留漏洞列表、筛选、详情、整改反馈、右下角 AI Enhance Chatbox。

## 快速体验

直接用浏览器打开 `Mythos_Standalone_Demo.html`：**纯离线、不开网络请求、不发送邮件**。可以测试页面交互及 AI 的本地模拟回复。点击 Email Digest 可看到订阅表单，但要真正创建订阅需要启动后端。

## 完整后端

技术栈：**Java 17 / Spring Boot 3.5.6 / Spring Web / Spring Data JPA / H2 / Spring Mail / Scheduler**。

1. 安装 Java 17+、Maven 3.9+；在项目目录执行：
   ```bash
   cd backend
   mvn spring-boot:run
   ```
2. 访问 `http://localhost:8080`；后端启动时初始化 234 条**完全虚构**的漏洞。
3. 点「Subscribe to findings」，选择测试邮箱、每天或每周、最低风险等级、特定模拟应用。
4. 默认不发真实邮件：本地生成 `.eml` 文件到 `backend/data/outbox/`，打开最新确认邮件，复制 `#confirm=...` 链接进入页面并点击确认。
5. 确认后，摘要将在每天 **08:00 UTC** 触发；每周订阅只在周一发送。要立即测试，可在服务所在的本机执行：
   ```bash
   curl -X POST http://127.0.0.1:8080/api/demo/digests/run
   ```
6. 查看新的 `.eml`，其中列出匹配的未关闭虚构漏洞（最多显示 20 条，附总数），也包含退订链接。

邮件订阅 API：`POST /api/subscriptions`、`POST /api/subscriptions/confirm`、`POST /api/subscriptions/unsubscribe`。漏洞 API：`GET /api/findings`、`GET /api/findings/{id}`、`PATCH /api/findings/{id}`；Case API：`GET/POST /api/cases`。

## SMTP 外发（只建议测试邮箱）

默认配置 `MAIL_MODE=preview`，严格不会 SMTP 外发。如确需发信，明确设置 `MAIL_MODE=smtp`、`SMTP_HOST`、账号密码、`MAIL_FROM`、`PUBLIC_BASE_URL`、以及 `SMTP_ALLOWED_RECIPIENTS` 精确白名单。**没有配置收件人白名单就会拒绝发送。** 全部配置方法见英文 `README.md`。

## 重要边界

- 此版本是**原型工程，不应直接暴露到公网或连接企业生产漏洞数据**。后台默认仅监听本机 `127.0.0.1`。
- 目前**没有 SSO/RBAC、审计、CSRF 防护、API 速率限制和生产级消息可靠性**。上 EC2 前至少应补齐这些能力。
- 邮件用双重确认，确认令牌 48 小时过期，摘要支持按应用/风险级别筛选、每天/每周调度、一天内重复发送抑制与退订。
- AI Enhance 仍是**本地规则模拟**，并未连接任何真实大模型。
- 邮件内全部是虚构示例漏洞；前端附件只存文件名，尚无后端文件上传。
- 2026-10-20 已在本地使用 `mvn -B -o test` 验证基础后端，3 项测试全部通过；远端安装的工作流 overlay 不属于这 3 项基础测试的覆盖范围。
