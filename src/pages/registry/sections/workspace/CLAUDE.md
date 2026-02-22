# workspace/
> L2 | 父级: /src/pages/registry/CLAUDE.md

成员清单
useHomeWallpaperConfig.js: 工作区状态核心，管理 selectedStyle 联动、配置更新、URL 生成与复制动作（UI 文案跟随全局 i18n）；Goal 模式包含 goalStart 字段、手动输入即时阻断校验与仅合法日期透传
HomePreviewPane.jsx: 左侧手机预览面板，使用 Canvas 实时渲染 year/life/goal 壁纸
HomeSettingsPane.jsx: 右侧设置面板主容器；当前阶段输出 `CARD_REGISTRY`（业务语义）+ `CARD_ORDER_BY_TYPE`（位置编排）双层六卡迁移骨架（year/life 已接入 Country/Wallpaper Language/Colors/Device，goal 模式在槽位③插入 `goal-fields` 并移出 `palettes`，输入控件宽度统一基线 `w-[200px] max-w-full`，并进入业务ID过渡态），导出 `SETTINGS_CARD_IDS`，并在开发态通过 `legacySettings=1` 条件挂载 LegacySettingsForm
SettingsCardShell.jsx: 右侧六卡统一壳组件，复刻 Kumo HomeGrid 单卡结构（左上标题 + 可选问号提示 + 右上序号 ①~⑥ + 中央 demo）并提供 `data-home-settings-card`（新ID）+ `data-home-settings-card-legacy`（旧ID）兼容选择器

结构
workspace/ - Home 双栏工作区子模块 (4 files)

架构决策
采用“状态 hook + 左右面板”分层，HomeGrid 只负责编排；右侧设置区采用“card registry（业务语义）+ card order by type（位置编排）+ 壳组件”模式，把“卡片是谁”和“卡片放哪”彻底解耦。`①~⑥` 固定为槽位 UX 编号，不承载业务语义。当前 `goal` 已启用独立卡序（插入第3卡 `goal-fields`，移出 `palettes`），`life` 暂时复用 `year`。

开发规范
只使用 Kumo token 与 `@/components/ui/*` 组件语义；任何配置字段新增必须同步更新 hook 输出和右侧表单映射，并同步 URL 参数链路。

变更日志
2026-02-11: 新增 preview|settings 双栏工作区，实现与左侧 style cards 的直接联动。
2026-02-11: 移除固定英文翻译器，改为使用 useI18n 提供的全局 t()。
2026-02-11: Wallpaper Language 下拉改为与顶部语言菜单一致的“国旗 + 原名”渲染语义与间距。
2026-02-13: Goal 配置新增 Start Date(goalStart)；桌面三列 1:1:1，移动端单列；手动输入与 picker 同步约束（1900~2100, start<=target）。
2026-02-14: Registry 日期输入从原生 type="date" 切换为 main 同源 react-aria DatePicker 接口接入（DOB/Goal Start/Goal Target）；本阶段仅完成功能替换，UI 精修后置。
2026-02-18: HomeSettingsPane 通过 `@/components/ui/kumo` 引用 Button/Input/Select，移除页面层对 `@cloudflare/kumo` 的直接依赖。
2026-02-18: Goal 日期硬约束统一为 `start<=target`；允许未来 Start Date 与过去 Target Date；前后端统一使用 1900-2100 范围校验。
2026-02-18: 第一阶段命名收口：`useHomeWallpaperConfig` / `HomePreviewPane` / `HomeSettingsPane` 取代 Registry* 在用导出名。
2026-02-18: 第二阶段右侧改造：引入 SettingsCardShell + 六卡 schema demo 骨架（复刻 Kumo HomeGrid 风格）；旧完整表单改为开发态 `legacySettings=1` 才挂载。
2026-02-18: 六卡右上角增加固定序号标记（①~⑥），用于步骤语义与视觉定位。
2026-02-22: 首卡（`basics`）从 Button demo 迁移为 Country Select，直接绑定 `config.country` / `actions.setCountry`；Select 宽度按原版 HomeGrid 示例对齐为 `w-[200px]`。
2026-02-22: 首卡左上角标题从组件名改回业务语义（`config.location`）并接回 `config.locationTooltip` 问号提示；卡壳支持 `titleTooltip` 可选渲染。
2026-02-22: 第二卡（`type-params`）从 Input demo 迁移为 Wallpaper Language Select，直接绑定 `config.wallpaperLang` / `actions.setWallpaperLang` 并复用 `languageOptions`（国旗 + 原名）；宽度与首卡统一为 `w-[200px]`。
2026-02-22: 前两卡进入业务ID过渡态：`basics -> location`、`type-params -> wallpaper-lang`；`SettingsCardShell` 同时输出新ID与 legacy ID 选择器，供迁移期兼容。
2026-02-22: 设置面板地基升级为 `CARD_REGISTRY + CARD_ORDER_BY_TYPE` 双层结构；渲染改为“按 type 取卡序 + 按槽位打 `①~⑥`”，业务语义与位置语义解耦，当前 `life/goal` 临时复用 `year` 顺序。
2026-02-22: 第三卡（`colors`）从 Switch demo 迁移为 Year Progress Colors 配置卡：中间分为 `Background`/`Accent` 两行 `ColorPicker`，底部接入 `palettePresets`，绑定 `setBackgroundColor` / `setAccentColor` / `applyPalette`，并暂定宽度基线 `w-[200px] max-w-full`。
2026-02-22: 第四卡（`device`）从 Dropdown demo 迁移为 Device Select：接回 `config.device` / `actions.setDevice`、保留 iPhone/Android/iPad 分组，并在 Select 下方显示 `config.deviceResolution`（`selectedDevice.width × selectedDevice.height`）；本轮保持最小迁移，Annotated Select 形态继续留在 `doc/TODO.md`。
2026-02-22: Goal Countdown 启用 type 专属卡序：在槽位③插入 `goal-fields`（Goal Name + Start Date + Target Date 三排），并在 goal 顺序中移出 `palettes`；year 顺序保持不变。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
