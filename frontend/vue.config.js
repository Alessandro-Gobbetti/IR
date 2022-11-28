const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();
    svgRule.delete('type');
    svgRule.delete('generator');

    svgRule
      .use('vue-loader')
      .loader('vue-loader') // or vue-loader-v16 if you are using a preview support of Vue 3 in Vue CLI
      .end()
      .use('vue-svg-loader')
      .loader('vue-svg-loader');
  },
  // The devServer in which the Vue app will be served
  devServer: {
  },

})