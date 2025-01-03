// import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

interface SearchExampleProps {
  examples: Record<string, any>[];
  onExampleClick?: (example: string) => void;
  onRefresh?: () => void;
}

export default function SearchExample({ examples, onExampleClick, onRefresh }: SearchExampleProps) {
  const { t } = useTranslation();
  
  const handleClick = (example: string) => {
    if (onExampleClick) {
      onExampleClick(example);
    }
  };

  return (
    <div className="mx-auto mt-2 mb-1 rounded-xl bg-gradient-to-br from-blue-50/40 to-purple-50/40 backdrop-blur-sm px-3 pt-2 pb-3 text-center min-h-[4.5rem] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative mb-2.5 inline-flex items-center gap-2">
        <span className="text-xs text-blue-600/90 font-medium">{t('search.example.hint')}</span>
        <button 
          onClick={onRefresh}
          className="inline-flex items-center justify-center p-1 rounded-full hover:bg-blue-100/80 hover:text-purple-600 transition-all duration-300 hover:rotate-180 hover:shadow-sm active:scale-95"
          title={t('search.example.refresh')}
          aria-label={t('search.example.refresh')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {
          examples?.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              {
                examples?.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleClick(example.content)}
                    className="cursor-pointer select-none whitespace-nowrap rounded-full bg-gradient-to-r from-white to-purple-50/30 backdrop-blur-sm px-4 py-1.5 text-xs text-blue-600 shadow-sm transition-all duration-200 hover:scale-105 hover:from-blue-50 hover:to-purple-100/50 hover:text-purple-600 hover:shadow-md active:scale-100 active:bg-purple-100"
                  >
                    {example.content}
                  </button>
                ))
              }
            </>
          )
        }
      </div>
    </div>
  );
}