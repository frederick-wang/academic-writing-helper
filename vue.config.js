process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'English Reading Assistant',
        icon: './public/icon.png'
      }
    }
  }
}
