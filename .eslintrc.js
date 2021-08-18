const path = require("path");

// const GenomeFeatureViewer = path.resolve(__dirname, '../GenomeFeatureComponent/dist/index.js');
// const GenomeFeatureViewerCSS = path.resolve(__dirname, '../GenomeFeatureComponent/dist/GenomeFeatureViewer.css');
const GenomeFeatureViewer = path.resolve(
  __dirname,
  "node_modules/genomefeaturecomponent/dist/index.js"
);
const GenomeFeatureViewerCSS = path.resolve(
  __dirname,
  "node_modules/genomefeaturecomponent/dist/GenomeFeatureViewer.css"
);

module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  plugins: ["import", "vue"],
  extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/prettier"],
  rules: {},
  parserOptions: {
    parser: "babel-eslint",
  },

  settings: {
    //
    // eslint-import-resolver-webpack is supposed to allow the webpack
    // aliases from webpack.config.js to be recognized as valid import
    // locations, but it doesn't work.
    // So I'm using eslint-import-resolver-alias and duplicating the
    // aliases here, which does work.
    //
    "import/resolver": {
      alias: {
        // https://www.npmjs.com/package/eslint-import-resolver-alias
        map: [
          ["@", path.resolve(__dirname, "src")],
          ["vue$", "vue/dist/vue.runtime.esm.js"],
          ["GenomeFeatureViewer$", GenomeFeatureViewer],
        ],
      },
      webpack: {
        // https://www.npmjs.com/package/eslint-import-resolver-webpack
        // Does not work, but should
      },
    },
  },
};
