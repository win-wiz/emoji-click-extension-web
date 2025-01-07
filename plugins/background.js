// 浏览器 API 适配层
const extensionAPI = (() => {
  if (typeof browser !== 'undefined') {
    return browser;
  }
  return chrome;
})();

// 检查 content script 是否已注入
async function isContentScriptInjected(tabId) {
  try {
    await extensionAPI.tabs.sendMessage(tabId, { action: 'ping' });
    return true;
  } catch (error) {
    return false;
  }
}

// 点击扩展图标时切换面板
extensionAPI.action.onClicked.addListener(async (tab) => {
  if (!tab?.url) return;

  // 检查是否可以在当前页面使用
  if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://') || tab.url.startsWith('about:')) {
    try {
      await extensionAPI.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'EmojiClick 提示',
        message: '当前页面不支持使用此扩展，请在普通网页中使用。',
        priority: 2
      });
    } catch (error) {
      console.warn('通知创建失败:', error);
    }
    return;
  }

  try {
    // 检查 content script 是否已注入
    const isInjected = await isContentScriptInjected(tab.id);
    
    if (!isInjected) {
      // 只有在未注入的情况下才注入 content script
      await extensionAPI.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
      // 等待一小段时间确保 content script 初始化
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 发送消息给 content script
    await extensionAPI.tabs.sendMessage(tab.id, { action: 'togglePanel' })
      .catch(async (error) => {
        console.warn('发送消息失败:', error);
      });
  } catch (error) {
    console.error('无法切换面板:', error);
  }
}); 