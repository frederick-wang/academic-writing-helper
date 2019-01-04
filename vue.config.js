process.env.VUE_APP_VERSION = require('./package.json').version

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'Academic Writing Helper',
        icon: './public/icon.png'
      }
    }
  }
}
