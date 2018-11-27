/* eslint-disable */

/*
  vue-markdown-loader-improved.js

  This custom webpack loader will load Markdown source files that
  optionally contain script and style sections, and will generate a
  VueJS component suitable for mounting in a VueJS application.

  This loader was extracted and modified from:
    https://github.com/QingWei-Li/vue-markdown-loader
  Eventually, I hope to merge my fixes and changes back into that
  repo. However, the license is WTFPL, so I'm going to take advantage
  of the convenience of having a single file in our repo, rather than
  maintaining two repos.

  To see the changes made between the vue-markdown-loader and this
  version, use:
  > diff \
    src/loaders/vue-markdown-loader-improved.js \
    node_modules/vue-markdown-loader/lib/markdown-compiler.js
  Changes from the above loader so far:
  - Add 'wrapperClass' option, which will be assigned as a CSS class
  to the 'wrapper' element.
  - Use markdown-it-anchor plugin
  - Modify the link_open/link_close render functions to deal with 'target'
    and 'rel' attributes, as well as using VueJS's router-link when appropriate.

*/

var loaderUtils = require('loader-utils');
var hljs = require('highlight.js');
var cheerio = require('cheerio');
var markdown = require('markdown-it');
const mia = require('markdown-it-anchor');

var Token = require('markdown-it/lib/token');

// https://github.com/valeriangalliat/markdown-it-anchor#usage
const miaOptions = {
  permalink: true,
  permalinkBefore: false
};


/**
 * `<pre></pre>` => `<pre v-pre></pre>`
 * `<code></code>` => `<code v-pre></code>`
 * @param  {string} str
 * @return {string}
 */
var addVuePreviewAttr = function(str) {
  return str.replace(/(<pre|<code)/g, '$1 v-pre');
};

/**
 * renderHighlight
 * @param  {string} str
 * @param  {string} lang
 */
var renderHighlight = function(str, lang) {
  if (!(lang && hljs.getLanguage(lang))) {
    return '';
  }

  return hljs.highlight(lang, str, true).value;
};

/**
 * html => vue file template
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
var renderVueTemplate = function(html, wrapper, wrapperClass) {
  var $ = cheerio.load(html, {
    decodeEntities: false,
    lowerCaseAttributeNames: false,
    lowerCaseTags: false
  });

  var output = {
    style: $.html('style'),
    // get only the first script child. Causes issues if multiple script files in page.
    script: $.html($('script').first())
  };
  var result;

  $('style').remove();
  $('script').remove();

  result =
    `<template><${wrapper} class="${wrapperClass}">` +
    $.html() +
    `</${wrapper}></template>\n` +
    output.style +
    '\n' +
    output.script;

  return result;
};

module.exports = function(source) {
  this.cacheable && this.cacheable();
  var parser, preprocess;
  var params = loaderUtils.getOptions(this) || {};

  var vueMarkdownOptions = this._compilation ?
                            this._compilation.__vueMarkdownOptions__ :
                            null;
  var opts = vueMarkdownOptions ? Object.create(vueMarkdownOptions.__proto__) : {}; // inherit prototype
  var preventExtract = false;

  opts = Object.assign(opts, params, vueMarkdownOptions); // assign attributes

  if (opts.preventExtract) {
    delete opts.preventExtract;
    preventExtract = true;
  }

  if (typeof opts.render === 'function') {
    parser = opts;
  } else {
    opts = Object.assign(
      {
        preset: 'default',
        html: true,
        highlight: renderHighlight,
        wrapper: 'section',
        wrapperClass: 'vue-markdown'
      },
      opts
    );

    var plugins = opts.use;
    preprocess = opts.preprocess;

    delete opts.use;
    delete opts.preprocess;

    parser = markdown(opts.preset, opts);
    parser.use(mia, miaOptions);

    // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
    // Remember old renderer, if overriden, or proxy to default renderer
    const defaultRender = parser.renderer.rules.link_open || function defaultRender(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    let inRouterLink = false;

    parser.renderer.rules.link_close = function link(tokens, idx, options, env, self) {
      let result = defaultRender(tokens, idx, options, env, self);
      if (inRouterLink) {
        inRouterLink = false;
        result = '</router-link>';
      }

      return result;
    };


    parser.renderer.rules.link_open = function link(tokens, idx, options, env, self) {
      // pass token to default renderer.
      let targetType = '_blank';
      let relType = 'noopener noreferrer';

      let result = null;

      const hrefIndex = tokens[idx].attrIndex('href');
      if (hrefIndex >= 0) {
        const href = tokens[idx].attrs[hrefIndex][1];
        if (href.match(/^#/)) {
          // console.log('intrapage', href);
          targetType = '_self';
          relType = '';
        }
        else if (href.match(/^https?:\/\//)) {
          // console.log('external', href);
        }
        else {
          inRouterLink = true;
          targetType = '_self';
          relType = '';
          result =
`
<router-link
  to="${href}">
`;
          // console.log('router', result, href);
        }
      }

      // If you are sure other plugins can't add `target` - drop check below
      const targetIndex = tokens[idx].attrIndex('target');
      if (targetIndex < 0) {
        tokens[idx].attrPush(['target', targetType]); // add new attribute
      }
      else {
        tokens[idx].attrs[targetIndex][1] = targetType; // replace value of existing attr
      }

      const relIndex = tokens[idx].attrIndex('rel');
      if (relIndex < 0) {
        tokens[idx].attrPush(['rel', relType]); // add new attribute
      }
      else {
        tokens[idx].attrs[relIndex][1] = relType; // replace value of existing attr
      }

      if (!result) {
        result = defaultRender(tokens, idx, options, env, self);
      }

      return result;
    };

    //add ruler:extract script and style tags from html token content
    !preventExtract &&
      parser.core.ruler.push('extract_script_or_style', function replace(
        state
      ) {
        let tag_reg = new RegExp('<(script|style)(?:[^<]|<)+</\\1>', 'g');
        let newTokens = [];
        state.tokens
          .filter(token => token.type == 'fence' && token.info == 'html')
          .forEach(token => {
            let tokens = (token.content.match(tag_reg) || []).map(content => {
              let t = new Token('html_block', '', 0);
              t.content = content;
              return t;
            });
            if (tokens.length > 0) {
              newTokens.push.apply(newTokens, tokens);
            }
          });
        state.tokens.push.apply(state.tokens, newTokens);
      });

    if (plugins) {
      plugins.forEach(function(plugin) {
        if (Array.isArray(plugin)) {
          parser.use.apply(parser, plugin);
        } else {
          parser.use(plugin);
        }
      });
    }
  }

  /**
   * override default parser rules by adding v-pre attribute on 'code' and 'pre' tags
   * @param {Array<string>} rules rules to override
   */
  function overrideParserRules(rules) {
    if (parser && parser.renderer && parser.renderer.rules) {
      var parserRules = parser.renderer.rules;
      rules.forEach(function(rule) {
        if (parserRules && parserRules[rule]) {
          var defaultRule = parserRules[rule];
          parserRules[rule] = function() {
            return addVuePreviewAttr(defaultRule.apply(this, arguments));
          };
        }
      });
    }
  }

  overrideParserRules(['code_inline', 'code_block', 'fence']);

  if (preprocess) {
    source = preprocess.call(this, parser, source);
  }

  source = source.replace(/@/g, '__at__');

  var content = parser.render(source).replace(/__at__/g, '@');
  var result = renderVueTemplate(content, opts.wrapper, opts.wrapperClass);

  if (opts.raw) {
    return result;
  } else {
    return 'module.exports = ' + JSON.stringify(result);
  }
};
