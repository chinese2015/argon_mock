# demo-orion-notes-api (fictional)

Mythos AI Brain 演示仓库。**故意包含硬编码凭据漏洞（CWE-798）**，用于主动漏洞修复工作流（Workflow A）演示。

- 漏洞位置：`src/main/java/com/example/notes/AppConfig.java`（`adminPassword` 硬编码字面量）
- 基线测试：`mvn test` → `noHardcodedAdminPassword` 与 `leakedDemoPasswordNotPresent` **预期失败**
- AI 修复目标：改为从环境变量读取（如 `ORION_ADMIN_PASSWORD`），不得保留任何字面量默认值
- 数据声明：`orion-admin` / `Orion#Demo#2026` 均为虚构演示值
