const errorInProduction = process.env.NODE_ENV === 'production' ? 'error' : 'off';
const path = require('path');

// const GenomeFeatureViewer = path.resolve(__dirname, '../GenomeFeatureComponent/dist/index.js');
// const GenomeFeatureViewerCSS = path.resolve(__dirname, '../GenomeFeatureComponent/dist/GenomeFeatureViewer.css');
const GenomeFeatureViewer = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/dist/index.js');
const GenomeFeatureViewerCSS = path.resolve(__dirname, 'node_modules/genomefeaturecomponent/dist/GenomeFeatureViewer.css');

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true
  },
  plugins: [
    'import',
    'vue'
  ],
  extends: [
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    'plugin:vue/recommended',
    'plugin:vue/essential',
    '@vue/standard',
    'airbnb-base',
  ],
  rules: {
    'no-console': 0, // errorInProduction,
    'no-debugger': errorInProduction,
    'import/dynamic-import-chunkname': 'error',
    'brace-style': [2, 'stroustrup'],
    'padded-blocks': 0,
    'indent': [2, 2, { 'SwitchCase': 1 }],
    'spaced-comment': 1,
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    // 'import/prefer-default-export': 'off',
    // 'arrow-parens': ['error', 'as-needed'],
    // 'vue/html-self-closing': 0,
    // 'vue/html-indent': 1,
    'global-require': 0,
    'no-unused-vars': [0, { 'argsIgnorePattern': '^_' }],
    'quote-props': [0],
    'prefer-destructuring': 0,
    'prefer-arrow-callback': 0,
    'prefer-template': 0,
    'comma-dangle': 0,
    'max-len': 0,
    'standard/no-callback-literal': 0,
    'no-param-reassign': 0,
    'no-underscore-dangle': 0,
  },
  parserOptions: {
    parser: 'babel-eslint'
  },

  settings: {
    //
    // eslint-import-resolver-webpack is supposed to allow the webpack
    // aliases from webpack.config.js to be recognized as valid import
    // locations, but it doesn't work.
    // So I'm using eslint-import-resolver-alias and duplicating the
    // aliases here, which does work.
    //
    'import/resolver': {
      alias: { // https://www.npmjs.com/package/eslint-import-resolver-alias
        map: [
          ['@', path.resolve(__dirname, 'src')],
          ['vue$', 'vue/dist/vue.runtime.esm.js'],
          ['GenomeFeatureViewer$', GenomeFeatureViewer],
        ],
      },
      webpack: { // https://www.npmjs.com/package/eslint-import-resolver-webpack
        // Does not work, but should
      },
    }
  },
};
