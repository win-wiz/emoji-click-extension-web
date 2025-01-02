import React, { memo, useCallback, useMemo, KeyboardEvent, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchResult {
  id: string;
  text: string;
  emoji: {
    code: string;
    name: string;
    hot?: number;
    type?: number;
    typeName?: string;
  };
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  isSearching?: boolean;
  searchResults?: SearchResult[];
  onSelectResult?: (result: SearchResult) => void;
}

const INPUT_CLASS_NAME = "w-full h-10 px-4 pl-8 pr-20 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors text-sm";
const BUTTON_CLASS_NAME = "px-2 h-7 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 text-sm whitespace-nowrap";
const CLEAR_BUTTON_CLASS_NAME = "w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const LOADING_SPINNER_CLASS = "animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full";
const DROPDOWN_CLASS_NAME = "absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[280px] overflow-y-auto z-50";
const DROPDOWN_ITEM_CLASS_NAME = "px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 group border-b border-gray-100 last:border-0";
const EMPTY_STATE_CLASS_NAME = "px-4 py-3 text-gray-500 text-center text-sm";
const SEARCH_ICON_STYLE = {
  position: 'absolute' as const,
  left: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '14px'
};

// 热门标签组件
const HotTag = memo(() => {
  const { t } = useTranslation();
  return (
    <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[11px] rounded font-medium">
      {t('search.tag.hot')}
    </span>
  );
});

// 类型标签组件
const TypeTag = memo(({ typeName }: { typeName: string }) => (
  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded">
    {typeName}
  </span>
));

// 复制成功标签组件
const CopiedTag = memo(() => {
  const { t } = useTranslation();
  return (
    <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[11px] rounded font-medium animate-fadeOut">
      {t('search.tag.copied')}
    </span>
  );
});

export const SearchInput: React.FC<SearchInputProps> = memo(({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder,
  isSearching = false,
  searchResults = [],
  onSelectResult
}) => {
  const { t } = useTranslation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();
  const copiedTimeoutRef = useRef<NodeJS.Timeout>();
  
  const finalPlaceholder = useMemo(() => 
    placeholder || t('search.placeholder'),
    [placeholder, t]
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleSearch = useCallback(() => {
    if (value.trim() && !isSearching) {
      setShowDropdown(true);
      onSearch(value.trim());
    }
  }, [value, onSearch, isSearching]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }, [handleSearch]);

  // 统一注释的国际化
  const COMMENTS = {
    SET_COPY_SUCCESS: 'search.comments.setCopySuccess',
    CLEAR_COPY_SUCCESS: 'search.comments.clearCopySuccess',
  } as const;

  const handleCopyEmoji = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // 设置复制成功状态
      setCopiedId(id);
      // 1.5秒后清除复制成功状态
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = setTimeout(() => {
        setCopiedId(null);
      }, 1500);
    } catch (error) {
      console.error(t('search.copy.error'), error);
    }
  }, [t]);

  // 处理点击事件
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  // 统一处理显示/隐藏下拉框
  const handleDropdownVisibility = useCallback((shouldShow: boolean, event?: MouseEvent) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    if (shouldShow) {
      if (searchResults.length > 0) {
        setShowDropdown(true);
      }
    } else {
      // 添加一个小延迟，避免鼠标在输入框和下拉框之间移动时闪烁
      hideTimeoutRef.current = setTimeout(() => {
        const container = containerRef.current;
        const dropdown = dropdownRef.current;
        
        if (container && dropdown) {
          const containerRect = container.getBoundingClientRect();
          const dropdownRect = dropdown.getBoundingClientRect();
          const mouseX = event?.clientX ?? 0;
          const mouseY = event?.clientY ?? 0;

          // 检查鼠标是否在输入框或下拉框区域内
          const isInContainer = 
            mouseX >= containerRect.left && 
            mouseX <= containerRect.right && 
            mouseY >= containerRect.top && 
            mouseY <= containerRect.bottom;

          const isInDropdown = 
            mouseX >= dropdownRect.left && 
            mouseX <= dropdownRect.right && 
            mouseY >= dropdownRect.top && 
            mouseY <= dropdownRect.bottom;

          if (!isInContainer && !isInDropdown && !isSearching) {
            setShowDropdown(false);
          }
        }
      }, 100);
    }
  }, [searchResults.length, isSearching]);

  // 搜索开始时显示下拉框
  useEffect(() => {
    if (isSearching) {
      setShowDropdown(true);
    }
  }, [isSearching]);

  const handleClear = useCallback(() => {
    onChange('');
    setShowDropdown(false);
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onChange, onClear]);

  return (
    <div 
      className="relative flex-1 min-w-[260px]" 
      ref={containerRef}
      onMouseEnter={(e) => handleDropdownVisibility(true, e.nativeEvent)}
      onMouseLeave={(e) => handleDropdownVisibility(false, e.nativeEvent)}
    >
      <input
        ref={inputRef}
        type="text"
        className={INPUT_CLASS_NAME}
        placeholder={finalPlaceholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isSearching}
        aria-label={t('search.input.aria')}
      />
      <span 
        className="text-gray-400"
        style={SEARCH_ICON_STYLE}
        aria-label={t('search.icon.aria')}
      >
        🔍
      </span>
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value && !isSearching && (
          <button
            type="button"
            className={CLEAR_BUTTON_CLASS_NAME}
            onClick={handleClear}
            aria-label={t('search.clear.aria')}
          >
            ✕
          </button>
        )}
        <button
          type="button"
          className={BUTTON_CLASS_NAME}
          onClick={handleSearch}
          disabled={!value.trim() || isSearching}
          aria-label={t('search.button.aria')}
        >
          {isSearching ? (
            <div className="flex items-center gap-1">
              <div className={LOADING_SPINNER_CLASS} aria-label={t('search.loading.spinner.aria')} />
              <span className="text-sm">{t('search.searching')}</span>
            </div>
          ) : (
            <span className="text-sm">{t('search.button')}</span>
          )}
        </button>
      </div>

      {showDropdown && (
        <div 
          ref={dropdownRef} 
          className={DROPDOWN_CLASS_NAME}
          onMouseEnter={(e) => handleDropdownVisibility(true, e.nativeEvent)}
          onMouseLeave={(e) => handleDropdownVisibility(false, e.nativeEvent)}
          aria-label={t('search.dropdown.aria')}
        >
          {isSearching ? (
            <div className={EMPTY_STATE_CLASS_NAME}>
              <div className="flex items-center justify-center gap-2">
                <div 
                  className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" 
                  aria-label={t('search.loading.spinner.aria')}
                />
                {t('search.searching')}
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults.map((result) => (
              <div
                key={result.id}
                className={DROPDOWN_ITEM_CLASS_NAME}
                onClick={() => handleCopyEmoji(result.emoji.code, result.id)}
                aria-label={t('search.result.item.aria', { name: result.emoji.name })}
              >
                <div 
                  className="w-10 h-10 flex items-center justify-center text-2xl bg-gray-50 rounded-lg group-hover:bg-white transition-colors"
                  aria-label={t('search.result.emoji.aria', { code: result.emoji.code })}
                >
                  {result.emoji.code}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="font-medium text-gray-900 truncate max-w-[230px]" 
                      title={result.emoji.name}
                    >
                      {result.emoji.name}
                    </span>
                    {result.emoji.hot === 1 && <HotTag />}
                    {copiedId === result.id && <CopiedTag />}
                  </div>
                  <div className="flex items-center gap-2">
                    {result.emoji.typeName && <TypeTag typeName={result.emoji.typeName} />}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={EMPTY_STATE_CLASS_NAME}>
              {t('search.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput'; 