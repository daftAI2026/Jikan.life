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

    // Hero Section

    // Types Section
    'types.header': 'Choose Your Style',

    // Year Card
    'type.year.name': 'Year Progress',
    'type.year.description': 'Your year at a glance. Make every dot, and every moment, matter.',
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
    'type.goal.description': 'Keep track of your biggest moments. Count down to launches, vacations, and life milestones.',
    'type.goal.statTargetDate': 'Date',
    'type.goal.statTracking': 'Tracking',
    'type.goal.valueTarget': 'Target',
    'type.goal.valueDaily': 'Daily',

    // Stat Values
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // Common Button

    // Customize Section

    // Config Groups
    'config.location': 'Region',
    'config.locationTooltip': 'Use your region\'s timezone to keep wallpaper progress aligned with your local date.',
    'config.wallpaperLang': 'Wallpaper Language',
    'config.dateOfBirth': 'Date of Birth',
    'config.dateOfBirthHint': '(Optional)',
    'config.lifespan': 'Lifespan',
    'config.lifespanHint': '(Expected years)',
    'config.goalName': 'Goal Name',
    'config.dateRange': 'Date Range',
    'config.colors': 'Colors',
    'config.background': 'Background',
    'config.accent': 'Accent',
    'config.colorPresets': 'Presets',
    'config.device': 'Device',
    'config.deviceTooltip': 'iPhone is currently supported. Android support is coming in a future release.',
    'config.deviceResolution': 'Resolution',

    // Wallpaper Text (壁纸内部文字)

    // Color Presets

    // Preview
    'preview.hint': 'Live Preview',
    'preview.selectType': 'Select a wallpaper type',

    // URL & Copy
    'url.copy': 'Copy',
    'url.set': 'Copy & Set Up',
    'url.copySuccess': 'Link copied',
    'url.placeholder': 'Complete the options above first...',

    // Setup Section
    'setup.title': 'Setup',
    'setup.step.completed': 'Completed',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // Setup Steps - iOS
    'setup.ios.step1': 'Copy URL',
    'setup.ios.step1Desc': 'Configure your wallpaper and copy the generated URL',
    'setup.ios.step2': 'Create Personal Automation',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li>Open <strong>Shortcuts App</strong> → <strong>Automation </strong>Tab</li><li>Tap <strong>+ </strong>(Upper-right corner)</li><li><strong>Time of Day</strong>: <ul class="step-list-ul"><li><strong>6:00 AM</strong></li><li>Repeat: <strong>Daily</strong></li><li>Select <strong>Run Immediately</strong></li></ul></li><li>Tap <strong>Next</strong></li><li>Tap <strong>Create New Shortcut</strong></li></ul>',
    'setup.ios.step3': 'Configure Shortcut',
    'setup.ios.step3.action1': '1. Get Contents of URL:',
    'setup.ios.step3.action2': '2. Set Wallpaper Photo:',
    'setup.ios.step3.action2Desc': 'Choose only <strong>Lock Screen</strong> as the target.',
    'setup.ios.step3.copyTooltip': 'Copy URL',
    'setup.ios.step3.copiedTooltip': 'Copied',
    'setup.ios.step3.copyAction': 'Copy URL to clipboard',
    'setup.ios.step4': 'Finalize',
    'setup.ios.step4Desc': 'In "Set Wallpaper Photo", tap arrow (→):<br>Disable <strong>Crop to Subject</strong><br>Disable <strong>Show Preview</strong>',
    'setup.ios.step4Warning': 'In "Set Wallpaper Photo", tap arrow (→):<br>Disable <strong>Crop to Subject</strong><br>Disable <strong>Show Preview</strong>',

    // Setup Steps - Android
    'setup.android.step1': 'Copy URL',
    'setup.android.step1Desc': 'Configure your wallpaper and copy the generated URL',
    'setup.android.step2': 'Install MacroDroid',
    'setup.android.step2Desc': 'Download and install <strong>MacroDroid</strong> from the Play Store.',
    'setup.android.step3': 'Set Initial Trigger',
    'setup.android.step3Desc': 'Tap <strong>Trigger</strong> → <strong>Date/Time</strong>:<br><ul class="step-list-ul"><li>Time: <span class="code-snippet">00:01:00</span></li><li>Select all days (Mon–Sun)</li><li>Turn <strong>Use Alarm</strong> OFF</li></ul>',
    'setup.android.step4': 'Configure Actions',
    'setup.android.step4_1': 'Download Wallpaper',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li>Tap <strong>Actions</strong> → <strong>+</strong></li><li>Select <strong>Web Interaction</strong> → <strong>HTTP Request</strong></li><li>Choose <strong>GET</strong> method</li><li>Paste your copied URL</li><li>Enable <em>Block next action until complete</em></li><li>Enable <em>Save HTTP response to file</em></li><li>Choose a folder & enter filename: <span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step4_1Tip': '💡 Remember this folder for the next step',
    'setup.android.step4_2': 'Set Wallpaper',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li>Tap <strong>Actions</strong> → <strong>Device Settings</strong> → <strong>Set Wallpaper</strong></li><li>Choose <strong>Image</strong> → Tap OK</li><li>Select <strong>Home Screen & Lock Screen</strong></li><li>Choose <strong>Dynamic File Name</strong></li><li>Select the <em>same folder</em> as before</li><li>Enter the same filename: <span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': 'Finalize & Test',
    'setup.android.step5Desc': 'Tap the three dots <strong>(⋮)</strong> and select <strong>Test Macro</strong> to verify everything works.',

    // Footer

    // Language Selector
    'lang.select': 'Interface Language',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': 'Open menu',
    'registry.menu.close': 'Close menu',
    'registry.sidebar.toggle': 'Expand or collapse sidebar',

    // Goal-related
    'error.goalStart.outOfRange': 'Start Date must be between 1900-01-01 and 2100-12-31.',
    'error.goalDate.outOfRange': 'Target Date must be between 1900-01-01 and 2100-12-31.',
    'error.goalStart.afterTarget': 'Start Date must be on or before Target Date.',
    'error.goalDate.beforeStart': 'Target Date must be on or after Start Date.',

    // Placeholders
    'placeholder.selectCountry': 'Select country...',
    'placeholder.selectDate': 'Select date...',
    'placeholder.selectDateRange': 'Select date range...',
    'preset.range.next30': 'Next 30 days',
    'preset.range.next90': 'Next 90 days',
    'preset.range.today': 'Today',
    'preset.range.next7': 'Next 7 days',
    'placeholder.goalName': 'Type something…',

    // Debug messages
  },

  'zh-CN': {
    // 导航
    'nav.title': 'JIKAN',
    'nav.wallpapers': '壁纸',
    'nav.customize': '自定义',
    'nav.setup': '设置',

    // 英雄部分

    // 类型部分
    'types.header': '选择你的风格',

    // 年进度卡
    'type.year.name': '年度进度',
    'type.year.description': '一眼看清你的一整年，让每一个点、每一个瞬间都更有意义。',
    'type.year.statDay': '天',
    'type.year.statWeek': '周',
    'type.year.statComplete': '完成度',

    // 生命日历卡
    'type.life.name': '生命日历',
    'type.life.description': '把人生的每一周化成一个点，提醒你认真过好每一周。',
    'type.life.statWeeks': '总周数',
    'type.life.statYears': '年',

    // 目标倒计时卡
    'type.goal.name': '目标倒计时',
    'type.goal.description': '追踪你最重要的时刻，倒数发布、假期和人生里程碑。',
    'type.goal.statTargetDate': '日期',
    'type.goal.statTracking': '追踪',
    'type.goal.valueTarget': '目标',
    'type.goal.valueDaily': '每日',

    // 统计数值
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // 通用按钮

    // 自定义部分

    // 配置组
    'config.location': '地区',
    'config.locationTooltip': '根据你所在地区的时区，确保壁纸进度与本地日期同步。',
    'config.wallpaperLang': '壁纸语言',
    'config.dateOfBirth': '出生日期',
    'config.dateOfBirthHint': '（可选）',
    'config.lifespan': '预期寿命',
    'config.lifespanHint': '（预期年数）',
    'config.goalName': '目标名称',
    'config.dateRange': '日期区间',
    'config.colors': '颜色',
    'config.background': '背景',
    'config.accent': '强调色',
    'config.colorPresets': '预设',
    'config.device': '设备',
    'config.deviceTooltip': '目前仅支持 iPhone，Android 将在后续版本开放。',
    'config.deviceResolution': '分辨率',

    // 壁纸内部文字

    // 颜色预设

    // 预览
    'preview.hint': '实时预览',
    'preview.selectType': '选择一种壁纸类型',

    // URL 和复制
    'url.copy': '复制',
    'url.set': '复制并设置',
    'url.copySuccess': '链接已复制',
    'url.placeholder': '请先在上方完成配置...',

    // 设置部分
    'setup.title': '设置',
    'setup.step.completed': '已完成',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // 设置步骤 - iOS
    'setup.ios.step1': '复制 URL',
    'setup.ios.step1Desc': '配置你的壁纸并复制生成的 URL',
    'setup.ios.step2': '创建个人自动化',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li>打开 <strong>快捷指令</strong> → <strong>自动化</strong> 标签页</li><li>点击右上角的 <strong>+</strong></li><li><strong>特定时间</strong>：<ul class="step-list-ul"><li><strong>上午 6:00</strong></li><li>重复：<strong>每天</strong></li><li>选择 <strong>立即运行</strong></li></ul></li><li>点击 <strong>下一步</strong></li><li>点击 <strong>创建新快捷指令</strong></li></ul>',
    'setup.ios.step3': '配置快捷指令',
    'setup.ios.step3.action1': '1. 获取 URL 的内容：',
    'setup.ios.step3.action2': '2. 设定墙纸照片：',
    'setup.ios.step3.action2Desc': '仅选择 <strong>锁屏</strong> 作为目标。',
    'setup.ios.step3.copyTooltip': '复制 URL',
    'setup.ios.step3.copiedTooltip': '已复制',
    'setup.ios.step3.copyAction': '复制 URL 到剪贴板',
    'setup.ios.step4': '完成',
    'setup.ios.step4Desc': '在“设定墙纸照片”中，点击箭头 (→)：<br>关闭 <strong>裁剪到主体</strong><br>关闭 <strong>显示预览</strong>',
    'setup.ios.step4Warning': '在“设定墙纸照片”中，点击箭头 (→)：<br>关闭 <strong>裁剪到主体</strong><br>关闭 <strong>显示预览</strong>',

    // 设置步骤 - Android
    'setup.android.step1': '复制 URL',
    'setup.android.step1Desc': '配置你的壁纸并复制生成的 URL',
    'setup.android.step2': '安装 MacroDroid',
    'setup.android.step2Desc': '从 Play 商店下载并安装 <strong>MacroDroid</strong>。',
    'setup.android.step3': '设置触发器',
    'setup.android.step3Desc': '点击 <strong>触发器</strong> → <strong>日期/时间</strong>：<br><ul class="step-list-ul"><li>时间：<span class="code-snippet">00:01:00</span></li><li>全选日期 (周一至周日)</li><li>关闭 <strong>使用闹钟</strong></li></ul>',
    'setup.android.step4': '配置动作',
    'setup.android.step4_1': '下载壁纸',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li>点击 <strong>动作</strong> → <strong>+</strong></li><li>选择 <strong>网络交互</strong> → <strong>HTTP 请求</strong></li><li>选择 <strong>GET</strong> 方法</li><li>粘贴你复制的 URL</li><li>启用 <em>完成前阻止下一个动作</em></li><li>启用 <em>保存 HTTP 响应到文件</em></li><li>选择文件夹并输入文件名：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step4_1Tip': '💡 下一步需要用到这个文件夹',
    'setup.android.step4_2': '设置壁纸',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li>点击 <strong>动作</strong> → <strong>设备设置</strong> → <strong>设置墙纸</strong></li><li>选择 <strong>图像</strong> → 点击确定</li><li>选择 <strong>主屏幕与锁定屏幕</strong></li><li>选择 <strong>动态文件名</strong></li><li>选择<em>同一文件夹</em></li><li>输入相同文件名：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': '完成与测试',
    'setup.android.step5Desc': '点击右上角的三个点 <strong>(⋮)</strong> 并选择 <strong>测试宏 (Test Macro)</strong> 以验证设置。',

    // 页脚

    // 语言选择器
    'lang.select': '界面语言',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': '打开菜单',
    'registry.menu.close': '关闭菜单',
    'registry.sidebar.toggle': '展开或收起侧栏',

    // 目标相关
    'error.goalStart.outOfRange': '开始日期必须在 1900-01-01 到 2100-12-31 之间。',
    'error.goalDate.outOfRange': '目标日期必须在 1900-01-01 到 2100-12-31 之间。',
    'error.goalStart.afterTarget': '开始日期必须早于或等于目标日期。',
    'error.goalDate.beforeStart': '目标日期必须晚于或等于开始日期。',

    // 占位符
    'placeholder.selectCountry': '选择国家...',
    'placeholder.selectDate': '选择日期...',
    'placeholder.selectDateRange': '选择日期区间...',
    'preset.range.next30': '未来 30 天',
    'preset.range.next90': '未来 90 天',
    'preset.range.today': '今天',
    'preset.range.next7': '未来 7 天',
    'placeholder.goalName': '输入内容…',

    // 调试信息
  },

  'zh-TW': {
    // 導航
    'nav.title': 'JIKAN',
    'nav.wallpapers': '桌布',
    'nav.customize': '自訂',
    'nav.setup': '設定',

    // 英雄部分

    // 類型部分
    'types.header': '選擇你的風格',

    // 年進度卡
    'type.year.name': '年度進度',
    'type.year.description': '一眼看清你的一整年，讓每一個點、每一個瞬間都更有意義。',
    'type.year.statDay': '天',
    'type.year.statWeek': '週',
    'type.year.statComplete': '完成度',

    // 生命日曆卡
    'type.life.name': '生命日曆',
    'type.life.description': '把人生的每一週化成一個點，提醒你認真過好每一週。',
    'type.life.statWeeks': '總週數',
    'type.life.statYears': '年',

    // 目標倒計時卡
    'type.goal.name': '目標倒計時',
    'type.goal.description': '追蹤你最重要的時刻，倒數發布、假期和人生里程碑。',
    'type.goal.statTargetDate': '日期',
    'type.goal.statTracking': '追蹤',
    'type.goal.valueTarget': '目標',
    'type.goal.valueDaily': '每日',

    // 統計數值
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // 通用按鈕

    // 自訂部分

    // 配置組
    'config.location': '地區',
    'config.locationTooltip': '根據你所在地區的時區，確保桌布進度與本地日期同步。',
    'config.wallpaperLang': '桌布語言',
    'config.dateOfBirth': '出生日期',
    'config.dateOfBirthHint': '（選擇性）',
    'config.lifespan': '預期壽命',
    'config.lifespanHint': '（預期年數）',
    'config.goalName': '目標名稱',
    'config.dateRange': '日期區間',
    'config.colors': '顏色',
    'config.background': '背景',
    'config.accent': '強調色',
    'config.colorPresets': '預設',
    'config.device': '裝置',
    'config.deviceTooltip': '目前僅支援 iPhone，Android 將在後續版本開放。',
    'config.deviceResolution': '解析度',

    // 桌布內部文字

    // 顏色預設

    // 預覽
    'preview.hint': '即時預覽',
    'preview.selectType': '選擇一種桌布類型',

    // URL 和複製
    'url.copy': '複製',
    'url.set': '複製並設定',
    'url.copySuccess': '連結已複製',
    'url.placeholder': '請先在上方完成設定...',

    // 設定部分
    'setup.title': '設定',
    'setup.step.completed': '已完成',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // 設定步驟 - iOS
    'setup.ios.step1': '複製 URL',
    'setup.ios.step1Desc': '設定你的桌布並複製產生的 URL',
    'setup.ios.step2': '製作新的個人自動化操作',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li>開啟 <strong>捷徑</strong> → <strong>自動化</strong> 標籤頁</li><li>點擊右上角的 <strong>+</strong></li><li><strong>特定時間</strong>：<ul class="step-list-ul"><li><strong>上午 6:00</strong></li><li>重複：<strong>每天</strong></li><li>選擇 <strong>立即執行</strong></li></ul></li><li>點擊 <strong>下一步</strong></li><li>點擊 <strong>建立新捷徑</strong></li></ul>',
    'setup.ios.step3': '設定捷徑',
    'setup.ios.step3.action1': '1. 取得 URL 的內容：',
    'setup.ios.step3.action2': '2. 設定背景圖片：',
    'setup.ios.step3.action2Desc': '僅選擇 <strong>鎖定螢幕</strong> 作為目標。',
    'setup.ios.step3.copyTooltip': '複製 URL',
    'setup.ios.step3.copiedTooltip': '已複製',
    'setup.ios.step3.copyAction': '複製 URL 到剪貼簿',
    'setup.ios.step4': '完成',
    'setup.ios.step4Desc': '在「設定背景圖片」中，點擊箭頭 (→)：<br>關閉 <strong>裁切主體</strong><br>關閉 <strong>顯示預覽</strong>',
    'setup.ios.step4Warning': '在「設定背景圖片」中，點擊箭頭 (→)：<br>關閉 <strong>裁切主體</strong><br>關閉 <strong>顯示預覽</strong>',

    // 設定步驟 - Android
    'setup.android.step1': '複製 URL',
    'setup.android.step1Desc': '設定你的桌布並複製產生的 URL',
    'setup.android.step2': '安裝 MacroDroid',
    'setup.android.step2Desc': '從 Play 商店下載並安裝 <strong>MacroDroid</strong>。',
    'setup.android.step3': '設定觸發條件',
    'setup.android.step3Desc': '點擊 <strong>觸發條件</strong> → <strong>日期/時間</strong>：<br>時間：<span class="code-snippet">00:01:00</span><br>日期：<strong>全選</strong> (週一至週日)<br>鬧鐘：<strong>關閉 (OFF)</strong>',
    'setup.android.step4': '配置動作',
    'setup.android.step4_1': '下載桌布',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li>點擊 <strong>動作</strong> → <strong>+</strong></li><li>選擇 <strong>網路互動</strong> → <strong>HTTP 請求</strong></li><li>選擇 <strong>GET</strong> 方法</li><li>貼上您複製的 URL</li><li>啟用 <em>完成前阻止下一個動作</em></li><li>啟用 <em>保存 HTTP 回應到檔案</em></li><li>選擇資料夾並輸入檔案名稱：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step4_1Tip': '💡 請記住這個資料夾，下一步會用到',
    'setup.android.step4_2': '設定桌布',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li>點擊 <strong>動作</strong> → <strong>裝置設定</strong> → <strong>設定桌布</strong></li><li>選擇 <strong>圖像</strong> → 點擊確定</li><li>選擇 <strong>主螢幕與鎖定螢幕</strong></li><li>選擇 <strong>動態檔案名稱</strong></li><li>選擇<em>同一資料夾</em></li><li>輸入相同檔案名稱：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': '完成與測試',
    'setup.android.step5Desc': '點擊右上角的三個點 <strong>(⋮)</strong> 並選擇 <strong>測試巨集 (Test Macro)</strong> 以驗證設定。',

    // 頁腳

    // 語言選擇器
    'lang.select': '介面語言',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': '開啟選單',
    'registry.menu.close': '關閉選單',
    'registry.sidebar.toggle': '展開或收合側欄',

    // 目標相關
    'error.goalStart.outOfRange': '開始日期必須在 1900-01-01 到 2100-12-31 之間。',
    'error.goalDate.outOfRange': '目標日期必須在 1900-01-01 到 2100-12-31 之間。',
    'error.goalStart.afterTarget': '開始日期必須早於或等於目標日期。',
    'error.goalDate.beforeStart': '目標日期必須晚於或等於開始日期。',

    // 占位符
    'placeholder.selectCountry': '選擇國家...',
    'placeholder.selectDate': '選擇日期...',
    'placeholder.selectDateRange': '選擇日期區間...',
    'preset.range.next30': '未來 30 天',
    'preset.range.next90': '未來 90 天',
    'preset.range.today': '今天',
    'preset.range.next7': '未來 7 天',
    'placeholder.goalName': '輸入內容…',

    // 調試訊息
  },

  ja: {
    // ナビゲーション
    'nav.title': 'JIKAN',
    'nav.wallpapers': '壁紙',
    'nav.customize': 'カスタマイズ',
    'nav.setup': 'セットアップ',

    // ヒーローセクション

    // タイプセクション
    'types.header': 'スタイルを選択',

    // 年進度カード
    'type.year.name': '年間進捗',
    'type.year.description': '一年をひと目で。すべてのドットと、すべての瞬間を大切に。',
    'type.year.statDay': '日',
    'type.year.statWeek': '週',
    'type.year.statComplete': '完成度',

    // 人生カレンダーカード
    'type.life.name': '人生カレンダー',
    'type.life.description': '人生の毎週をドットで可視化。毎週を大切に生きるためのリマインダー。',
    'type.life.statWeeks': '総週数',
    'type.life.statYears': '年',

    // 目標カウントダウンカード
    'type.goal.name': '目標カウントダウン',
    'type.goal.description': '大切な瞬間を見逃さない。ローンチ、バケーション、そして人生のマイルストーンまでカウントダウン。',
    'type.goal.statTargetDate': '日付',
    'type.goal.statTracking': '追跡',
    'type.goal.valueTarget': '目標',
    'type.goal.valueDaily': '毎日',

    // 統計値
    'type.life.valueWeeks': '4,160',
    'type.life.valueYears': '80',

    // 共通ボタン

    // カスタマイズセクション

    // 設定グループ
    'config.location': '地域',
    'config.locationTooltip': 'お住まいの地域のタイムゾーンを使って、壁紙の進捗を現地の日付に同期します。',
    'config.wallpaperLang': '壁紙言語',
    'config.dateOfBirth': '生年月日',
    'config.dateOfBirthHint': '（オプション）',
    'config.lifespan': '予想寿命',
    'config.lifespanHint': '（予想年数）',
    'config.goalName': 'ゴール名',
    'config.dateRange': '期間',
    'config.colors': '色',
    'config.background': '背景',
    'config.accent': 'アクセント',
    'config.colorPresets': 'プリセット',
    'config.device': 'デバイス',
    'config.deviceTooltip': '現在は iPhone のみ対応しています。Android は今後のバージョンで対応予定です。',
    'config.deviceResolution': '解像度',

    // 壁紙内部文字

    // 色プリセット

    // プレビュー
    'preview.hint': 'ライブプレビュー',
    'preview.selectType': '壁紙タイプを選択してください',

    // URL とコピー
    'url.copy': 'コピー',
    'url.set': 'コピーして設定',
    'url.copySuccess': 'リンクをコピーしました',
    'url.placeholder': '先に上の設定を完了してください...',

    // セットアップセクション
    'setup.title': 'セットアップ',
    'setup.step.completed': '完了',
    'setup.ios': 'iOS',
    'setup.android': 'Android',

    // セットアップステップ - iOS
    'setup.ios.step1': 'URL をコピー',
    'setup.ios.step1Desc': '壁紙を設定し、生成された URL をコピーします',
    'setup.ios.step2': '個人用オートメーションを作成',
    'setup.ios.step2Desc': '<ul class="step-list-ul"><li><strong>ショートカット</strong>アプリ → <strong>オートメーション</strong>タブ</li><li>右上の <strong>+</strong> をタップ</li><li><strong>時刻</strong>：<ul class="step-list-ul"><li><strong>午前 6:00</strong></li><li>繰り返す：<strong>毎日</strong></li><li><strong>今すぐ実行</strong>を選択</li></ul></li><li><strong>次へ</strong>をタップ</li><li><strong>新規ショートカットを作成</strong>をタップ</li></ul>',
    'setup.ios.step3': 'ショートカットを設定',
    'setup.ios.step3.action1': '1. URL のコンテンツを取得：',
    'setup.ios.step3.action2': '2. 壁紙を設定：',
    'setup.ios.step3.action2Desc': 'ターゲットとして <strong>ロック画面</strong> のみを選択します。',
    'setup.ios.step3.copyTooltip': 'URL をコピー',
    'setup.ios.step3.copiedTooltip': 'コピーしました',
    'setup.ios.step3.copyAction': 'URL をクリップボードにコピー',
    'setup.ios.step4': '完了',
    'setup.ios.step4Desc': '「壁紙を設定」で矢印 (→) をタップ：<br>「被写体を切り取る」をオフ<br>「プレビューを表示」をオフ',
    'setup.ios.step4Warning': '「壁紙を設定」で矢印 (→) をタップ：<br>「被写体を切り取る」をオフ<br>「プレビューを表示」をオフ',

    // セットアップステップ - Android
    'setup.android.step1': 'URL をコピー',
    'setup.android.step1Desc': '壁紙を設定し、生成された URL をコピーします',
    'setup.android.step2': 'MacroDroid をインストール',
    'setup.android.step2Desc': 'Play ストアから <strong>MacroDroid</strong> をダウンロードしてインストールします。',
    'setup.android.step3': '最初のトリガーを設定',
    'setup.android.step3Desc': '<strong>トリガー</strong> → <strong>日付/時刻</strong> をタップ：<br>時刻：<span class="code-snippet">00:01:00</span><br>曜日：<strong>すべて選択</strong> (月〜日)<br>アラーム：<strong>オフ (OFF)</strong>',
    'setup.android.step4': 'アクションを設定',
    'setup.android.step4_1': '壁紙をダウンロード',
    'setup.android.step4_1Desc': '<ul class="step-list-ul"><li><strong>アクション</strong> → <strong>+</strong> をタップ</li><li><strong>ウェブ操作</strong> → <strong>HTTP リクエスト</strong> を選択</li><li><strong>GET</strong> を選択</li><li>コピーした URL を貼り付け</li><li><em>次のアクションまでブロック</em> を有効化</li><li><em>HTTP レスポンスをファイルに保存</em> を有効化</li><li>フォルダを選択してファイル名を入力：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step4_1Tip': '💡 このフォルダを覚えておいてください（次の手順で使用します）',
    'setup.android.step4_2': '壁紙を設定',
    'setup.android.step4_2Desc': '<ul class="step-list-ul"><li><strong>アクション</strong> → <strong>デバイス設定</strong> → <strong>壁紙を設定</strong> をタップ</li><li><strong>画像</strong> → OK をタップ</li><li><strong>ホーム画面とロック画面</strong> を選択</li><li><strong>動的なファイル名</strong> を選択</li><li><em>同じフォルダ</em> を選択</li><li>同じファイル名を入力：<span class="code-snippet">wallpaper.png</span></li></ul>',
    'setup.android.step5': '完了とテスト',
    'setup.android.step5Desc': '右上の三点リーダー <strong>(⋮)</strong> をタップし、<strong>マクロをテスト (Test Macro)</strong> を選択して動作を確認します。',

    // フッター

    // 言語セレクター
    'lang.select': '表示言語',
    'lang.en': 'English',
    'lang.zh-CN': '简体中文',
    'lang.zh-TW': '繁體中文',
    'lang.ja': '日本語',
    'registry.menu.open': 'メニューを開く',
    'registry.menu.close': 'メニューを閉じる',
    'registry.sidebar.toggle': 'サイドバーを開閉',

    // ゴール関連
    'error.goalStart.outOfRange': '開始日は 1900-01-01 から 2100-12-31 までの範囲で入力してください。',
    'error.goalDate.outOfRange': '目標日は 1900-01-01 から 2100-12-31 までの範囲で入力してください。',
    'error.goalStart.afterTarget': '開始日は目標日以前である必要があります。',
    'error.goalDate.beforeStart': '目標日は開始日以降である必要があります。',

    // プレースホルダ
    'placeholder.selectCountry': '国を選択...',
    'placeholder.selectDate': '日付を選択...',
    'placeholder.selectDateRange': '期間を選択...',
    'preset.range.next30': '次の 30 日',
    'preset.range.next90': '次の 90 日',
    'preset.range.today': '今日',
    'preset.range.next7': '次の 7 日',
    'placeholder.goalName': '入力してください…',

    // デバッグメッセージ
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
