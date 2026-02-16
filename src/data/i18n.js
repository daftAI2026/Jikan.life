/**
 * [INPUT]: 无依赖
 * [OUTPUT]: i18n 全局对象，提供 get(key) 方法获取当前语言翻译
 * [POS]: data/ 的翻译字符串管理模块，被 i18n-loader.js 和 app.js 消费
 * [PROTOCOL]: 新增翻译时更新此文件，然后检查语言完整性
 */

export const i18nData = {
  en: {
    // Navigation
    'nav.title': 'JIKAN',
    'nav.wallpapers': 'Wallpapers',
    'nav.customize': 'Customize',
    'nav.setup': 'Setup',
    'nav.github': 'GitHub',

    // Hero Section
    'hero.eyebrow': 'Dynamic Wallpapers',
    'hero.title': 'Your time.',
    'hero.titleAccent': 'Visualized.',
    'hero.subtitle': 'Wallpapers that update daily. Track your year, your life, or countdown to your goals.',
    'hero.cta': 'Get Started',

    // Types Section
    'types.header': 'Choose Your Style',
    'types.title': 'Three ways to see your time',

    // Year Card
    'type.year.name': 'Year Progress',
    'type.year.description': 'Every day of the year as a grid. Watch your year fill up, one square at a time.',
    'type.year.statDay': 'Days',
    'type.year.statWeek': 'Weeks',
    'type.year.statComplete': 'Complete',

    // Life Card
    'type.life.name': 'Life Calendar',
    'type.life.description': 'Every week of your life as a dot. A powerful reminder to make each week count.',
    'type.life.statWeeks': 'Total Weeks',
    'type.life.statYears': 'Years',

    // Goal Card
    'type.goal.name': 'Goal Countdown',
    'type.goal.description': 'Count down to what matters. Big launch, vacation, or life milestone.',
    'type.goal.statGoals': 'Goals',
    'type.goal.statUpdates': 'Updates',
    'type.goal.valueDaily': 'Daily',

    // Stat Values
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // Common Button
    'button.select': 'Select',
    'button.selected': 'Selected',

    // Customize Section
    'customize.header': 'Personalize',
    'customize.title': 'Make it yours',
    'customize.selected': 'Selected:',
    'customize.selectedNone': 'None',

    // Config Groups
    'config.location': 'Location',
    'config.locationTooltip': 'Ensures the wallpaper day progress matches your local time by using your country\'s timezone.',
    'config.wallpaperLang': 'Wallpaper Language',
    'config.dateOfBirth': 'Date of Birth',
    'config.dateOfBirthHint': '(Optional)',
    'config.lifespan': 'Lifespan',
    'config.lifespanHint': '(Expected years)',
    'config.goalName': 'Goal Name',
    'config.startDate': 'Start Date',
    'config.targetDate': 'Target Date',
    'config.colors': 'Colors',
    'config.background': 'Background',
    'config.accent': 'Accent',
    'config.accentAdjusted': 'Auto-adjusted',
    'config.colorPresets': 'Presets',
    'config.device': 'Device',
    'config.deviceResolution': 'Resolution',
    'config.url': 'Your Wallpaper URL',

    // Wallpaper Text (壁纸内部文字)
    'wallpaper.daysLeft': '{n} days left',
    'wallpaper.dayLeft': '{n} day left',
    'wallpaper.complete': '{n}% complete',
    'wallpaper.weeksLeft': '{n} weeks left',
    'wallpaper.weekLeft': '{n} week left',
    'wallpaper.lived': '{n}% lived',

    // Color Presets
    'preset.classic': 'Classic',
    'preset.gold': 'Gold',
    'preset.cyan': 'Cyan',
    'preset.red': 'Red',
    'preset.green': 'Green',

    // Preview
    'preview.hint': 'Live Preview',
    'preview.selectType': 'Select a wallpaper type',

    // URL & Copy
    'url.copy': 'Copy',
    'url.copied': 'Copied!',
    'url.placeholder': 'Configure options above...',

    // Setup Section
    'setup.header': 'Almost There',
    'setup.title': 'Set it and forget it',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // Setup Steps - iOS
    'setup.ios.step1': 'Copy URL',
    'setup.ios.step1Desc': 'Configure your wallpaper above and copy the generated URL',
    'setup.ios.step2': 'Create Personal Automation',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li>Open <strong>Shortcuts App</strong> → <strong>Automation </strong>Tab</li><li>Tap <strong>+ </strong>(Upper-right corner)</li><li><strong>Time of Day</strong>: <ul class="step-list-ul"><li><strong>6:00 AM</strong></li><li>Repeat: <strong>Daily</strong></li><li>Select <strong>Run Immediately</strong></li></ul></li><li>Tap <strong>Next</strong></li><li>Tap <strong>Create New Shortcut</strong></li></ul>',
    'setup.ios.step3': 'Configure Shortcut',
    'setup.ios.step3Desc': '<strong>1. Get Contents of URL:</strong><br><span class="code-snippet">https://jikan.flydogcn.workers.dev/generate?...</span><br><br><strong>2. Set Wallpaper Photo:</strong><br>Choose only <strong>Lock Screen</strong> as the target.',
    'setup.ios.step4': 'Finalize',
    'setup.ios.step4Desc': '<span class="highlight-badge">In "Set Wallpaper Photo", tap arrow (→):<br>Disable <strong>Crop to Subject</strong><br>Disable <strong>Show Preview</strong></span>',
    'setup.ios.step4Warning': 'In "Set Wallpaper Photo", tap arrow (→):<br>Disable <strong>Crop to Subject</strong><br>Disable <strong>Show Preview</strong>',

    // Setup Steps - Android
    'setup.android.step1': 'Copy URL',
    'setup.android.step1Desc': 'Configure your wallpaper above and copy the generated URL',
    'setup.android.step2': 'Install MacroDroid',
    'setup.android.step2Desc': 'Download and install <strong>MacroDroid</strong> from the Play Store.',
    'setup.android.step3': 'Set Initial Trigger',
    'setup.android.step3Desc': 'Tap <strong>Trigger</strong> → <strong>Date/Time</strong>:<br><ul class="step-list-ul"><li>Time: <span class="code-snippet">00:01:00</span></li><li>Select all days (Mon–Sun)</li><li>Turn <strong>Use Alarm</strong> OFF</li></ul>',
    'setup.android.step4': 'Configure Actions',
    'setup.android.step4_1': 'Download Wallpaper',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li>Tap <strong>Actions</strong> → <strong>+</strong></li><li>Select <strong>Web Interaction</strong> → <strong>HTTP Request</strong></li><li>Choose <strong>GET</strong> method</li><li>Paste your copied URL</li><li>Enable <em>Block next action until complete</em></li><li>Enable <em>Save HTTP response to file</em></li><li>Choose a folder & enter filename: <span class="code-snippet">wallpaper.png</span></li></ul><span class="highlight-badge text-[10px] items-center gap-1 mt-2 flex">💡 Remember this folder for the next step</span>',
    'setup.android.step4_2': 'Set Wallpaper',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li>Tap <strong>Actions</strong> → <strong>Device Settings</strong> → <strong>Set Wallpaper</strong></li><li>Choose <strong>Image</strong> → Tap OK</li><li>Select <strong>Home Screen & Lock Screen</strong></li><li>Choose <strong>Dynamic File Name</strong></li><li>Select the <em>same folder</em> as before</li><li>Enter the same filename: <span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': 'Finalize & Test',
    'setup.android.step5Desc': 'Tap the three dots <strong>(⋮)</strong> and select <strong>Test Macro</strong> to verify everything works.',

    // Footer
    'footer.tagline': 'Time, visualized.',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing': 'Pricing',
    'footer.changelog': 'Changelog',
    'footer.resources': 'Resources',
    'footer.docs': 'Documentation',
    'footer.design': 'Design System',
    'footer.about': 'About',
    'footer.license': 'License',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',

    // Language Selector
    'lang.select': 'Language',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': 'Open menu',
    'registry.menu.close': 'Close menu',
    'registry.sidebar.toggle': 'Toggle sidebar',

    // Goal-related
    'goal.dayLeft': 'day left',
    'goal.daysLeft': 'days left',
    'warning.goalStartFuture': 'Start Date is in the future. Progress may look unusual.',
    'error.goalStart.outOfRange': 'Start Date must be between 1900-01-01 and today.',
    'error.goalDate.outOfRange': 'Target Date must be between today and 2100-12-31.',
    'error.goalStart.afterTarget': 'Start Date must be on or before Target Date.',
    'error.goalDate.beforeStart': 'Target Date must be on or after Start Date.',

    // Placeholders
    'placeholder.selectCountry': 'Select country...',
    'placeholder.selectDate': 'Select date...',
    'placeholder.selectStartDate': 'Select start date...',
    'placeholder.selectTargetDate': 'Select target date...',
    'placeholder.goalName': 'Product Launch',
    'placeholder.selectTypeFirst': 'Select type first',

    // Debug messages
    'debug.autoDetectFailed': 'Could not auto-detect country',
    'debug.copyFailed': 'Failed to copy:',
  },

  'zh-CN': {
    // 导航
    'nav.title': 'JIKAN',
    'nav.wallpapers': '壁纸',
    'nav.customize': '自定义',
    'nav.setup': '设置',
    'nav.github': 'GitHub',

    // 英雄部分
    'hero.eyebrow': '动态壁纸',
    'hero.title': '你的时间',
    'hero.titleAccent': '可视化',
    'hero.subtitle': '每日更新的壁纸。追踪你的一年、你的人生，或倒计时到你的目标。',
    'hero.cta': '开始使用',

    // 类型部分
    'types.header': '选择你的风格',
    'types.title': '三种观看时间的方式',

    // 年进度卡
    'type.year.name': '年度进度',
    'type.year.description': '365 天网格一览。\n眼见你的年度逐日填满。',
    'type.year.statDay': '天',
    'type.year.statWeek': '周',
    'type.year.statComplete': '完成度',

    // 生命日历卡
    'type.life.name': '生命日历',
    'type.life.description': '将人生的每一周化作点阵。\n每一周都值得铭记。',
    'type.life.statWeeks': '总周数',
    'type.life.statYears': '年',

    // 目标倒计时卡
    'type.goal.name': '目标倒计时',
    'type.goal.description': '倒数时光。为产品发布、假期或人生里程碑而准备。',
    'type.goal.statGoals': '目标',
    'type.goal.statUpdates': '更新',
    'type.goal.valueDaily': '每日',

    // 统计数值
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // 通用按钮
    'button.select': '选择',
    'button.selected': '已选择',

    // 自定义部分
    'customize.header': '个性化',
    'customize.title': '定义你的风格',
    'customize.selected': '已选择：',
    'customize.selectedNone': '无',

    // 配置组
    'config.location': '位置',
    'config.locationTooltip': '通过你所在国家的时区，确保壁纸进度与你本地的日期完全同步。',
    'config.wallpaperLang': '壁纸语言',
    'config.dateOfBirth': '出生日期',
    'config.dateOfBirthHint': '（可选）',
    'config.lifespan': '预期寿命',
    'config.lifespanHint': '（预期年数）',
    'config.goalName': '目标名称',
    'config.startDate': '开始日期',
    'config.targetDate': '目标日期',
    'config.colors': '颜色',
    'config.background': '背景',
    'config.accent': '强调色',
    'config.accentAdjusted': '已自动调整',
    'config.colorPresets': '预设',
    'config.device': '设备',
    'config.deviceResolution': '分辨率',
    'config.url': '你的壁纸 URL',

    // 壁纸内部文字
    'wallpaper.daysLeft': '剩余 {n} 天',
    'wallpaper.dayLeft': '剩余 {n} 天',
    'wallpaper.complete': '进度 {n}%',
    'wallpaper.weeksLeft': '剩余 {n} 周',
    'wallpaper.weekLeft': '剩余 {n} 周',
    'wallpaper.lived': '已度过 {n}%',

    // 颜色预设
    'preset.classic': '经典',
    'preset.gold': '金色',
    'preset.cyan': '青色',
    'preset.red': '红色',
    'preset.green': '绿色',

    // 预览
    'preview.hint': '实时预览',
    'preview.selectType': '选择一种壁纸类型',

    // URL 和复制
    'url.copy': '复制',
    'url.copied': '已复制！',
    'url.placeholder': '在上方配置选项...',

    // 设置部分
    'setup.header': '即将完成',
    'setup.title': '设置一次，永久使用',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // 设置步骤 - iOS
    'setup.ios.step1': '复制 URL',
    'setup.ios.step1Desc': '在上方配置你的壁纸并复制生成的 URL',
    'setup.ios.step2': '创建个人自动化',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li>打开 <strong>快捷指令</strong> → <strong>自动化</strong> 标签页</li><li>点击右上角的 <strong>+</strong></li><li><strong>特定时间</strong>：<ul class="step-list-ul"><li><strong>上午 6:00</strong></li><li>重复：<strong>每天</strong></li><li>选择 <strong>立即运行</strong></li></ul></li><li>点击 <strong>下一步</strong></li><li>点击 <strong>创建新快捷指令</strong></li></ul>',
    'setup.ios.step3': '配置快捷指令',
    'setup.ios.step3Desc': '<strong>1. 获取 URL 的内容：</strong><br><span class="code-snippet">https://jikan.flydogcn.workers.dev/generate?...</span><br><br><strong>2. 设定墙纸照片：</strong><br>仅选择 <strong>锁屏</strong> 作为目标。',
    'setup.ios.step4': '完成',
    'setup.ios.step4Desc': '<span class="highlight-badge">在“设定墙纸照片”中，点击箭头 (→)：<br>关闭 <strong>裁剪到主体</strong><br>关闭 <strong>显示预览</strong></span>',
    'setup.ios.step4Warning': '在“设定墙纸照片”中，点击箭头 (→)：<br>关闭 <strong>裁剪到主体</strong><br>关闭 <strong>显示预览</strong>',

    // 设置步骤 - Android
    'setup.android.step1': '复制 URL',
    'setup.android.step1Desc': '在上方配置你的壁纸并复制生成的 URL',
    'setup.android.step2': '安装 MacroDroid',
    'setup.android.step2Desc': '从 Play 商店下载并安装 <strong>MacroDroid</strong>。',
    'setup.android.step3': '设置触发器',
    'setup.android.step3Desc': '点击 <strong>触发器</strong> → <strong>日期/时间</strong>：<br><ul class="step-list-ul"><li>时间：<span class="code-snippet">00:01:00</span></li><li>全选日期 (周一至周日)</li><li>关闭 <strong>使用闹钟</strong></li></ul>',
    'setup.android.step4': '配置动作',
    'setup.android.step4_1': '下载壁纸',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li>点击 <strong>动作</strong> → <strong>+</strong></li><li>选择 <strong>网络交互</strong> → <strong>HTTP 请求</strong></li><li>选择 <strong>GET</strong> 方法</li><li>粘贴你复制的 URL</li><li>启用 <em>完成前阻止下一个动作</em></li><li>启用 <em>保存 HTTP 响应到文件</em></li><li>选择文件夹并输入文件名：<span class="code-snippet">wallpaper.png</span></li></ul><span class="highlight-badge text-[10px] items-center gap-1 mt-2 flex">💡 下一步需要用到这个文件夹</span>',
    'setup.android.step4_2': '设置壁纸',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li>点击 <strong>动作</strong> → <strong>设备设置</strong> → <strong>设置墙纸</strong></li><li>选择 <strong>图像</strong> → 点击确定</li><li>选择 <strong>主屏幕与锁定屏幕</strong></li><li>选择 <strong>动态文件名</strong></li><li>选择<em>同一文件夹</em></li><li>输入相同文件名：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': '完成与测试',
    'setup.android.step5Desc': '点击右上角的三个点 <strong>(⋮)</strong> 并选择 <strong>测试宏 (Test Macro)</strong> 以验证设置。',

    // 页脚
    'footer.tagline': '人生不只是格子。让时间可视化，让每天都有意义。',
    'footer.product': '产品',
    'footer.features': '功能特性',
    'footer.pricing': '定价方案',
    'footer.changelog': '更新日志',
    'footer.resources': '资源',
    'footer.docs': '使用文档',
    'footer.design': '设计系统',
    'footer.about': '关于',
    'footer.license': '开源协议',
    'footer.privacy': '隐私政策',
    'footer.terms': '服务条款',

    // 语言选择器
    'lang.select': '语言',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': '打开菜单',
    'registry.menu.close': '关闭菜单',
    'registry.sidebar.toggle': '切换侧栏',

    // 目标相关
    'goal.dayLeft': '天剩余',
    'goal.daysLeft': '天剩余',
    'warning.goalStartFuture': '开始日期晚于今天，进度展示可能不准确。',
    'error.goalStart.outOfRange': '开始日期必须在 1900-01-01 到今天之间。',
    'error.goalDate.outOfRange': '目标日期必须在今天到 2100-12-31 之间。',
    'error.goalStart.afterTarget': '开始日期必须早于或等于目标日期。',
    'error.goalDate.beforeStart': '目标日期必须晚于或等于开始日期。',

    // 占位符
    'placeholder.selectCountry': '选择国家...',
    'placeholder.selectDate': '选择日期...',
    'placeholder.selectStartDate': '选择开始日期...',
    'placeholder.selectTargetDate': '选择目标日期...',
    'placeholder.goalName': '产品发布',
    'placeholder.selectTypeFirst': '请先选择类型',

    // 调试信息
    'debug.autoDetectFailed': '无法自动检测国家',
    'debug.copyFailed': '复制失败：',
  },

  'zh-TW': {
    // 導航
    'nav.title': 'JIKAN',
    'nav.wallpapers': '桌布',
    'nav.customize': '自訂',
    'nav.setup': '設定',
    'nav.github': 'GitHub',

    // 英雄部分
    'hero.eyebrow': '動態桌布',
    'hero.title': '你的時間',
    'hero.titleAccent': '視覺化',
    'hero.subtitle': '每日更新的桌布。追蹤你的一年、你的人生，或倒數計時到你的目標。',
    'hero.cta': '開始使用',

    // 類型部分
    'types.header': '選擇你的風格',
    'types.title': '三種觀看時間的方式',

    // 年進度卡
    'type.year.name': '年度進度',
    'type.year.description': '365 天網格一覽。\n眼見你的年度逐日填滿。',
    'type.year.statDay': '天',
    'type.year.statWeek': '週',
    'type.year.statComplete': '完成度',

    // 生命日曆卡
    'type.life.name': '生命日曆',
    'type.life.description': '將人生的每一週化作點陣。\n每一週都值得銘記。',
    'type.life.statWeeks': '總週數',
    'type.life.statYears': '年',

    // 目標倒計時卡
    'type.goal.name': '目標倒計時',
    'type.goal.description': '倒數時光。為產品發佈、假期或人生里程碑而準備。',
    'type.goal.statGoals': '目標',
    'type.goal.statUpdates': '更新',
    'type.goal.valueDaily': '每日',

    // 統計數值
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // 通用按鈕
    'button.select': '選擇',
    'button.selected': '已選擇',

    // 自訂部分
    'customize.header': '個人化',
    'customize.title': '打造專屬風格',
    'customize.selected': '已選擇：',
    'customize.selectedNone': '無',

    // 配置組
    'config.location': '位置',
    'config.locationTooltip': '透過你所在國家的時區，確保桌布進度與你當地的日期完全同步。',
    'config.wallpaperLang': '桌布語言',
    'config.dateOfBirth': '出生日期',
    'config.dateOfBirthHint': '（選擇性）',
    'config.lifespan': '預期壽命',
    'config.lifespanHint': '（預期年數）',
    'config.goalName': '目標名稱',
    'config.startDate': '開始日期',
    'config.targetDate': '目標日期',
    'config.colors': '顏色',
    'config.background': '背景',
    'config.accent': '強調色',
    'config.accentAdjusted': '已自動調整',
    'config.colorPresets': '預設',
    'config.device': '裝置',
    'config.deviceResolution': '解析度',
    'config.url': '你的桌布 URL',

    // 桌布內部文字
    'wallpaper.daysLeft': '剩餘 {n} 天',
    'wallpaper.dayLeft': '剩餘 {n} 天',
    'wallpaper.complete': '進度 {n}%',
    'wallpaper.weeksLeft': '剩餘 {n} 週',
    'wallpaper.weekLeft': '剩餘 {n} 週',
    'wallpaper.lived': '已度過 {n}%',

    // 顏色預設
    'preset.classic': '經典',
    'preset.gold': '金色',
    'preset.cyan': '青色',
    'preset.red': '紅色',
    'preset.green': '綠色',

    // 預覽
    'preview.hint': '即時預覽',
    'preview.selectType': '選擇一種桌布類型',

    // URL 和複製
    'url.copy': '複製',
    'url.copied': '已複製！',
    'url.placeholder': '在上方設定選項...',

    // 設定部分
    'setup.header': '即將完成',
    'setup.title': '設定一次，永久使用',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // 設定步驟 - iOS
    'setup.ios.step1': '複製 URL',
    'setup.ios.step1Desc': '在上方設定你的桌布並複製產生的 URL',
    'setup.ios.step2': '製作新的個人自動化操作',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li>開啟 <strong>捷徑</strong> → <strong>自動化</strong> 標籤頁</li><li>點擊右上角的 <strong>+</strong></li><li><strong>特定時間</strong>：<ul class="step-list-ul"><li><strong>上午 6:00</strong></li><li>重複：<strong>每天</strong></li><li>選擇 <strong>立即執行</strong></li></ul></li><li>點擊 <strong>下一步</strong></li><li>點擊 <strong>建立新捷徑</strong></li></ul>',
    'setup.ios.step3': '設定捷徑',
    'setup.ios.step3Desc': '<strong>1. 取得 URL 的內容：</strong><br><span class="code-snippet">https://jikan.flydogcn.workers.dev/generate?...</span><br><br><strong>2. 設定背景圖片：</strong><br>僅選擇 <strong>鎖定螢幕</strong> 作為目標。',
    'setup.ios.step4': '完成',
    'setup.ios.step4Desc': '<span class="highlight-badge">在「設定背景圖片」中，點擊箭頭 (→)：<br>關閉 <strong>裁切主體</strong><br>關閉 <strong>顯示預覽</strong></span>',
    'setup.ios.step4Warning': '在「設定背景圖片」中，點擊箭頭 (→)：<br>關閉 <strong>裁切主體</strong><br>關閉 <strong>顯示預覽</strong>',

    // 設定步驟 - Android
    'setup.android.step1': '複製 URL',
    'setup.android.step1Desc': '在上方設定你的桌布並複製產生的 URL',
    'setup.android.step2': '安裝 MacroDroid',
    'setup.android.step2Desc': '從 Play 商店下載並安裝 <strong>MacroDroid</strong>。',
    'setup.android.step3': '設定觸發條件',
    'setup.android.step3Desc': '點擊 <strong>觸發條件</strong> → <strong>日期/時間</strong>：<br>時間：<span class="code-snippet">00:01:00</span><br>日期：<strong>全選</strong> (週一至週日)<br>鬧鐘：<strong>關閉 (OFF)</strong>',
    'setup.android.step4': '配置動作',
    'setup.android.step4_1': '下載桌布',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li>點擊 <strong>動作</strong> → <strong>+</strong></li><li>選擇 <strong>網路互動</strong> → <strong>HTTP 請求</strong></li><li>選擇 <strong>GET</strong> 方法</li><li>貼上您複製的 URL</li><li>啟用 <em>完成前阻止下一個動作</em></li><li>啟用 <em>保存 HTTP 回應到檔案</em></li><li>選擇資料夾並輸入檔案名稱：<span class="code-snippet">wallpaper.png</span></li></ul><span class="highlight-badge text-[10px] items-center gap-1 mt-2 flex">💡 請記住這個資料夾，下一步會用到</span>',
    'setup.android.step4_2': '設定桌布',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li>點擊 <strong>動作</strong> → <strong>裝置設定</strong> → <strong>設定桌布</strong></li><li>選擇 <strong>圖像</strong> → 點擊確定</li><li>選擇 <strong>主螢幕與鎖定螢幕</strong></li><li>選擇 <strong>動態檔案名稱</strong></li><li>選擇<em>同一資料夾</em></li><li>輸入相同檔案名稱：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': '完成與測試',
    'setup.android.step5Desc': '點擊右上角的三個點 <strong>(⋮)</strong> 並選擇 <strong>測試巨集 (Test Macro)</strong> 以驗證設定。',

    // 頁腳
    'footer.tagline': '人生不只是格子。讓時間可視化，讓每天都有意義。',
    'footer.product': '產品',
    'footer.features': '功能特性',
    'footer.pricing': '定價方案',
    'footer.changelog': '更新日誌',
    'footer.resources': '資源',
    'footer.docs': '使用文檔',
    'footer.design': '設計系統',
    'footer.about': '關於',
    'footer.license': '開源協議',
    'footer.privacy': '隱私政策',
    'footer.terms': '服務條款',

    // 語言選擇器
    'lang.select': '語言',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': '開啟選單',
    'registry.menu.close': '關閉選單',
    'registry.sidebar.toggle': '切換側欄',

    // 目標相關
    'goal.dayLeft': '天',
    'goal.daysLeft': '天',
    'warning.goalStartFuture': '開始日期晚於今天，進度顯示可能不準確。',
    'error.goalStart.outOfRange': '開始日期必須在 1900-01-01 到今天之間。',
    'error.goalDate.outOfRange': '目標日期必須在今天到 2100-12-31 之間。',
    'error.goalStart.afterTarget': '開始日期必須早於或等於目標日期。',
    'error.goalDate.beforeStart': '目標日期必須晚於或等於開始日期。',

    // 占位符
    'placeholder.selectCountry': '選擇國家...',
    'placeholder.selectDate': '選擇日期...',
    'placeholder.selectStartDate': '選擇開始日期...',
    'placeholder.selectTargetDate': '選擇目標日期...',
    'placeholder.goalName': '產品發佈',
    'placeholder.selectTypeFirst': '請先選擇類型',

    // 調試訊息
    'debug.autoDetectFailed': '無法自動偵測國家',
    'debug.copyFailed': '複製失敗：',
  },

  ja: {
    // ナビゲーション
    'nav.title': 'JIKAN',
    'nav.wallpapers': '壁紙',
    'nav.customize': 'カスタマイズ',
    'nav.setup': 'セットアップ',
    'nav.github': 'GitHub',

    // ヒーローセクション
    'hero.eyebrow': 'ダイナミック壁紙',
    'hero.title': 'あなたの時間を',
    'hero.titleAccent': 'ビジュアル化',
    'hero.subtitle': '毎日更新される壁紙。あなたの1年、人生、または目標までのカウントダウンを追跡します。',
    'hero.cta': '開始する',

    // タイプセクション
    'types.header': 'スタイルを選択',
    'types.title': '時間を見る3つの方法',

    // 年進度カード
    'type.year.name': '年進度',
    'type.year.description': '365日をグリッドで一覧。毎日が積み重なっていく様を眼で見守ってください。',
    'type.year.statDay': '日',
    'type.year.statWeek': '週',
    'type.year.statComplete': '完成度',

    // 人生カレンダーカード
    'type.life.name': '人生カレンダー',
    'type.life.description': '人生の毎週をドット化。\n毎週の価値を視覚化。',
    'type.life.statWeeks': '総週数',
    'type.life.statYears': '年',

    // 目標カウントダウンカード
    'type.goal.name': '目標カウントダウン',
    'type.goal.description': '時刻を数える。\n大型ローンチ、休暇、または人生の大切なマイルストーンへの準備。',
    'type.goal.statGoals': '目標',
    'type.goal.statUpdates': '更新',
    'type.goal.valueDaily': '毎日',

    // 統計値
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // 共通ボタン
    'button.select': '選択',
    'button.selected': '選択済み',

    // カスタマイズセクション
    'customize.header': 'パーソナライズ',
    'customize.title': '自分好みに',
    'customize.selected': '選択済み：',
    'customize.selectedNone': 'なし',

    // 設定グループ
    'config.location': '位置',
    'config.locationTooltip': 'お住まいの地域のタイムゾーンを使用することで、壁紙の進捗が現地の時間と正確に一致するようにします。',
    'config.wallpaperLang': '壁紙言語',
    'config.dateOfBirth': '生年月日',
    'config.dateOfBirthHint': '（オプション）',
    'config.lifespan': '予想寿命',
    'config.lifespanHint': '（予想年数）',
    'config.goalName': 'ゴール名',
    'config.startDate': '開始日',
    'config.targetDate': 'ターゲット日',
    'config.colors': '色',
    'config.background': '背景',
    'config.accent': 'アクセント',
    'config.accentAdjusted': '自動調整済み',
    'config.colorPresets': 'プリセット',
    'config.device': 'デバイス',
    'config.deviceResolution': '解像度',
    'config.url': 'あなたの壁紙 URL',

    // 壁紙内部文字
    'wallpaper.daysLeft': '残り {n} 日',
    'wallpaper.dayLeft': '残り {n} 日',
    'wallpaper.complete': '{n}% 完了',
    'wallpaper.weeksLeft': '残り {n} 週',
    'wallpaper.weekLeft': '残り {n} 週',
    'wallpaper.lived': '{n}% 生きた',

    // 色プリセット
    'preset.classic': 'クラシック',
    'preset.gold': 'ゴールド',
    'preset.cyan': 'シアン',
    'preset.red': '赤',
    'preset.green': '緑',

    // プレビュー
    'preview.hint': 'ライブプレビュー',
    'preview.selectType': '壁紙タイプを選択してください',

    // URL とコピー
    'url.copy': 'コピー',
    'url.copied': 'コピーしました！',
    'url.placeholder': '上でオプションを設定してください...',

    // セットアップセクション
    'setup.header': 'もうすぐです',
    'setup.title': '設定して忘れる',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // セットアップステップ - iOS
    'setup.ios.step1': 'URL をコピー',
    'setup.ios.step1Desc': '上で壁紙を設定し、生成された URL をコピーします',
    'setup.ios.step2': '個人用オートメーションを作成',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li><strong>ショートカット</strong>アプリ → <strong>オートメーション</strong>タブ</li><li>右上の <strong>+</strong> をタップ</li><li><strong>時刻</strong>：<ul class="step-list-ul"><li><strong>午前 6:00</strong></li><li>繰り返す：<strong>毎日</strong></li><li><strong>今すぐ実行</strong>を選択</li></ul></li><li><strong>次へ</strong>をタップ</li><li><strong>新規ショートカットを作成</strong>をタップ</li></ul>',
    'setup.ios.step3': 'ショートカットを設定',
    'setup.ios.step3Desc': '<strong>1. URL のコンテンツを取得：</strong><br><span class="code-snippet">https://jikan.flydogcn.workers.dev/generate?...</span><br><br><strong>2. 壁紙を設定：</strong><br>ターゲットとして <strong>ロック画面</strong> のみを選択します。',
    'setup.ios.step4': '完了',
    'setup.ios.step4Desc': '<span class="highlight-badge">「壁紙を設定」で矢印 (→) をタップ：<br>「被写体を切り取る」をオフ<br>「プレビューを表示」をオフ</span>',
    'setup.ios.step4Warning': '「壁紙を設定」で矢印 (→) をタップ：<br>「被写体を切り取る」をオフ<br>「プレビューを表示」をオフ',

    // セットアップステップ - Android
    'setup.android.step1': 'URL をコピー',
    'setup.android.step1Desc': '上で壁紙を設定し、生成された URL をコピーします',
    'setup.android.step2': 'MacroDroid をインストール',
    'setup.android.step2Desc': 'Play ストアから <strong>MacroDroid</strong> をダウンロードしてインストールします。',
    'setup.android.step3': '最初のトリガーを設定',
    'setup.android.step3Desc': '<strong>トリガー</strong> → <strong>日付/時刻</strong> をタップ：<br>時刻：<span class="code-snippet">00:01:00</span><br>曜日：<strong>すべて選択</strong> (月〜日)<br>アラーム：<strong>オフ (OFF)</strong>',
    'setup.android.step4': 'アクションを設定',
    'setup.android.step4_1': '壁紙をダウンロード',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li><strong>アクション</strong> → <strong>+</strong> をタップ</li><li><strong>ウェブ操作</strong> → <strong>HTTP リクエスト</strong> を選択</li><li><strong>GET</strong> を選択</li><li>コピーした URL を貼り付け</li><li><em>次のアクションまでブロック</em> を有効化</li><li><em>HTTP レスポンスをファイルに保存</em> を有効化</li><li>フォルダを選択してファイル名を入力：<span class="code-snippet">wallpaper.png</span></li></ul><span class="highlight-badge text-[10px] items-center gap-1 mt-2 flex">💡 このフォルダを覚えておいてください（次の手順で使用します）</span>',
    'setup.android.step4_2': '壁紙を設定',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li><strong>アクション</strong> → <strong>デバイス設定</strong> → <strong>壁紙を設定</strong> をタップ</li><li><strong>画像</strong> → OK をタップ</li><li><strong>ホーム画面とロック画面</strong> を選択</li><li><strong>動的なファイル名</strong> を選択</li><li><em>同じフォルダ</em> を選択</li><li>同じファイル名を入力：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': '完了とテスト',
    'setup.android.step5Desc': '右上の三点リーダー <strong>(⋮)</strong> をタップし、<strong>マクロをテスト (Test Macro)</strong> を選択して動作を確認します。',

    // フッター
    'footer.tagline': '人生は格子だけじゃない。時間をビジュアル化して、毎日を意味あるものに。',
    'footer.product': 'プロダクト',
    'footer.features': '機能',
    'footer.pricing': '価格',
    'footer.changelog': '変更履歴',
    'footer.resources': 'リソース',
    'footer.docs': 'ドキュメント',
    'footer.design': 'デザインシステム',
    'footer.about': 'について',
    'footer.license': 'ライセンス',
    'footer.privacy': 'プライバシーポリシー',
    'footer.terms': '利用規約',

    // 言語セレクター
    'lang.select': '言語',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': 'メニューを開く',
    'registry.menu.close': 'メニューを閉じる',
    'registry.sidebar.toggle': 'サイドバーを切り替える',

    // ゴール関連
    'goal.dayLeft': '日残り',
    'goal.daysLeft': '日残り',
    'warning.goalStartFuture': '開始日が未来です。進捗表示が不自然になる可能性があります。',
    'error.goalStart.outOfRange': '開始日は 1900-01-01 から今日までの範囲で入力してください。',
    'error.goalDate.outOfRange': '目標日は今日から 2100-12-31 までの範囲で入力してください。',
    'error.goalStart.afterTarget': '開始日は目標日以前である必要があります。',
    'error.goalDate.beforeStart': '目標日は開始日以降である必要があります。',

    // プレースホルダ
    'placeholder.selectCountry': '国を選択...',
    'placeholder.selectDate': '日付を選択...',
    'placeholder.selectStartDate': '開始日を選択...',
    'placeholder.selectTargetDate': '目標日を選択...',
    'placeholder.goalName': '製品ローンチ',
    'placeholder.selectTypeFirst': 'まずタイプを選択',

    // デバッグメッセージ
    'debug.autoDetectFailed': '国を自動検出できませんでした',
    'debug.copyFailed': 'コピーに失敗しました：',
  }
};

// 国家到语言的映射
export const countryToLang = {
  // English
  US: 'en', GB: 'en', AU: 'en', CA: 'en', NZ: 'en', IE: 'en', ZA: 'en',
  // 简体中文
  CN: 'zh-CN', SG: 'zh-CN',
  // 繁體中文
  TW: 'zh-TW', HK: 'zh-TW', MO: 'zh-TW',
  // 日本語
  JP: 'ja',
};

// 语言展示元数据（单一真相源）
export const LANGUAGE_META = [
  { code: 'en', flag: '🇺🇸', short: 'EN', labelKey: 'lang.en' },
  { code: 'zh-CN', flag: '🇨🇳', short: 'CN', labelKey: 'lang.zh-CN' },
  { code: 'zh-TW', flag: '🇨🇳', short: 'TW', labelKey: 'lang.zh-TW' },
  { code: 'ja', flag: '🇯🇵', short: 'JP', labelKey: 'lang.ja' },
];

// 默认语言
export const DEFAULT_LANG = 'en';

// 支持的所有语言
export const SUPPORTED_LANGS = LANGUAGE_META.map((item) => item.code);
