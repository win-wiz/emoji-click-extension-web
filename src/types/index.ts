export interface EmojiItem {
  code: string;      
  fullCode: string;  
  name: string;      
  hot?: number;
  type?: number;
  typeName?: string;
}

export interface EmojiGroup {
  type: number;      
  typeName: string;  
  typeIcon: string;  
  emojis: string;    
} 

export type Language = 'zh' | 'en' | 'fr' | 'zh-TW' | 'es' | 'pt'; 