import { EmojiGroup, EmojiItem } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://emoji-plugin-api.tjsglion.workers.dev';

export async function fetchEmojiList(language: string): Promise<EmojiGroup[]> {
  const response = await fetch(`${API_BASE_URL}/api/emoji/list?language=${language}`);
  const { data, code } = await response.json();
  
  if (code !== 200) {
    throw new Error('获取emoji列表失败');
  }
  
  return data;
}

export async function searchEmoji(params: { keyword: string; language: string }): Promise<EmojiItem[]> {
  const formData = new FormData();
  formData.append('keyword', params.keyword);
  formData.append('language', params.language);

  const response = await fetch(`${API_BASE_URL}/api/emoji/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  const { data, code } = await response.json();
  
  // console.log('data', data);
  if (code !== 200) {
    throw new Error('搜索emoji失败');
  }
  
  return data;
}

export async function fetchEmojiExample(language: string): Promise<Record<string, any>[]> {
  const response = await fetch(`${API_BASE_URL}/api/emoji/search-tips?language=${language}`);
  const { data, code } = await response.json();
  
  if (code !== 200) {
    throw new Error('获取emoji示例失败');
  }
  
  return data;
}