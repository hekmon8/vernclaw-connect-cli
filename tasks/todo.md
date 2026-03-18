# Todo

- [x] 审查当前包的构建、发布、测试与 `dist` 依赖关系
- [x] 确认移除 `dist` 入库的目标方案为 `prepack`
- [x] 先写失败测试，锁定发布脚本与忽略规则
- [x] 更新 `package.json`、`.gitignore`、`README.md`
- [x] 从 git 移除已跟踪的 `dist` 产物
- [x] 运行打包与测试验证

## Review

- 已补齐本地 `build` / `test` / `prepack` 脚本与最小 devDependencies。
- 已新增本地 `vitest.config.ts`，让独立仓库可直接发现 `__tests__`。
- 已将 `dist/` 加入 `.gitignore`，并从 git 索引移除现有 `dist` 文件。
- 已验证 `npm test` 通过，且 `npm pack --dry-run` 会在 `prepack` 后把 `dist/**` 带入 tarball。
