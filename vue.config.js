// vue.config.js
function isProd() {
  return process.env.NODE_ENV === 'production'
}

module.exports = {
  indexPath: 'vueAntdDynamicTable.js', // 输出路径
  configureWebpack: {
    externals: isProd() ? [{
      './cptable': 'var cptable'
    }] : {
      './cptable': 'var cptable'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add(__dirname + 'packages')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options
      })
  }
}