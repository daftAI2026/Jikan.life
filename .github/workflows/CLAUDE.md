# workflows/
> L2 | 父级: /.github/CLAUDE.md

成员清单
ci.yml: GitHub Actions 主 CI 工作流，在 push/pull_request 到 `main` 时执行 `npm ci`、`npm run check:version-metadata`、`npm run test` 与 `npm run build`，并向构建注入 `VITE_APP_VERSION=${{ github.sha }}`

法则: 工作流即闸门·本地命令与 CI 命令必须同构·失败即阻断

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
