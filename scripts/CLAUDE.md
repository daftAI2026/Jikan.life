# scripts/
> L2 | 父级: /CLAUDE.md

成员清单
check-wallpaper-core.js: 壁纸核心算法的轻量验证脚本，覆盖 DST/闰年/边界案例
sync-wallpaper-snapshots.js: 固定 Date 生成 Year/Life/Goal Worker SVG 并回写视觉快照哈希基线，消除手工抄写 sha256
sync-changelog-version.js: 以 CHANGELOG.md 首个 ## [x.x.x] 为真相源，逆向同步版本号到 package.json
sync-version-metadata.js: 统一同步 README 版本徽章、README/AGENTS/CLAUDE 工具链矩阵与 package-lock 顶层版本元数据，支持 --check 校验
git-hooks/: Git Hook 模块目录，承载 pre-commit 自动同步并暂存元数据与工具链文档的闸门（详见 git-hooks/CLAUDE.md）

变更日志
2026-07-04: 扩展 `sync-version-metadata.js`，将 README/AGENTS/CLAUDE 工具链版本矩阵纳入 package.json 驱动的同步与 `--check` 校验；同步更新 pre-commit 暂存范围，避免文档矩阵漂移进入历史。
2026-03-10: 新增 `sync-wallpaper-snapshots.js`，把 Year/Life/Goal SVG 快照哈希的基线更新收敛成单一命令，避免视觉改动后手工复制 sha256 导致 CI 护栏滞后。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
