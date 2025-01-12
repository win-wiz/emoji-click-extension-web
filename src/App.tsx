import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { fetchEmojiList, fetchEmojiExample, searchEmoji } from './services/api';
import { EmojiGroup, EmojiItem } from './types';
import { SearchInput } from './components/SearchInput';
import { CategoryNav } from './components/CategoryNav';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmojiGrid } from './components/EmojiGrid';
import { Toast } from './components/Toast';
import { useTranslation } from 'react-i18next';
import SearchExample from './components/SearchExample';
import NavHead from './components/NavHead';
import i18n from './i18n';
import { LANGUAGE_STORAGE_KEY, getCurrentLanguage } from './utils/language';

// 提取常量
const TOAST_DURATION = 1500;

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

const App: React.FC = () => {
  const { t } = useTranslation();
  const [emojiGroups, setEmojiGroups] = useState<Record<string, EmojiItem[]>>({});
  const [searchResults, setSearchResults] = useState<EmojiItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'info' });
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [icons, setIcons] = useState<string[]>([]);
  const [emojiExample, setEmojiExample] = useState<Record<string, any>[]>([]);
  const toastTimeoutRef = useRef<NodeJS.Timeout>();
  const prevLangRef = useRef(i18n.language);
  const isInitializedRef = useRef(false);

  // 优化 emoji 列表获取
  const getEmojiList = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentLang = getCurrentLanguage();
      const data = await fetchEmojiList(currentLang);
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
          console.error('Parse emoji error:', e);
        }
      });

      setEmojiGroups(groups);
      setIcons(tmpIcons);
      
      if (!activeCategory || !(activeCategory in groups)) {
        const categories = Object.keys(groups);
        setActiveCategory(categories[0]);
      }
    } catch (error) {
      console.error('Failed to load emoji list:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory]);

  // 监听语言变化和初始化
  useEffect(() => {
    const currentLang = i18n.language;
    
    // 首次加载或语言变化时调用
    if (!isInitializedRef.current || prevLangRef.current !== currentLang) {
      prevLangRef.current = currentLang;
      isInitializedRef.current = true;
      getEmojiList();
    }
  }, [i18n.language, getEmojiList]);

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

  // 处理关闭事件
  const handleClose = useCallback(() => {
    window.parent.postMessage({ type: 'closePanel' }, '*');
  }, []);

  // 获取emoji示例
  const fetchEmojiExampleData = useCallback(async () => {
    try {
      const currentLang = getCurrentLanguage();
      const data = await fetchEmojiExample(currentLang);
      setEmojiExample(data);
    } catch (error) {
      console.error(t('errors.fetchEmoji'), error);
    }
  }, [t]);

  useEffect(() => {
    fetchEmojiExampleData();
  }, [fetchEmojiExampleData]);

  const handleSearchInputChange = useCallback((value: string) => {
    setSearchKeyword(value);
  }, []);

  const handleSearch = useCallback(async (keyword: string) => {
    setIsSearching(true);
    try {
      const currentLang = getCurrentLanguage();
      const data = await searchEmoji({ keyword, language: currentLang });
      setSearchResults(data);
    } catch (error) {
      // showToastMessage('toast.search.error', 'error');
    } finally {
      setIsSearching(false);
    }
  }, [showToastMessage]);

  const handleEmojiClick = useCallback((emoji: EmojiItem) => {
    // 空函数，移除所有最近使用相关逻辑
  }, []);

  const handleExampleClick = useCallback((example: string) => {
    setSearchKeyword(example);
    handleSearch(example);
  }, [setSearchKeyword, handleSearch]);

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
        typeName: emoji.typeName || String(emoji.type)
      }
    })), [searchResults, t]);

  // 处理消息事件
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'copySuccess') {
      // 空函数，移除所有最近使用相关逻辑
    }
  }, []);

  // 添加消息监听
  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleMessage]);

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
        isLoading={isLoading}
      />
    );
  }, [isLoading, emojiGroups, activeCategory, searchResults, t, handleEmojiClick]);

  return (
    <div className="flex flex-col bg-white w-full h-full overflow-hidden px-4 pb-3">
      <NavHead onClose={handleClose} />
      
      {/* 视觉分隔 */}
      <div className="flex items-center gap-3 px-1 my-3">
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
        <div className="w-2 h-2 rounded-full bg-purple-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-blue-200" />
        <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent" />
      </div>

      <div className="bg-white sticky top-0 z-40 flex-shrink-0 pb-2">
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
        </div>

        {/* 关键词 */}
        <SearchExample 
          examples={emojiExample} 
          onExampleClick={handleExampleClick}
          onRefresh={fetchEmojiExampleData}
        />
      </div>

      <div className="flex flex-1 overflow-hidden border rounded-md">
        <CategoryNav
          categories={emojiGroups}
          activeCategory={activeCategory}
          icons={icons}
          onCategoryChange={setActiveCategory}
          isLoading={isLoading && Object.keys(emojiGroups).length === 0}
        />
        <div className="flex-1 min-w-0 overflow-y-auto">
          {renderContent}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
};

export default React.memo(App); 
