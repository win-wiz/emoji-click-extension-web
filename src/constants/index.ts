export const FlagMaps = {
  en: '🇺🇸', // 英语
  zh: '🇨🇳', // 简体中文 
  cs: '🇨🇿', // 捷克语
  fr: '🇫🇷', // 法语
  de: '🇩🇪', // 德语
  es: '🇪🇸', // 西班牙语
  it: '🇮🇹', // 意大利语
  ja: '🇯🇵', // 日语
  ko: '🇰🇷', // 韩语
  nl: '🇳🇱', // 荷兰语
  'pt-BR': '🇵🇷',  // 巴西葡萄牙语
  ru: '🇷🇺', // 俄语
  uk: '🇺🇦', // 乌克兰语
  vi: '🇻🇳', // 越南语
  'zh-TW': '🇨🇭', // 繁体中文
  pt: '🇵🇹', // 葡萄牙语
  da: '🇩🇰', // 丹麦语
  el: '🇬🇷', // 希腊语
  no: '🇳🇴', // 挪威语
  fi: '🇫🇮', // 芬兰语
  sv: '🇸🇪', // 瑞典语
  th: '🇹🇭', // 泰语
  id: '🇮🇩', // 印度尼西亚语
  hi: '🇮🇳', // 印地语
  bn: '🇧🇩', // 孟加拉语
  ms: '🇲🇾', // 马来语
  tr: '🇹🇷', // 土耳其语
}

export function getLocaleFlag(locale: string) {
  return FlagMaps[locale as keyof typeof FlagMaps] || '🌐';
}