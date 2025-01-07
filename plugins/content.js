// 浏览器 API 适配层
const browserAPI = (() => {
  if (typeof browser !== 'undefined') {
    return {
      ...browser,
      runtime: {
        ...browser.runtime,
        getURL: browser.runtime.getURL,
        sendMessage: (...args) => {
          try {
            return browser.runtime.sendMessage(...args);
          } catch (error) {
            console.error('发送消息错误:', error);
            return Promise.reject(error);
          }
        },
        onMessage: {
          addListener: (callback) => {
            browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
              // 处理 ping 消息
              if (message.action === 'ping') {
                sendResponse({ success: true });
                return;
              }
              return callback(message, sender, sendResponse);
            });
          }
        }
      }
    };
  } else if (typeof chrome !== 'undefined') {
    return {
      ...chrome,
      runtime: {
        ...chrome.runtime,
        getURL: chrome.runtime.getURL,
        sendMessage: (...args) => new Promise((resolve) => chrome.runtime.sendMessage(...args, resolve))
      }
    };
  }
  // Safari 的情况下返回适配的 API
  return {
    runtime: {
      getURL: (path) => safari.extension.baseURI + path,
      sendMessage: (message) => new Promise((resolve) => {
        safari.extension.dispatchMessage('message', message);
        resolve();
      }),
      onMessage: {
        addListener: (callback) => {
          safari.self.addEventListener('message', (event) => {
            callback(event.message, null, () => {});
          });
        }
      }
    }
  };
})();

// 初始化扩展
window.emojiExtension = window.emojiExtension || {
  panel: null,
  overlay: null,
  iframe: null,
  messageHandler: null,
  isShowing: false
};

// 显示面板
function showPanel() {
  if (!window.emojiExtension.panel) {
    createPanel();
  }
  window.emojiExtension.panel.style.display = 'block';
  window.emojiExtension.overlay.style.display = 'block';
  window.emojiExtension.isShowing = true;
  
  // 使用 requestAnimationFrame 确保过渡动画正常工作
  requestAnimationFrame(() => {
    window.emojiExtension.panel.style.transform = 'translateX(0)';
    window.emojiExtension.overlay.style.opacity = '1';
  });
}

// 隐藏面板
function hidePanel() {
  if (window.emojiExtension.panel) {
    window.emojiExtension.panel.style.transform = 'translateX(100%)';
    window.emojiExtension.overlay.style.opacity = '0';
    
    // 等待过渡动画完成后隐藏元素
    setTimeout(() => {
      window.emojiExtension.panel.style.display = 'none';
      window.emojiExtension.overlay.style.display = 'none';
      window.emojiExtension.isShowing = false;
    }, 300);
  }
}

// 切换面板显示状态
function togglePanel() {
  if (window.emojiExtension.isShowing) {
    hidePanel();
  } else {
    showPanel();
  }
}

// 复制文本到剪贴板
async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('复制失败:', err);
    return false;
  }
}

// 创建浮动面板
function createPanel() {
  // 创建遮罩层
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 600px;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2147483646;
    display: none;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  `;

  // 创建面板容器
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: 600px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
    z-index: 2147483647;
    display: none;
    transform: translateX(100%);
    transition: transform 0.3s ease-in-out;
  `;

  // 创建 iframe
  const iframe = document.createElement('iframe');
  iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
  `;
  iframe.src = browserAPI.runtime.getURL('index.html');
  iframe.allow = "clipboard-write";

  // 保存引用
  window.emojiExtension.panel = container;
  window.emojiExtension.overlay = overlay;
  window.emojiExtension.iframe = iframe;

  // 组装面板
  container.appendChild(iframe);
  document.body.appendChild(overlay);
  document.body.appendChild(container);

  // 阻止事件传播
  container.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  container.addEventListener('mousedown', (e) => {
    e.stopPropagation();
  });

  container.addEventListener('keydown', (e) => {
    e.stopPropagation();
  });

  // 初始化消息监听器
  if (!window.emojiExtension.messageHandler) {
    window.emojiExtension.messageHandler = async function(event) {
      if (event.data?.type === 'copyEmoji' && event.data?.text) {
        try {
          const success = await copyTextToClipboard(event.data.text);
          
          // 验证复制结果
          let verified = false;
          try {
            const clipText = await navigator.clipboard.readText();
            verified = clipText === event.data.text;
          } catch (err) {
            console.log('无法验证剪贴板内容，假定复制成功');
            verified = success;
          }

          // 发送复制结果回 iframe
          iframe.contentWindow.postMessage({
            type: 'copyResult',
            success: verified,
            text: event.data.text
          }, '*');
        } catch (error) {
          console.error('复制失败:', error);
          iframe.contentWindow.postMessage({
            type: 'copyResult',
            success: false,
            text: event.data.text
          }, '*');
        }
      } else if (event.data?.type === 'closePanel') {
        hidePanel();
      }
    };
    window.addEventListener('message', window.emojiExtension.messageHandler);
  }
}

// 监听来自 background script 的消息
browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'togglePanel') {
    togglePanel();
    sendResponse({ success: true });
  }
}); 