/**
 * [INPUT]: n/a (Documentation file)
 * [OUTPUT]: Standardized terminology for iOS (Shortcuts) and Android (MacroDroid) setup instructions
 * [POS]: src/data/ 模块的术语基准文档，指导 i18n.js 的翻译校对
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

# Jikan.life Terminology Reference Guide

This document serves as the **Source of Truth** for device-specific setup terminology used in Jikan.life.

## iOS (Apple Shortcuts & Automation)

To get standard terminology for a specific language, refer to the official Apple Shortcuts User Guide:
`https://support.apple.com/guide/shortcuts/create-a-new-personal-automation-apd602971e63/[LOCALE]`

| Locale | Language | Reference URL |
| :--- | :--- | :--- |
| **en** | English | [English Guide](https://support.apple.com/guide/shortcuts/create-a-new-personal-automation-apd602971e63/ios) |
| **zh-CN** | Simplified Chinese | [简体中文指南](https://support.apple.com/guide/shortcuts/create-a-new-personal-automation-apd602971e63/18.0/ios/18.0) |
| **zh-TW** | Traditional Chinese | [繁體中文指南](https://support.apple.com/guide/shortcuts/create-a-new-personal-automation-apd602971e63/18.0/ios/18.0) |
| **ja** | Japanese | [日本語ガイド](https://support.apple.com/guide/shortcuts/create-a-new-personal-automation-apd602971e63/18.0/ios/18.0) |

### iOS Terminology Mapping

| English (en) | Simplified Chinese (zh-CN) | Traditional Chinese (zh-TW) | Japanese (ja) |
| :--- | :--- | :--- | :--- |
| Create Personal Automation | 创建个人自动化 | 製作個人自動化操作 | 個人用オートメーションを作成 |
| Time of Day | 特定时间 | 特定時間 | 時刻 |
| Run Immediately | 立即运行 | 立即執行 | 今すぐ执行 |
| New Blank Automation | 创建新快捷指令 | 建立新捷徑 | 新規ショートカットを作成 |
| Set Wallpaper Photo | 设定墙纸照片 | 設定背景圖片 | 壁紙を設定 |
| Lock Screen | 锁屏 | 鎖定螢幕 | ロック画面 |

## Android (MacroDroid)

For Android-specific automation logic and UI terminology, refer to the official MacroDroid Wiki:

- **Official Wiki**: [MacroDroid Wiki](https://macrodroidforum.com/wiki/index.php/MacroDroid_Wiki)

---
**Protocol**: When updating `src/data/i18n.js`, ensure all instructions and terminology align with the official documentation above.
