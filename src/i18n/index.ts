import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'search.placeholder': 'Search emojis...',
      'search.results': 'Search Results',
      'search.button': 'Search',
      'search.searching': 'Searching...',
      'search.noResults': 'No results found',
      'search.tag.hot': 'Hot',
      'search.tag.copied': 'Copied',
      'search.copy.error': 'Failed to copy',
      'search.icon.aria': 'Search icon',
      'search.button.aria': 'Search button',
      'search.loading.spinner.aria': 'Loading',
      'search.dropdown.aria': 'Search results dropdown',
      'search.result.item.aria': 'Emoji result: {{name}}',
      'search.result.emoji.aria': 'Emoji: {{code}}',
      'categories': {
        'smileys': 'Smileys & Emotion',
        'people': 'People & Body',
        'animals': 'Animals & Nature',
        'food': 'Food & Drink',
        'travel': 'Travel & Places',
        'activities': 'Activities',
        'objects': 'Objects',
        'symbols': 'Symbols',
        'flags': 'Flags'
      },
      'toast': {
        'load.success': 'Loaded successfully',
        'load.error': 'Failed to load data',
        'search.empty': 'No emojis found',
        'search.result': 'Found {{count}} emojis',
        'search.error': 'Search failed',
        'copy.success': 'Copied',
        'copy.error': 'Failed to copy'
      },
      'search.tip': 'Press Enter to search',
      'search.input.aria': 'Search emojis, press Enter to search',
      'category.count': '{{count}} emojis',
      'category.count_one': '{{count}} emoji',
      'category.count_other': '{{count}} emojis',
      'search.example.hint': 'Type any phrase—your mood, feeling, a line of poetry, or lyrics.',
      'search.example.title': 'Search Example',
      'search.example.refresh': 'Refresh Example'
    }
  },
  zh: {
    translation: {
      'search.placeholder': '搜索表情...',
      'search.results': '搜索结果',
      'search.button': '搜索',
      'search.searching': '搜索中...',
      'search.noResults': '未找到相关结果',
      'search.tag.hot': '热门',
      'search.tag.copied': '已复制',
      'search.copy.error': '复制失败',
      'search.icon.aria': '搜索图标',
      'search.button.aria': '搜索按钮',
      'search.loading.spinner.aria': '加载中',
      'search.dropdown.aria': '搜索结果下拉框',
      'search.result.item.aria': '表情结果：{{name}}',
      'search.result.emoji.aria': '表情：{{code}}',
      'categories': {
        'smileys': '表情与情感',
        'people': '人物与身体',
        'animals': '动物与自然',
        'food': '食物与饮品',
        'travel': '旅行与地点',
        'activities': '活动',
        'objects': '物品',
        'symbols': '符号',
        'flags': '旗帜'
      },
      'toast': {
        'load.success': '加载成功',
        'load.error': '获取数据失败',
        'search.empty': '未找到相关表情',
        'search.result': '找到 {{count}} 个表情',
        'search.error': '搜索失败',
        'copy.success': '复制成功',
        'copy.error': '复制失败'
      },
      'search.tip': '按回车搜索',
      'search.input.aria': '搜索表情，按回车键搜索',
      'category.count': '{{count}} 个表情',
      'category.count_one': '{{count}} 个表情',
      'category.count_other': '{{count}} 个表情',
      'search.example.hint': '输入任意短语：如心情、感受、诗句或歌词',
      'search.example.title': '搜索示例',
      'search.example.refresh': '刷新示例'
    }
  },
  'zh-tw': {
    translation: {
      'search.placeholder': '搜尋表情...',
      'search.results': '搜尋結果',
      'search.button': '搜尋',
      'search.searching': '搜尋中...',
      'search.noResults': '未找到相關結果',
      'search.tag.hot': '熱門',
      'search.tag.copied': '已複製',
      'search.copy.error': '複製失敗',
      'search.icon.aria': '搜尋圖標',
      'search.button.aria': '搜尋按鈕',
      'search.loading.spinner.aria': '載入中',
      'search.dropdown.aria': '搜尋結果下拉框',
      'search.result.item.aria': '表情結果：{{name}}',
      'search.result.emoji.aria': '表情：{{code}}',
      'categories': {
        'smileys': '表情與情感',
        'people': '人物與身體',
        'animals': '動物與自然',
        'food': '食物與飲品',
        'travel': '旅行與地點',
        'activities': '活動',
        'objects': '物品',
        'symbols': '符號',
        'flags': '旗幟'
      },
      'toast': {
        'load.success': '載入成功',
        'load.error': '獲取數據失敗',
        'search.empty': '未找到相關表情',
        'search.result': '找到 {{count}} 個表情',
        'search.error': '搜尋失敗',
        'copy.success': '複製成功',
        'copy.error': '複製失敗'
      },
      'search.tip': '按回車搜尋',
      'search.input.aria': '搜尋表情，按回車鍵搜尋',
      'category.count': '{{count}} 個表情',
      'category.count_one': '{{count}} 個表情',
      'category.count_other': '{{count}} 個表情',
      'search.example.hint': '輸入任意短語：如心情、感受、詩句或歌詞',
      'search.example.title': '搜尋示例',
      'search.example.refresh': '刷新示例'
    }
  },
  fr: {
    translation: {
      'search.placeholder': 'Rechercher des emojis... (Appuyez sur Entrée)',
      'search.results': 'Résultats de recherche',
      'search.button': 'Rechercher',
      'search.searching': 'Recherche en cours...',
      'search.noResults': 'Aucun résultat trouvé',
      'search.tag.hot': 'Populaire',
      'search.tag.copied': 'Copié',
      'search.copy.error': 'Échec de la copie',
      'search.icon.aria': 'Icône de recherche',
      'search.button.aria': 'Bouton de recherche',
      'search.loading.spinner.aria': 'Chargement',
      'search.dropdown.aria': 'Liste déroulante des résultats',
      'search.result.item.aria': 'Résultat emoji : {{name}}',
      'search.result.emoji.aria': 'Emoji : {{code}}',
      'categories': {
        'smileys': 'Émoticônes et émotions',
        'people': 'Personnes et corps',
        'animals': 'Animaux et nature',
        'food': 'Nourriture et boissons',
        'travel': 'Voyages et lieux',
        'activities': 'Activités',
        'objects': 'Objets',
        'symbols': 'Symboles',
        'flags': 'Drapeaux'
      },
      'toast': {
        'load.success': 'Chargement réussi',
        'load.error': 'Échec du chargement des données',
        'search.empty': 'Aucun emoji trouvé',
        'search.result': '{{count}} emojis trouvés',
        'search.error': 'Échec de la recherche',
        'copy.success': 'Copié avec succès',
        'copy.error': 'Échec de la copie'
      },
      'search.tip': 'Appuyez sur Entrée pour rechercher',
      'search.input.aria': 'Rechercher des emojis, appuyez sur Entrée pour rechercher',
      'category.count': '{{count}} émojis',
      'category.count_one': '{{count}} émoji',
      'category.count_other': '{{count}} émojis',
      'search.example.hint': 'Entrez une phrase : humeur, sentiment, poème ou paroles',
      'search.example.title': 'Exemples de recherche',
      'search.example.refresh': 'Actualiser les exemples'
    }
  },
  es: {
    translation: {
      'search.placeholder': 'Buscar emojis... (Presione Enter)',
      'search.results': 'Resultados de búsqueda',
      'search.button': 'Buscar',
      'search.searching': 'Buscando...',
      'search.noResults': 'No se encontraron resultados',
      'search.tag.hot': 'Popular',
      'search.tag.copied': 'Copiado',
      'search.copy.error': 'Error al copiar',
      'search.icon.aria': 'Icono de búsqueda',
      'search.button.aria': 'Botón de búsqueda',
      'search.loading.spinner.aria': 'Cargando',
      'search.dropdown.aria': 'Lista desplegable de resultados',
      'search.result.item.aria': 'Resultado emoji: {{name}}',
      'search.result.emoji.aria': 'Emoji: {{code}}',
      'categories': {
        'smileys': 'Emoticonos y emociones',
        'people': 'Personas y cuerpo',
        'animals': 'Animales y naturaleza',
        'food': 'Comida y bebida',
        'travel': 'Viajes y lugares',
        'activities': 'Actividades',
        'objects': 'Objetos',
        'symbols': 'Símbolos',
        'flags': 'Banderas'
      },
      'toast': {
        'load.success': 'Carga exitosa',
        'load.error': 'Error al cargar datos',
        'search.empty': 'No se encontraron emojis',
        'search.result': 'Se encontraron {{count}} emojis',
        'search.error': 'Error en la búsqueda',
        'copy.success': 'Copiado con éxito',
        'copy.error': 'Error al copiar'
      },
      'search.tip': 'Presione Enter para buscar',
      'search.input.aria': 'Buscar emojis, presione Enter para buscar',
      'category.count': '{{count}} emojis',
      'category.count_one': '{{count}} emoji',
      'category.count_other': '{{count}} emojis',
      'search.example.hint': 'Ingrese cualquier frase: estado de ánimo, sentimiento, poema o letra',
      'search.example.title': 'Ejemplos de búsqueda',
      'search.example.refresh': 'Actualizar ejemplos'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 