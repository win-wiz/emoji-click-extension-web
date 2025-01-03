import React, { useMemo } from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

// 将尺寸映射提取为常量，避免每次渲染重新创建
const SIZE_CLASSES = {
  small: 'w-4 h-4',
  medium: 'w-6 h-6',
  large: 'w-8 h-8'
} as const;

// SVG 路径常量
const CIRCLE_PROPS = {
  cx: "12",
  cy: "12",
  r: "10",
  strokeWidth: "4",
} as const;

const PATH_D = "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z";

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({ size = 'medium' }) => {
  // 使用 useMemo 缓存类名字符串
  const className = useMemo(() => `${SIZE_CLASSES[size]} animate-spin`, [size]);

  return (
    <div className="flex items-center justify-center mt-4">
      <div className={className}>
        <svg 
          className="text-blue-500" 
          viewBox="0 0 24 24"
          aria-label="loading"
          role="progressbar"
        >
          <circle
            className="opacity-25"
            fill="none"
            stroke="currentColor"
            {...CIRCLE_PROPS}
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d={PATH_D}
          />
        </svg>
      </div>
    </div>
  );
}); 