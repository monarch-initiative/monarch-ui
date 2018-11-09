const markdownIt = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true
});
const mila = require('markdown-it-link-attributes');

module.exports = {
  outputDir: 'docs',
  baseUrl: '/monarch-ui/',

  // lintOnSave: false,

  chainWebpack: (config) => {
    config.resolveLoader.modules.add(
      '/Users/bud/MI/monarch-ui/src/loaders/'
    );

    // vue-markdown-loader
    // - [vue-markdown-loader](https://github.com/QingWei-Li/vue-markdown-loader)
    // - [markdown-it](https://github.com/markdown-it/markdown-it)
    // - [markdown-it-link-attributes](https://github.com/crookedneighbor/markdown-it-link-attributes)

    markdownIt.preventExtract = true;
    markdownIt.raw = true;
    markdownIt.wrapper = 'div';
    markdownIt.__vueMarkdownOptions__ = {};

    markdownIt.preprocess = function preprocess(md, source) {
      md.use(mila, {
        attrs: {
          target: '_blank',
          rel: 'noopener'
        }
      });

      // // Remember old renderer, if overriden, or proxy to default renderer
      // const defaultRender = md.renderer.rules.link_open || function defaultRender(tokens, idx, options, env, self) {
      //   return self.renderToken(tokens, idx, options);
      // };

      // md.renderer.rules.link_open = function link(tokens, idx, options, env, self) {
      //   // If you are sure other plugins can't add `target` - drop check below
      //   const aIndex = tokens[idx].attrIndex('target');

      //   if (aIndex < 0) {
      //     tokens[idx].attrPush(['target', '_blank']); // add new attribute
      //   }
      //   else {
      //     tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
      //   }

      //   // pass token to default renderer.
      //   return defaultRender(tokens, idx, options, env, self);
      // };

      // do any thing
      return source;
    };

    config.module
      .rule('vmlmd')
      .test(/\.vmlmd$/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      // .loader('vue-markdown-loader/lib/markdown-compiler')
      .loader('vue-markdown-loader-patch.js')
      .options(markdownIt);
    // .options({
    //   raw: true,
    //   wrapper: 'article',
    //   options: markdownIt
    // });


    // vmark-loader
    // config.module
    //   .rule('vmd')
    //   .test(/\.vmd$/)
    //   .use('vue-loader')
    //   .loader('vue-loader')
    //   .end()
    //   .use('vmark-loader')
    //   .loader('vmark-loader')
    //   .options({
    //     extend: function extend(md) {
    //       md.use(mila, {
    //         attrs: {
    //           target: '_blank',
    //           rel: 'noopener'
    //         }
    //       });
    //     }
    //   });

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
