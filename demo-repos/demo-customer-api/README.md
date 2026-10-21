# demo-customer-api (fictional)

Mythos AI Brain 演示仓库。故意包含**客户搜索分页 Bug**（Jira DEV-142 演示用，对应方案 Workflow B）。

- Bug 位置：`src/main/java/com/example/customer/CustomerSearchService.java`（`totalElements` / `totalPages` 按页内切片计算，且结果未排序）
- 验收目标（Acceptance Criteria）：稳定排序、正确 `totalElements` / `totalPages`、翻页无重复/遗漏、补充分页回归测试
- 基线测试：`mvn test` → `paginationIsCompleteWithoutDuplicatesOrGaps` 与 `resultsAreSortedByName` **预期失败**
- 数据声明：全部为虚构演示数据
