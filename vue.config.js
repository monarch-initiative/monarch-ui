module.exports = {
  outputDir: 'docs',
  baseUrl: '/monarch-ui/',
  lintOnSave: false,

  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        /* eslint no-param-reassign: 0 */
        options.transformAssetUrls = {
          'img': 'src',
          'image': 'xlink:href',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'img-src',
          'b-carousel-slide': 'img-src',
          'b-embed': 'src'
        };

        return options;
      });
  }

/*
const path = require('path');
  // Based on:
  //  https://github.com/vuejs/vue-cli/issues/1647#issuecomment-399093605
  //
  chainWebpack: config => {
    config.plugin('define').tap(definitions => {
      definitions[0] = Object.assign(definitions[0], {
        'monarchNGPrelude': path.join(__dirname, 'src/style/variables.scss')
      });
      return definitions;
    });
  }
*/
};
