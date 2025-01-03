import React, { memo, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EmojiItem } from '../types';

interface EmojiGridProps {
  category: string;
  emojis: EmojiItem[];
  onEmojiClick: (emoji: EmojiItem) => void;
  isLoading?: boolean;
}

const GRID_COLS = 8; // 网格列数
const ITEM_SIZE = 44; // emoji按钮的大小
const ROW_GAP = 8; // 行间距
const BUFFER_SIZE = 8; // 上下缓冲区的行数

// 提取成单独的组件，避免不必要的重渲染
const TooltipContent = memo(({ name, isCopied, position }: { 
  name: string; 
  isCopied: boolean;
  position: 'left' | 'right';
}) => {
  const { t } = useTranslation();

  const tooltipClasses = useMemo(() => ({
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }), []);

  const arrowClasses = useMemo(() => ({
    left: '-right-1 top-1/2 -translate-y-1/2 rotate-45',
    right: '-left-1 top-1/2 -translate-y-1/2 rotate-45'
  }), []);

  return (
    <div 
      className={`
        absolute whitespace-nowrap z-20 text-white
        px-2 py-1 text-xs rounded
        pointer-events-none transition-all duration-200 ease-in-out
        ${tooltipClasses[position]}
        ${isCopied 
          ? 'bg-green-500 opacity-100' 
          : 'bg-gray-800 opacity-0 group-hover:opacity-100'
        }
      `}
    >
      {isCopied ? t('search.tag.copied') : name}
      <div 
        className={`
          absolute w-2 h-2
          ${arrowClasses[position]}
          ${isCopied ? 'bg-green-500' : 'bg-gray-800'}
        `} 
      />
    </div>
  );
});

const EmojiButton = memo(({ 
  emoji,
  index,
  onEmojiClick
}: { 
  emoji: EmojiItem;
  index: number;
  onEmojiClick: (emoji: EmojiItem) => void;
}) => {
  const { t } = useTranslation();
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const tooltipPosition = useMemo(() => {
    const colIndex = index % GRID_COLS;
    return colIndex >= GRID_COLS - 4 ? 'left' : 'right';
  }, [index]);

  const handleClick = useCallback(async () => {
    try {
      // 创建一个临时的文本区域
      const textArea = document.createElement('textarea');
      textArea.value = emoji.code;
      
      // 确保文本区域在视口之外
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      
      document.body.appendChild(textArea);
      textArea.select();
      
      let copySuccess = false;
      // 尝试使用现代 API，如果失败则回退到 execCommand
      try {
        await navigator.clipboard.writeText(emoji.code);
        copySuccess = true;
      } catch {
        copySuccess = document.execCommand('copy');
      }
      
      // 清理
      document.body.removeChild(textArea);
      
      if (copySuccess) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      } else {
        console.error(t('toast.copy.error'));
      }
    } catch (error) {
      console.error(t('toast.copy.error'), error);
    }
  }, [emoji.code, t]);

  return (
    <button
      className="w-10 h-10 flex items-center justify-center text-xl rounded-lg relative group focus:outline-none"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={emoji.name}
    >
      {/* 背景层 - 仅hover效果 */}
      {!isCopied && (
        <div className="absolute inset-0 rounded-lg bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out" />
      )}
      
      {/* Emoji层 */}
      <div 
        className={`
          relative z-10 transform
          transition-transform duration-200 ease-in-out
          ${isHovered ? 'scale-125' : 'scale-100'}
          ${isCopied ? 'text-green-600' : ''}
        `}
      >
        {emoji.code}
      </div>

      <TooltipContent 
        name={emoji.name}
        isCopied={isCopied}
        position={tooltipPosition}
      />
    </button>
  );
});

// 骨架屏组件
const SkeletonEmoji = memo(() => (
  <div className="w-10 h-10 rounded-lg bg-gray-100 animate-pulse" />
));

const LoadingGrid = memo(() => (
  <div className="grid grid-cols-8 gap-2">
    {Array.from({ length: 32 }).map((_, index) => (
      <SkeletonEmoji key={index} />
    ))}
  </div>
));

export const EmojiGrid: React.FC<EmojiGridProps> = memo(({
  category,
  emojis,
  onEmojiClick,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 32 });
  const [isScrolled, setIsScrolled] = useState(false);

  // 添加目录切换时的滚动效果
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer && scrollContainer.scrollTop > 0) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      const handleScrollEnd = () => {
        setIsScrolled(false);
        setVisibleRange({ start: 0, end: 32 });
      };

      const onScroll = () => {
        if (scrollContainer.scrollTop === 0) {
          handleScrollEnd();
          scrollContainer.removeEventListener('scroll', onScroll);
        }
      };

      scrollContainer.addEventListener('scroll', onScroll);
      return () => scrollContainer.removeEventListener('scroll', onScroll);
    } else {
      setIsScrolled(false);
      setVisibleRange({ start: 0, end: 32 });
    }
  }, [category]);

  // 确保 emojis 变化时也重置滚动位置
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (scrollContainer && scrollContainer.scrollTop > 0) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
    setIsScrolled(false);
    setVisibleRange({ start: 0, end: 32 });
  }, [emojis]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    
    // 更新滚动状态
    setIsScrolled(scrollTop > 10);

    const viewportHeight = container.clientHeight;
    const rowHeight = ITEM_SIZE + ROW_GAP;
    const totalRows = Math.ceil(emojis.length / GRID_COLS);
    
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - BUFFER_SIZE);
    const endRow = Math.min(
      totalRows,
      Math.ceil((scrollTop + viewportHeight) / rowHeight) + BUFFER_SIZE
    );

    const start = startRow * GRID_COLS;
    const end = Math.min(endRow * GRID_COLS, emojis.length);

    setVisibleRange({ start, end });
  }, [emojis.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    handleScroll();
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const totalHeight = useMemo(() => {
    const rows = Math.ceil(emojis.length / GRID_COLS);
    return rows * (ITEM_SIZE + ROW_GAP) - ROW_GAP; // 减去最后一行的间距
  }, [emojis.length]);

  const topOffset = useMemo(() => {
    const startRow = Math.floor(visibleRange.start / GRID_COLS);
    return startRow * (ITEM_SIZE + ROW_GAP);
  }, [visibleRange.start]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* 标题容器 */}
      <div className={`
        sticky top-0 z-20 bg-white
        transition-shadow duration-300 ease-in-out
        ${isScrolled ? 'shadow-md' : 'shadow-sm'}
      `}>
        <div className="max-w-[600px] mx-auto pr-4 pl-2">
          <div className={`
            flex items-center h-12
            bg-white/95 backdrop-blur-sm border-b border-gray-100
            transition-all duration-300 ease-in-out
            ${isScrolled ? 'h-11' : 'h-12'}
          `}>
            <h3 className={`
              text-[16px] font-bold text-gray-900 tracking-tight leading-none
              transition-transform duration-300 ease-in-out
              ${isScrolled ? 'scale-95' : 'scale-100'}
            `}>
              {category}
            </h3>
            <div className={`
              ml-2.5 px-2 py-0.5 text-xs text-gray-500 font-medium
              bg-gray-50 rounded-full
              transition-all duration-300 ease-in-out
              ${isScrolled ? 'opacity-80 scale-95' : 'opacity-100 scale-100'}
            `}>
              {isLoading ? t('search.searching') : t('category.count', { count: emojis.length })}
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div 
        className="flex-1 overflow-y-auto scroll-smooth" 
        ref={containerRef}
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="max-w-[600px] mx-auto pr-4 pl-2 py-2">
          {isLoading ? (
            <>
              <div className="grid grid-cols-8 gap-2 animate-pulse">
                {Array.from({ length: 64 }).map((_, index) => (
                  <div key={index} className="w-10 h-10 bg-gray-100 rounded-lg" />
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-8 gap-2">
              {emojis.map((emoji, index) => (
                <EmojiButton
                  key={emoji.code + index}
                  emoji={emoji}
                  index={index}
                  onEmojiClick={onEmojiClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}); 