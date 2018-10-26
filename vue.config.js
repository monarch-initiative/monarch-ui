const path = require('path');

const markdownItClass = require('markdown-it');
const mila = require('markdown-it-link-attributes');

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

const milaOptions = {
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
};

// mdLoader.preventExtract = true;
mdLoader.raw = true;
mdLoader.wrapper = 'div';
// mdLoader.use = [   // Fails during npm run build
//   [mila, milaOptions]
// ];

mdLoader.preprocess = function preprocess(md, source) {
  md.use(mila, milaOptions);

  return source;
};

//   // // Remember old renderer, if overriden, or proxy to default renderer
//   // const defaultRender = md.renderer.rules.link_open || function defaultRender(tokens, idx, options, env, self) {
//   //   return self.renderToken(tokens, idx, options);
//   // };

//   // md.renderer.rules.link_open = function link(tokens, idx, options, env, self) {
//   //   // If you are sure other plugins can't add `target` - drop check below
//   //   const aIndex = tokens[idx].attrIndex('target');

//   //   if (aIndex < 0) {
//   //     tokens[idx].attrPush(['target', '_blank']); // add new attribute
//   //   }
//   //   else {
//   //     tokens[idx].attrs[aIndex][1] = '_blank'; // replace value of existing attr
//   //   }

//   //   // pass token to default renderer.
//   //   return defaultRender(tokens, idx, options, env, self);
//   // };

//   // do any thing
//   return source;
// };

mdLoaderPlain.raw = true;
mdLoaderPlain.wrapper = 'div';
mdLoaderPlain.wrapperClass = 'vue-markdown-plain';

mdLoaderPlain.preprocess = function preprocess(md, source) {
  md.use(mila, milaOptions);

  return source;
};

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
      // .options({
      //   raw: true,
      //   wrapper: 'div',
      //   wrapperClass: 'vue-markdown-plain',
      //   options: mdLoaderPlain
      // });

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
