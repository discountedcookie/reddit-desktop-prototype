const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src', 'renderer'),
      },
      extensions: ['.js', '.vue', '.json'],
    },
  },
  pages: {
    index: {
      entry: 'src/renderer/index.js',
    },
  },
  pluginOptions: {
    electronBuilder: {
      mainProcessFile: 'src/main/index.js',
      preload: 'src/main/preload.js',
    },
  },
};
