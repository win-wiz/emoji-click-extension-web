import i18n from './index';
import { getBrowserLanguage } from '../utils/language';

// 获取浏览器语言并初始化
const browserLang = getBrowserLanguage();

// 设置浏览器语言
i18n.changeLanguage(browserLang);

// 设置初始的文档语言
document.documentElement.setAttribute('lang', browserLang);

// 设置初始的页面标题和描述
const setInitialMetadata = () => {
  // 设置页面标题
  document.title = i18n.t('meta.title');

  // 设置页面描述
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', i18n.t('meta.description'));
  }
};

// 在 i18n 准备好后设置元数据
i18n.on('initialized', setInitialMetadata);

// 监听语言变化
i18n.on('languageChanged', setInitialMetadata);

export default i18n; 