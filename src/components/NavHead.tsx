import React, { memo } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { 
  LANGUAGES, 
  getCurrentLanguage, 
  saveLanguagePreference 
} from '../utils/language';
// @ts-ignore
import logo from '../images/logo.png';

interface NavHeadProps {
  className?: string;
  onClose?: () => void;
}

const NavHead: React.FC<NavHeadProps> = memo(({ onClose }) => {
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
    <div className="flex items-center justify-between h-12 pt-2">
      <div className="flex items-center gap-2">
        <img 
          src={logo} 
          alt="EmojiClick" 
          className="h-8 w-8"
        />
        <span className="text-lg font-bold text-gray-900">EmojiClick</span>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSelector
          languages={LANGUAGES}
          currentLang={currentLang}
          onLanguageChange={handleLanguageChange}
        />
        {onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
});

NavHead.displayName = 'NavHead';

export default NavHead;