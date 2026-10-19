# demo-pixel-reports-batch (fictional)

Argon AI Brain 演示仓库。**故意包含路径穿越漏洞（CWE-22）**，用于主动漏洞修复工作流（Workflow A）演示。

- 漏洞位置：`src/main/java/com/example/reports/ReportImporter.java`（`resolve(fileName)` 未做路径规范化校验）
- 基线测试：`mvn test` → `blocksTraversalOutsideReportDirectory` **预期失败**（`../secret.txt` 被成功读取）
- AI 修复目标：`normalize()` 后校验目标路径必须仍位于 `reportDir` 内，否则抛出 `SecurityException`
- 数据声明：全部为虚构演示数据
