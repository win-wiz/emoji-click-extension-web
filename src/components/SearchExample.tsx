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
    <div className="mx-auto mt-1.5 rounded-xl bg-gray-50/30 backdrop-blur-sm px-3 pt-1.5 pb-2.5 text-center min-h-[4.5rem] shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative mb-2 inline-flex items-center gap-2 text-xs text-gray-400/90">
        <span className="before:content-[''] mr-1">{t('search.example.hint')}</span>
        <button 
          onClick={onRefresh}
          className="inline-flex items-center justify-center p-1 rounded-full hover:bg-white/80 hover:text-blue-500 transition-all duration-300 hover:rotate-180 hover:shadow-sm active:scale-95"
          title={t('search.example.refresh')}
          aria-label={t('search.example.refresh')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <span className="after:content-[''] ml-1"></span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 px-1">
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
                    className="cursor-pointer select-none whitespace-nowrap rounded-full bg-white/80 backdrop-blur-sm px-4 py-1.5 text-xs text-gray-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:text-blue-600 hover:shadow active:scale-100 active:bg-blue-100"
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