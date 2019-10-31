/* eslint import/prefer-default-export: 0 */

function applyLinkHandlersFunction(parser) {
  // https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer

  // Remember old renderer, if overriden, or proxy to default renderer
  const defaultRenderLinkOpen = parser.renderer.rules.link_open || function defaultRenderLinkOpen(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  const defaultRenderLinkClose = parser.renderer.rules.link_close || function defaultRenderLinkClose(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  let inRouterLink = false;

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
      } else if (href.match(/^https?:\/\//)) {
        // console.log('external', href);
      } else {
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
    } else {
      tokens[idx].attrs[targetIndex][1] = targetType; // replace value of existing attr
    }

    const relIndex = tokens[idx].attrIndex('rel');
    if (relIndex < 0) {
      tokens[idx].attrPush(['rel', relType]); // add new attribute
    } else {
      tokens[idx].attrs[relIndex][1] = relType; // replace value of existing attr
    }

    if (!result) {
      result = defaultRenderLinkOpen(tokens, idx, options, env, self);
    }

    return result;
  };

  parser.renderer.rules.link_close = function link(tokens, idx, options, env, self) {
    let result = defaultRenderLinkClose(tokens, idx, options, env, self);
    if (inRouterLink) {
      inRouterLink = false;
      result = '</router-link>';
    }

    return result;
  };

  parser.renderer.rules.blockquote_open = function link(tokens, idx, options, env, self) {
    return '<blockquote class="blockquote">';
  };
}

module.exports = {
  applyLinkHandlers: applyLinkHandlersFunction,
};
