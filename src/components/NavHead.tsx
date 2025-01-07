import React, { memo } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { 
  LANGUAGES, 
  getCurrentLanguage, 
  saveLanguagePreference 
} from '../utils/language';

interface NavHeadProps {
  className?: string;
  onClose?: () => void;
}

const NavHead: React.FC<NavHeadProps> = memo(({ className = '', onClose }) => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = React.useState<string>(() => getCurrentLanguage());

  const handleLanguageChange = React.useCallback((code: string) => {
    const savedCode = saveLanguagePreference(code);
    setCurrentLang(savedCode);
    
    i18n.changeLanguage(savedCode).catch(err => {
      console.warn('Failed to load language:', err);
    });
    
    document.documentElement.setAttribute('lang', savedCode);
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
      <div className="flex items-center space-x-4">
        <div className="relative z-50">
          <LanguageSelector
            languages={LANGUAGES}
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
          />
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="关闭"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  );
});

NavHead.displayName = 'NavHead';

export default NavHead;