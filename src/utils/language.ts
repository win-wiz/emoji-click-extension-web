import { Language } from '../components/LanguageSelector';

// localStorage key
export const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

// 语言映射关系
const LANGUAGE_MAPPINGS: { [key: string]: string } = {
  'zh-CN': 'zh',
  'zh-SG': 'zh',
  'zh-HK': 'zh-TW',
  'zh-MO': 'zh-TW',
};

// 支持的语言列表
export const LANGUAGES: Language[] = [
  { code: 'zh', name: '简体中文' },
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
];

/**
 * 获取浏览器语言并匹配支持的语言
 * @returns 匹配到的语言代码
 */
export function getBrowserLanguage(): string {
  // 获取浏览器语言
  const browserLang = navigator.language;
  
  // 检查是否有直接映射
  if (LANGUAGE_MAPPINGS[browserLang]) {
    return LANGUAGE_MAPPINGS[browserLang];
  }
  
  // 完全匹配
  const exactMatch = LANGUAGES.find(lang => lang.code === browserLang);
  if (exactMatch) return exactMatch.code;
  
  // 部分匹配（例如 zh-CN 匹配 zh）
  const baseLang = browserLang.split('-')[0];
  const partialMatch = LANGUAGES.find(lang => 
    lang.code.startsWith(baseLang)
  );
  if (partialMatch) return partialMatch.code;
  
  // 如果是中文相关的语言代码，默认返回简体中文
  if (baseLang === 'zh') {
    return 'zh';
  }
  
  // 其他情况返回英文
  return 'en';
}

/**
 * 检查语言代码是否在支持的语言列表中
 */
export function isSupportedLanguage(code: string): boolean {
  return LANGUAGES.some(lang => lang.code === code);
}

/**
 * 保存语言设置到 localStorage
 */
export function saveLanguagePreference(langCode: string): string {
  const finalCode = isSupportedLanguage(langCode) ? langCode : getBrowserLanguage();
  localStorage.setItem(LANGUAGE_STORAGE_KEY, finalCode);
  return finalCode;
}

/**
 * 从 localStorage 获取保存的语言设置
 */
export function getSavedLanguage(): string {
  const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return savedLang && isSupportedLanguage(savedLang) ? savedLang : getBrowserLanguage();
}

/**
 * 获取当前应该使用的语言
 * 优先级：localStorage > 浏览器语言 > 中文
 */
export function getCurrentLanguage(): string {
  const savedLang = getSavedLanguage();
  return savedLang || getBrowserLanguage();
} 