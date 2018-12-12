const path = require('path');

const markdownItClass = require('markdown-it');

const mdLoader = markdownItClass({
  html: true,
  breaks: true,
  linkify: true
});
const mdLoaderPlain = markdownItClass({
  html: true,
  breaks: true,
  linkify: true
});

// mdLoader.preventExtract = true;
mdLoader.raw = true;
mdLoader.wrapper = 'div';

mdLoaderPlain.raw = true;
mdLoaderPlain.wrapper = 'div';
mdLoaderPlain.wrapperClass = 'vue-markdown-plain';

// const GenomeFeatureViewer = path.resolve(__dirname, '../GenomeFeatureComponent/dist/index.js');
// const GenomeFeatureViewerCSS = path.resolve(__dirname, '../GenomeFeatureComponent/dist/GenomeFeatureViewer.css');
const GenomeFeatureViewer = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/dist/index.js');
const GenomeFeatureViewerCSS = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/dist/GenomeFeatureViewer.css');

module.exports = {
  // outputDir: 'dist',
  baseUrl: '/monarch-ui/',

  lintOnSave: false,

  configureWebpack: {
    resolve: {
      alias: {
        'GenomeFeatureViewer': GenomeFeatureViewer,
        'GenomeFeatureViewerCSS': GenomeFeatureViewerCSS,
      }
    }
  },

  chainWebpack: (config) => {
    // config.resolve.alias.set(
    //   'GenomeFeatureComponent',
    //   GenomeFeatureComponent
    // );

    config.resolveLoader.modules.add(
      path.resolve('./src/loaders/')
    );

    config.module
      .rule('README')
      .test(/\.md$/)
      .include
      .add(path.resolve('./README.md'))
      .end()
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      // Original: .loader('vue-markdown-loader/lib/markdown-compiler')
      .loader('vue-markdown-loader-improved.js')
      .options(mdLoaderPlain);

    config.module
      .rule('md')
      .test(/\.md$/)
      .include
      .add(path.resolve('src/'))
      .end()
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      // Original: .loader('vue-markdown-loader/lib/markdown-compiler')
      .loader('vue-markdown-loader-improved.js')
      .options(mdLoader);

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
