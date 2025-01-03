import React, { memo } from 'react';
import { LanguageSelector, Language } from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// 语言配置
const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '简体中文' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
];

interface NavHeadProps {
  className?: string;
}

const NavHead: React.FC<NavHeadProps> = memo(({ className = '' }) => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = React.useState<string>(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    return savedLang && LANGUAGES.some(lang => lang.code === savedLang) ? savedLang : 'en';
  });

  const handleLanguageChange = React.useCallback((code: string) => {
    setCurrentLang(code);
    localStorage.setItem('preferredLanguage', code);
    i18n.changeLanguage(code).catch(err => {
      console.warn('Failed to load language:', err);
    });
    document.documentElement.setAttribute('lang', code);
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    }
    document.title = t('meta.title');
  }, [t]);

  return (
    <div className={`
      flex items-center justify-between
      bg-white
      pt-4
      ${className}
    `}>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <span className="text-2xl transform hover:scale-110 transition-transform duration-200">🤖</span>
          </div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
            EmojiClick
          </h1>
        </div>
      </div>
      <div className="flex items-center">
        <div className="relative z-50">
          <LanguageSelector
            languages={LANGUAGES}
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
          />
        </div>
      </div>
    </div>
  );
});

NavHead.displayName = 'NavHead';

export default NavHead;