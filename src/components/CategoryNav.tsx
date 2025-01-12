import React, { memo, useCallback, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EmojiItem } from '../types';

interface CategoryNavProps {
  categories: Record<string, EmojiItem[]>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  isLoading?: boolean;
  icons: string[];
}

const CategorySkeleton = memo(() => (
  <>
    {[...Array(8)].map((_, index) => (
      <div key={index} className="p-3">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 mb-2 rounded-lg bg-gray-200 animate-pulse" />
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    ))}
  </>
));
CategorySkeleton.displayName = 'CategorySkeleton';

const CategoryButton = memo<{
  typeName: string;
  icon: string;
  isActive: boolean;
  onClick: () => void;
  buttonRef: React.RefObject<HTMLButtonElement> | null;
}>(({ typeName, icon, isActive, onClick, buttonRef }) => (
  <button
    ref={buttonRef}
    className={`w-full p-3 text-center hover:bg-gray-100 transition-colors ${
      isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500' : ''
    }`}
    onClick={onClick}
  >
    <div className="text-xl mb-2">
      {icon}
    </div>
    <span className="text-xs block">{typeName}</span>
  </button>
));
CategoryButton.displayName = 'CategoryButton';

export const CategoryNav: React.FC<CategoryNavProps> = memo(({
  categories,
  activeCategory,
  icons,
  onCategoryChange,
  isLoading = false
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCategoryRef = useRef<HTMLButtonElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  const scrollToCenter = useCallback((immediate = false) => {
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    const doScroll = () => {
      const container = containerRef.current;
      const element = activeCategoryRef.current;
      if (!container || !element) return;

      const containerHeight = container.clientHeight;
      const elementHeight = element.offsetHeight;
      const elementTop = element.offsetTop;
      
      // 获取当前元素的前一个兄弟元素
      const previousElement = element.previousElementSibling as HTMLElement;
      // const previousElementHeight = previousElement ? previousElement.offsetHeight : 0;
      
      let targetScroll;
      
      if (previousElement) {
        // 如果有前一个元素，确保它也能显示
        const previousElementTop = previousElement.offsetTop;
        targetScroll = previousElementTop;
      } else {
        // 如果没有前一个元素，居中显示当前元素
        targetScroll = Math.max(0, elementTop - (containerHeight / 2) + (elementHeight / 2));
      }

      const maxScroll = container.scrollHeight - containerHeight;
      const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));
      
      if (container.scrollTop === finalScroll) return;
      
      container.scrollTo({
        top: finalScroll,
        behavior: immediate ? 'instant' : 'smooth'
      });
    };

    // 延迟执行滚动，等待布局稳定
    scrollTimeoutRef.current = window.setTimeout(doScroll, immediate ? 0 : 150);
  }, []);

  const createClickHandler = useCallback((typeName: string) => {
    return () => {
      if (typeName === activeCategory) return;
      onCategoryChange(typeName);
      scrollToCenter(false);
    };
  }, [activeCategory, onCategoryChange, scrollToCenter]);

  useEffect(() => {
    // 监听容器大小变化
    if (containerRef.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        scrollToCenter(true);
      });
      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [scrollToCenter]);

  // 当活动分类改变时滚动
  useEffect(() => {
    scrollToCenter(false);
  }, [activeCategory, scrollToCenter]);

  const categoryButtons = useMemo(() => {
    if (isLoading) return null;
    
    return Object.entries(categories).map(([typeName], index) => {
      const isRecent = typeName === 'recent';
      const icon = isRecent ? '🕒' : icons[index] || '😀';

      if (isRecent) {
        typeName = t('categories.recent');
      }
      const isActive = activeCategory === typeName;
      
      return (
        <CategoryButton
          key={typeName}
          typeName={typeName}
          icon={icon}
          isActive={isActive}
          buttonRef={isActive ? activeCategoryRef : null}
          onClick={createClickHandler(typeName)}
        />
      );
    });
  }, [categories, activeCategory, createClickHandler, icons]);

  return (
    <div 
      ref={containerRef} 
      className="w-24 border-r overflow-y-auto scroll-smooth relative"
      style={{ scrollbarWidth: 'thin' }}
    >
      {isLoading ? <CategorySkeleton /> : categoryButtons}
    </div>
  );
}); 