const path = require('path');

const analyze = process.env.BUILD === 'analyze';
const nonrootdomain = process.env.BUILD === 'nonrootdomain';
const baseURL = nonrootdomain ? '/monarch-ui/' : '/';

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

// const GenomeFeatureViewer = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/dist/index.js');
// const GenomeFeatureViewerCSS = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/dist/GenomeFeatureViewer.css');
const GenomeFeatureViewer = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/src/index.js');
const GenomeFeatureViewerCSS = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/src/GenomeFeatureViewer.css');

const vueConfig = {
  // outputDir: 'dist',
  publicPath: baseURL,

  lintOnSave: false,

  pluginOptions: {
    // https://github.com/mrbbot/vue-cli-plugin-webpack-bundle-analyzer
    // https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin
    webpackBundleAnalyzer: {
      analyzerMode: 'disabled',
    }
  },

  configureWebpack: {
    resolve: {
      alias: {
        'GenomeFeatureViewer': GenomeFeatureViewer,
        'GenomeFeatureViewerCSS': GenomeFeatureViewerCSS,
        'esprima$': path.join(__dirname, 'src/NOP.js'),
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

};

if (analyze) {
  vueConfig.pluginOptions.webpackBundleAnalyzer.analyzerMode = 'server';
}

module.exports = vueConfig;
