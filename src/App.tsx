import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { fetchEmojiList, fetchEmojiExample, searchEmoji } from './services/api';
import { EmojiGroup, EmojiItem } from './types';
import { Language, LanguageSelector } from './components/LanguageSelector';
import { SearchInput } from './components/SearchInput';
import { CategoryNav } from './components/CategoryNav';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmojiGrid } from './components/EmojiGrid';
import { Toast } from './components/Toast';
import i18n from './i18n';
import { useTranslation } from 'react-i18next';
import SearchExample from './components/SearchExample';

// 语言配置
const LANGUAGES: Language[] = [
  { code: 'zh', name: '简体中文' },
  { code: 'en', name: 'English' },
  { code: 'zh-TW', name: '繁體中文' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
] as const;

type LanguageCode = typeof LANGUAGES[number]['code'];

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

// 提取常量
const RECENT_EMOJIS_LIMIT = 24;
const TOAST_DURATION = 1500;

const App: React.FC = () => {
  const { t } = useTranslation();
  const [emojiGroups, setEmojiGroups] = useState<Record<string, EmojiItem[]>>({});
  const [searchResults, setSearchResults] = useState<EmojiItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [recentEmojis, setRecentEmojis] = useState<EmojiItem[]>([]);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info' });
  const [isSearching, setIsSearching] = useState(false);
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    const savedLang = localStorage.getItem('preferredLanguage') as LanguageCode;
    return savedLang && LANGUAGES.some(lang => lang.code === savedLang) ? savedLang : 'en';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [icons, setIcons] = useState<string[]>([]);
  const [emojiExample, setEmojiExample] = useState<Record<string, any>[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();
  const toastTimeoutRef = useRef<NodeJS.Timeout>();

  // 优化 Toast 显示逻辑
  const showToastMessage = useCallback((message: string, type: ToastState['type'] = 'info') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message: t(message), type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ message: '', type: 'info' });
    }, TOAST_DURATION);
  }, [t]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // 优化 emoji 列表获取
  const getEmojiList = useCallback(async (lang: LanguageCode) => {
    setIsLoading(true);
    try {
      const data = await fetchEmojiList(lang);
      const groups: Record<string, EmojiItem[]> = {};
      const tmpIcons: string[] = [];
      
      data.forEach((group: EmojiGroup) => {
        try {
          const emojis: EmojiItem[] = Object.prototype.toString.call(group.emojis) === '[object String]' 
            ? JSON.parse(group.emojis) 
            : (group.emojis || []);
          groups[group.typeName] = emojis;
          tmpIcons.push(group.typeIcon);
        } catch (e) {
          console.error(t('errors.parseEmoji'), e);
        }
      });

      if (recentEmojis.length > 0) {
        groups[t('categories.recent')] = recentEmojis;
      }

      setEmojiGroups(groups);
      setIcons(tmpIcons);
      
      if (!activeCategory || !(activeCategory in groups)) {
        setActiveCategory(Object.keys(groups)[0]);
      }
      showToastMessage('toast.load.success', 'success');
    } catch (error) {
      // console.error(t('errors.fetchEmoji'), error);  7890-1·旧344
      showToastMessage('toast.load.error', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [recentEmojis, showToastMessage, t]);

  // 初始化应用
  useEffect(() => {
    getEmojiList(currentLang);
  }, [currentLang, getEmojiList]);

  // 获取emoji示例
  const fetchEmojiExampleData = useCallback(async () => {
    try {
      const data = await fetchEmojiExample(currentLang);
      setEmojiExample(data);
    } catch (error) {
      console.error(t('errors.fetchEmoji'), error);
    }
  }, [currentLang, t]);

  useEffect(() => {
    fetchEmojiExampleData();
  }, [currentLang, fetchEmojiExampleData]);

  // 优化搜索结果处理
  const mappedSearchResults = useMemo(() => 
    searchResults.map(emoji => ({
      id: emoji.code,
      text: t('search.result.text', { code: emoji.code, name: emoji.name }),
      emoji: {
        code: emoji.code,
        name: emoji.name,
        hot: emoji.hot,
        type: emoji.type,
        typeName: emoji.typeName || t('emoji.type.default', { type: emoji.type })
      }
    })), [searchResults, t]);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchKeyword(value);
  }, []);

  const handleSearch = useCallback(async (keyword: string) => {
    setIsSearching(true);
    try {
      const data = await searchEmoji({ keyword, language: currentLang });
      setSearchResults(data);
    } catch (error) {
      showToastMessage('toast.search.error', 'error');
    } finally {
      setIsSearching(false);
    }
  }, [currentLang, showToastMessage]);

  const handleEmojiClick = useCallback(async (emoji: EmojiItem) => {
    try {
      await navigator.clipboard.writeText(emoji.code);
      showToastMessage('toast.copy.success', 'success');
      
      const updatedRecent = [emoji, ...recentEmojis.filter(e => e.code !== emoji.code)]
        .slice(0, RECENT_EMOJIS_LIMIT);
      setRecentEmojis(updatedRecent);
      
      if (!isSearching) {
        setEmojiGroups(prev => ({
          ...prev,
          [t('categories.recent')]: updatedRecent
        }));
      }
    } catch (error) {
      console.error(t('errors.copy'), error);
      showToastMessage('toast.copy.error', 'error');
    }
  }, [recentEmojis, isSearching, showToastMessage, t]);

  const handleLanguageChange = useCallback((code: LanguageCode) => {
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

  // 优化渲染逻辑
  const renderContent = useMemo(() => {
    if (isLoading && Object.keys(emojiGroups).length > 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      );
    }

    if (!activeCategory) return null;

    const isSearchView = activeCategory === t('search.results');
    const emojis = isSearchView ? searchResults : emojiGroups[activeCategory];

    if (!emojis) return null;

    return (
      <EmojiGrid
        category={activeCategory}
        emojis={emojis}
        onEmojiClick={handleEmojiClick}
      />
    );
  }, [isLoading, emojiGroups, activeCategory, searchResults, t, handleEmojiClick]);

  const handleExampleClick = useCallback((example: string) => {
    setSearchKeyword(example);
    handleSearch(example);
  }, [setSearchKeyword, handleSearch]);

  return (
    <div className="flex flex-col bg-white w-[550px] max-h-screen px-2 py-3">
      <div className="bg-white sticky top-0 z-40">
        
        <div className="flex items-center gap-2">
          <SearchInput
            value={searchKeyword}
            onChange={handleSearchInputChange}
            onSearch={handleSearch}
            onClear={() => setSearchResults([])}
            isSearching={isSearching}
            searchResults={mappedSearchResults}
            onSelectResult={(result) => {
              const emoji = searchResults.find(e => e.code === result.id);
              if (emoji) {
                handleEmojiClick(emoji);
              }
            }}
          />
          <div className="flex-shrink-0">
            <LanguageSelector
              languages={LANGUAGES}
              currentLang={currentLang}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        {/* 关键词 */}
        <SearchExample 
          examples={emojiExample} 
          onExampleClick={handleExampleClick}
          onRefresh={fetchEmojiExampleData}
        />

      </div>

      <div className="flex flex-1 overflow-hidden border rounded-md min-h-[500px]">
        <CategoryNav
          categories={emojiGroups}
          activeCategory={activeCategory}
          icons={icons}
          onCategoryChange={setActiveCategory}
          isLoading={isLoading && Object.keys(emojiGroups).length === 0}
        />
        <div className="flex-1 min-w-0 overflow-auto">
          {renderContent}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
};

export default React.memo(App); 
