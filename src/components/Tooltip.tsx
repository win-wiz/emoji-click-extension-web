import React, { memo } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = memo(({
  content,
  children,
  position = 'top'
}) => {
  const tooltipClass = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }[position];

  return (
    <div className="group relative inline-block">
      {children}
      <div className={`absolute ${tooltipClass} scale-0 transition-all group-hover:scale-100`}>
        <div className="px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
          {content}
        </div>
      </div>
    </div>
  );
});

Tooltip.displayName = 'Tooltip'; 