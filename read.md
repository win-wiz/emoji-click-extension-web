## 目的
1. 实现一个 Google 插件


## 功能
1. fetch 接口 /api/emoji/list， 分类返回 emoji 列表
2. fetch 接口 post /api/emoji/search，{keyword} 搜索 emoji 列表
3. 根据返回的 emoji 列表， 分类展示
4. 点击 emoji ， 复制到剪贴板
5. 页面表态内容支持国际化, 目前的语言：中文、英文， 法语， 繁体中文， 西班牙语， 葡萄牙语

## 技术栈
1. 前端：React + TypeScript + TailwindCSS
2. 使用 fetch 请求接口
3. 请求的接口是外部的， 有可能跨域， 返回JSON数据

## 参考资料
1. https://developer.chrome.com/docs/extensions/reference/