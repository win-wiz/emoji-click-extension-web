# EmojiClick Toolbar

EmojiClick Toolbar 是一个强大的表情符号选择插件，支持多种浏览器。通过输入心情、短语或歌词，您可以立即找到完美的表情符号。

## 功能

- 快速查找和选择表情符号
- 支持多语言
- 最近使用的表情符号
- 浏览器通知

## 安装

### Chrome

1. 克隆或下载此仓库。
2. 打开 Chrome 浏览器，进入 `chrome://extensions/`。
3. 打开开发者模式。
4. 点击“加载已解压的扩展程序”，选择项目文件夹。

### Firefox

1. Clone 或下载此仓库
2. 运行 `yarn install` 安装依赖
3. 运行 `yarn build:firefox` 构建 Firefox 插件
4. 打开 Firefox 浏览器，访问 `about:addons`
5. 点击"扩展 -> 管理您的扩展（设置） -> 调试附加组件"
6. 点击"临时载入附加组件"
7. 选择 `distFirefox` 目录下的 `emojiclick_toolbar-x.x.x.zip` 文件

注意：
- Firefox 版本需要 >= 109
- 每次重启 Firefox 后需要重新加载插件
- 如遇到问题，请查看浏览器控制台的错误信息

## 使用

1. 点击工具栏图标打开 EmojiClick。
2. 输入关键词查找表情符号。
3. 点击表情符号将其复制到剪贴板。

## 开发

### 依赖

- React
- TypeScript
- Tailwind CSS

### 脚本

- `yarn start` - 启动开发服务器
- `yarn build` - 构建生产版本

## 贡献

欢迎贡献代码！请提交 Pull Request 或报告问题。

## 许可证

此项目使用 MIT 许可证。

## 运行项目

### 本地运行

1. 确保已安装 [Node.js](https://nodejs.org/) 和 [Yarn](https://yarnpkg.com/)。
2. 克隆此仓库并进入项目目录(https://github.com/win-wiz/emoji-click-extension-web.git)。
3. 运行 `yarn install` 安装依赖。
4. 运行 `yarn start` 启动开发服务器。
5. 在浏览器中打开 `http://localhost:3000` 查看项目。 