// 跟踪覆盖层状态
let isOverlayOpen = false;

// 检查URL是否可注入
function canInjectIntoUrl(url) {
  const restrictedUrls = [
    'chrome://',
    'chrome-extension://',
    'chrome.google.com/webstore',
    'chrome-error://'
  ];
  return url && !restrictedUrls.some(restricted => url.startsWith(restricted));
}

// 显示通知
function showChromeNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icon128.png',
    title: 'EmojiClick 提示',
    message: '当前页面不支持使用此扩展，请在普通网页中使用。',
    priority: 2
  });
}

// 注入覆盖层的函数
async function injectOverlay(tab) {
  console.log('Injecting overlay into tab:', tab.id);
  
  try {
    // 注入样式
    console.log('Injecting CSS...');
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['styles.css']
    });

    // 注入HTML
    console.log('Injecting HTML...');
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (extensionUrl) => {
        console.log('Inside injection function, extension URL:', extensionUrl);
        
        // 如果已存在，先移除旧的
        const existingOverlay = document.getElementById('emoji-extension-overlay');
        const existingBackdrop = document.getElementById('emoji-extension-backdrop');
        if (existingOverlay) existingOverlay.remove();
        if (existingBackdrop) existingBackdrop.remove();

        // 创建背景遮罩
        const backdrop = document.createElement('div');
        backdrop.id = 'emoji-extension-backdrop';
        backdrop.style.display = 'block';
        document.body.appendChild(backdrop);

        // 创建iframe容器
        const overlay = document.createElement('iframe');
        overlay.id = 'emoji-extension-overlay';
        overlay.src = extensionUrl;
        overlay.style.display = 'block';
        document.body.appendChild(overlay);

        // 点击背景遮罩关闭覆盖层
        backdrop.onclick = () => {
          overlay.remove();
          backdrop.remove();
          chrome.runtime.sendMessage({ type: 'OVERLAY_CLOSED' });
        };

        console.log('Overlay injected successfully');
      },
      args: [chrome.runtime.getURL('index.html')]
    });

    isOverlayOpen = true;
    console.log('Injection completed successfully');
  } catch (error) {
    console.error('Injection error:', error);
  }
}

// 监听扩展图标点击
chrome.action.onClicked.addListener(async (tab) => {
  console.log('Extension icon clicked. Tab:', tab);
  
  if (!tab.url) {
    console.log('No URL found in tab');
    return;
  }

  if (!canInjectIntoUrl(tab.url)) {
    console.log('Cannot inject into this page:', tab.url);
    showChromeNotification();
    return;
  }

  try {
    if (!isOverlayOpen) {
      console.log('Opening overlay...');
      await injectOverlay(tab);
    } else {
      console.log('Closing overlay...');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const overlay = document.getElementById('emoji-extension-overlay');
          const backdrop = document.getElementById('emoji-extension-backdrop');
          if (overlay) overlay.remove();
          if (backdrop) backdrop.remove();
        }
      });
      isOverlayOpen = false;
    }
  } catch (error) {
    console.error('Error handling click:', error);
  }
});

// 监听消息
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'OVERLAY_CLOSED') {
    console.log('Overlay closed via backdrop click');
    isOverlayOpen = false;
  }
}); 