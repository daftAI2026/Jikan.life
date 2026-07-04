# data/
> L2 | 父级: /src/CLAUDE.md

成员清单
countries.js: 国家/地区数据代理，复用 shared/countries.js
devices.js: 设备规格数据，包含 iPhone/Android/iPad 屏幕参数；iPhone 展示项按单机型拆分，补齐 12 mini/16 Pro/16 Pro Max/17 Air，并提供旧连写名称归一函数
i18n.js: 前端国际化字典，包含 en/zh-CN/zh-TW/ja 翻译字符串、workspace 字段级 tooltip 文案、无障碍 labels、剪贴板失败错误与主题/Setup 控件文案
social-links.js: 社交入口配置 (GitHub/Xiaohongshu)，供 HomeTopbar 使用
terminology-reference.md: 官方 iOS (Shortcuts) 与 Android (MacroDroid) 术语参考指南，用于对齐翻译准则

变更日志
2026-07-04: i18n 补齐 ColorPicker、Select、preview SVG、主题切换、Setup 关闭、Reveal all 与剪贴板失败错误的四语文案，避免 UI 语言切换后无障碍层仍显示英文。

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
