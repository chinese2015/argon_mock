# demo-nova-catalog-api (fictional)

Argon AI Brain 演示仓库。**故意包含 SQL 注入漏洞（CWE-89）**，用于主动漏洞修复工作流（Workflow A）演示。

- 漏洞位置：`src/main/java/com/example/catalog/CatalogSearchService.java`（`searchByName` 字符串拼接 SQL）
- 基线测试：`mvn test` → `maliciousInputReturnsNothing` **预期失败**（证明漏洞真实存在，需记录 baseline failure）
- AI 修复目标：改用 `PreparedStatement` 参数绑定，保持合法输入行为不变，使全部测试通过
- 数据声明：全部为虚构演示数据，无任何真实代码或凭据
