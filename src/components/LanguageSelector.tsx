import React, { useState, memo, useCallback, useMemo } from 'react';
import { getLocaleFlag } from '../constants';

export interface Language {
  code: string;
  name: string;
}

interface LanguageSelectorProps {
  languages: Language[];
  currentLang: string;
  onLanguageChange: (code: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = memo(({
  languages,
  currentLang = 'en',
  onLanguageChange,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = useCallback(() => {
    setShowMenu(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  const currentLanguage = useMemo(() => 
    languages.find(lang => lang.code === currentLang)?.name,
    [languages, currentLang]
  );

  const handleLanguageSelect = useCallback((code: string) => {
    onLanguageChange(code);
    setShowMenu(false);
  }, [onLanguageChange]);

  return (
    <div className="relative z-20">
      <button
        className="h-10 w-40 border justify-between border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors flex items-center gap-2 relative z-10"
        onClick={toggleMenu}
      >
        <span className="flex-1">{getLocaleFlag(currentLang)} {currentLanguage}</span>
        <span className="text-gray-400 mr-4">▼</span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={closeMenu}
          />
          <div className="absolute right-0 top-12 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`
                  w-full px-4 py-2.5 
                  text-left 
                  cursor-pointer 
                  hover:bg-gray-100 
                  hover:text-blue-600
                  active:bg-gray-200
                  ${currentLang === lang.code ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}
                  transition-all duration-150 ease-in-out
                  border-b border-gray-100 last:border-b-0
                `}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                {getLocaleFlag(lang.code)} {lang.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}); 