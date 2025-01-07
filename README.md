# EmojiClick Toolbar

EmojiClick Toolbar is a powerful emoji picker extension that supports multiple browsers. Instantly find the perfect emoji by typing any mood, phrase, or lyrics.

## Features

- Quickly find and select emojis
- Multi-language support
- Recently used emojis
- Browser notifications

## Installation

### Chrome

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer Mode.
4. Click "Load unpacked" and select the project folder.

### Firefox

1. Clone or download this repository
2. Run `yarn install` to install dependencies
3. Run `yarn build:firefox` to build Firefox extension
4. Open Firefox browser and navigate to `about:addons`
5. Click "Extensions -> Manage Your Extensions (Settings) -> Debug Add-ons"
6. Click "Load Temporary Add-on"
7. Select the `emojiclick_toolbar-x.x.x.zip` file in the `distFirefox` directory

Note:
- Firefox version >= 109 required
- Extension needs to be reloaded after Firefox restart
- If you encounter any issues, please check the browser console for error messages

## Usage

1. Click the toolbar icon to open EmojiClick.
2. Enter keywords to find emojis.
3. Click an emoji to copy it to the clipboard.

## Development

### Dependencies

- React
- TypeScript
- Tailwind CSS

### Scripts

- `yarn start` - Start the development server
- `yarn build` - Build for production

## Contribution

Contributions are welcome! Please submit a Pull Request or report issues.

## License

This project is licensed under the MIT License.

## Running the Project

### Local Development

1. Ensure [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/) are installed.
2. Clone this repository and navigate to the project directory(https://github.com/win-wiz/emoji-click-extension-web.git).
3. Run `yarn install` to install dependencies.
4. Run `yarn start` to start the development server.
5. Open `http://localhost:3000` in your browser to view the project.

[中文文档](README.zh.md) 