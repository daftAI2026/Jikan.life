# 🌍 JIKAN 多语言实现指南

> **一份快速参考文档，说明如何添加新语言或修改翻译**

---

## 快速查看

**当前支持的语言**：
- 🇺🇸 English (en)
- 🇨🇳 简体中文 (zh-CN)
- 🇹🇼 繁體中文 (zh-TW)
- 🇯🇵 日本語 (ja)

**自动检测顺序**：
1. 用户 `localStorage` 保存的选择
2. URL参数 `?lang=zh-CN`
3. 访问者IP国家（Cloudflare 自动注入 `data-country`）
4. 浏览器语言设置
5. 默认 English

---

## 翻译基线（i18n 固定规则）

以后通过 i18n 自动化流程批量做多语言翻译时，统一遵循以下原则：

1. **Accuracy**: Preserve original meaning faithfully
2. **Fluency**: Natural target language word order and expression
3. **Conciseness**: Conversational tone, no redundancy — subtitles must be brief
4. **Consistency**: Same term = same translation throughout the entire file

### i18n 提示词模板（可直接复用）

```text
You are translating UI copy for JIKAN.

Translation Principles:
1. Accuracy: Preserve original meaning faithfully
2. Fluency: Natural target language word order and expression
3. Conciseness: Conversational tone, no redundancy — subtitles must be brief
4. Consistency: Same term = same translation throughout the entire file

Requirements:
- Keep product terms consistent with existing i18n entries.
- Keep each line short and natural for UI cards/subtitles.
- Return only the translated text in the requested format.
```

---

## 核心架构

### 1. `src/data/i18n.js` - 数据源 (Single Source of Truth)
存放所有翻译字符串和国家映射。

```js
export const i18nData = {
  en: { 'nav.title': 'Jikan.life', ... },
  'zh-CN': { 'nav.title': 'Jikan.life', ... },
};

export const countryToLang = { US: 'en', CN: 'zh-CN', ... };
```

### 2. `src/lib/I18nContext.jsx` - 状态管理
React Context 提供全局语言状态。它在应用启动时执行语言检测逻辑。

### 3. 组件消费
我们使用 `useI18n` Hook 来获取翻译，而不是旧的 DOM 操作。

```jsx
import { useI18n } from '@/lib/I18nContext';

export function MyComponent() {
  const { t } = useI18n();
  
  return <button>{t('button.save')}</button>;
}
```

---

## 常见任务指南

### 任务 1：修改现有翻译
直接编辑 `src/data/i18n.js`。

```js
// src/data/i18n.js
'zh-CN': {
  'hero.title': '你的时间。', // 修改这里
}
```

### 任务 2：添加新的 UI 文本

1. **在组件中使用 `t('key')`**：
   ```jsx
   <h1>{t('my.new.title')}</h1>
   ```
2. **在 `src/data/i18n.js` 添加所有语言的翻译**：
   ```js
   'my.new.title': 'New Title',        // en
   'my.new.title': '新标题',           // zh-CN
   ```

### 任务 3：添加新语言 (例如韩语 ko)

1. **在 `src/data/i18n.js` 添加数据**：
   ```js
   export const i18nData = {
     // ...
     ko: {
       'nav.title': 'Jikan.life',
       // ... 复制并翻译所有 Key
     }
   };
   ```
2. **注册语言**：
   ```js
   export const SUPPORTED_LANGS = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
   ```
3. **添加字体** (可选)：
   在 `index.html` 的 Google Fonts 链接中加入 `Noto+Sans+KR`。
   在 `src/index.css` 中定义字体变量（目前字体由 CSS 自动回退处理，通常无需额外操作）。

### 任务 4：调试
在 URL 添加参数测试强制切换：
`http://localhost:5173/?lang=ja`

---

## 字体策略
为了最佳性能，我们在 `index.html` 中预加载了 Google Fonts：
- **Inter**: 英文/数字
- **Noto Sans SC**: 简体中文
- **Noto Sans TC**: 繁体中文
- **Noto Sans JP**: 日文

CSS 变量定义在 `src/index.css`，浏览器会根据字符集自动回退到正确的字体。

## 合规性检查清单

- [ ] `src/data/i18n.js` 包含所有翻译键，无遗漏。
- [ ] 不要使用硬编码文本，所有 UI 文本必须包裹在 `t()` 中。
- [ ] 确保新增的 Key 在所有语言块中都存在（即使暂时用英文占位）。
- [ ] `I18nContext` 必须包裹应用根节点 (当前在 `src/App.jsx` 中处理)。

---

## 联系方式
架构问题请查阅 `CLAUDE.md`。
