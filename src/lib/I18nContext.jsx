/**
 * [INPUT]: 依赖 @/data/i18n 的 i18nData 和 countryToLang，依赖 date-fns/locale 的语言包
 * [OUTPUT]: 对外提供 I18nProvider, useI18n hook, useDateFnsLocale hook 和 t(key) 函数
 * [POS]: lib/ 的国际化适配器，将老项目的 i18n 逻辑注入 React 生命周期
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { i18nData, countryToLang, DEFAULT_LANG, SUPPORTED_LANGS } from '@/data/i18n';
import { enUS, zhCN, zhTW, ja } from 'date-fns/locale';

/* ── date-fns locale 映射 ────────────────────────────── */
const DATE_FNS_LOCALES = {
    'en': enUS,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
    'ja': ja,
};

const I18nContext = createContext(null);

export const I18nProvider = ({ children }) => {
    const [lang, setLang] = useState(DEFAULT_LANG);

    // 语言检测逻辑 (深度复刻 i18n-loader.js)
    const detectLanguage = useCallback(() => {
        // 1. LocalStorage
        const saved = localStorage.getItem('preferredLang');
        if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

        // 2. URL params
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

        // 3. IP Geolocation (via Worker injected data-country)
        const country = document.documentElement.getAttribute('data-country');
        if (country && countryToLang[country]) return countryToLang[country];

        // 4. Browser language
        const browserLang = navigator.language.split('-')[0];
        const mappedLang = SUPPORTED_LANGS.find(l => l.startsWith(browserLang));
        if (mappedLang) return mappedLang;

        return DEFAULT_LANG;
    }, []);

    useEffect(() => {
        const initialLang = detectLanguage();
        setLang(initialLang);
        document.documentElement.lang = initialLang;
    }, [detectLanguage]);

    const changeLanguage = (newLang) => {
        if (SUPPORTED_LANGS.includes(newLang)) {
            setLang(newLang);
            localStorage.setItem('preferredLang', newLang);
            document.documentElement.lang = newLang;

            // 同步更新网页字体 (如果需要动态加载)
            const event = new CustomEvent('i18n-changed', { detail: { lang: newLang } });
            window.dispatchEvent(event);
        }
    };

    const t = useCallback((key, params = {}) => {
        const translations = i18nData[lang] || i18nData[DEFAULT_LANG];
        let text = translations[key] || i18nData[DEFAULT_LANG][key] || key;

        // 支持变量替换，例如 {n}
        Object.keys(params).forEach(p => {
            text = text.replace(`{${p}}`, params[p]);
        });

        return text;
    }, [lang]);

    const value = {
        lang,
        setLanguage: changeLanguage,
        t,
        supportedLangs: SUPPORTED_LANGS
    };

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within an I18nProvider');
    }
    return context;
};

/**
 * 返回当前语言对应的 date-fns locale 对象
 * 供 react-day-picker / Kumo DatePicker 的 locale prop 使用
 */
export const useDateFnsLocale = () => {
    const { lang } = useI18n();
    return useMemo(() => DATE_FNS_LOCALES[lang] || enUS, [lang]);
};
