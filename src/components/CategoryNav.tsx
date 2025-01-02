import React, { memo, useCallback, useRef, useEffect, useMemo } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCategoryRef = useRef<HTMLButtonElement>(null);

  // console.log('categories', categories);

  const scrollToCenter = useCallback(() => {
    const container = containerRef.current;
    const element = activeCategoryRef.current;
    if (!container || !element) return;

    const containerHeight = container.clientHeight;
    const elementHeight = element.offsetHeight;
    const elementTop = element.offsetTop;
    
    const targetScroll = elementTop - (containerHeight / 2) + (elementHeight / 2);
    const maxScroll = container.scrollHeight - containerHeight;
    const finalScroll = Math.max(0, Math.min(targetScroll, maxScroll));
    
    if (container.scrollTop === finalScroll) return;
    
    container.scrollTo({
      top: finalScroll,
      behavior: 'smooth'
    });
  }, []);

  const createClickHandler = useCallback((typeName: string) => {
    return () => {
      if (typeName === activeCategory) return;
      onCategoryChange(typeName);
      requestAnimationFrame(scrollToCenter);
    };
  }, [activeCategory, onCategoryChange, scrollToCenter]);

  useEffect(() => {
    const frameId = requestAnimationFrame(scrollToCenter);
    return () => cancelAnimationFrame(frameId);
  }, [activeCategory, scrollToCenter]);

  const categoryButtons = useMemo(() => {
    if (isLoading) return null;
    
    return Object.entries(categories).map(([typeName], index) => {
      const isRecent = typeName === '最近使用';
      // console.log('icons', icons, index);
      const icon = isRecent ? '🕒' : icons[index] || '😀';
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
  }, [categories, activeCategory, createClickHandler]);

  return (
    <div 
      ref={containerRef} 
      className="w-24 border-r overflow-y-auto scroll-smooth"
      style={{ scrollbarWidth: 'thin' }}
    >
      {isLoading ? <CategorySkeleton /> : categoryButtons}
    </div>
  );
}); 