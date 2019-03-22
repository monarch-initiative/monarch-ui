// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'Landing Page Tests': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.monarch-home-view')
      .assert.containsText('.intro', 'translational science')
      .assert.elementCount('.intro', 1)
      .end();
  },

  'Autocomplete Search': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('.monarch-autocomplete')
      .setValue('.monarch-autocomplete .test-input-search-text', 'Alzheimer')
      .click('.monarch-autocomplete .test-button-show-all')
      .waitForElementVisible('#monarch-search-container', 5000)
      .waitForElementVisible('#monarch-search-container .search-results-rows', 5000)
      .waitForElementVisible('#monarch-search-container .search-results-rows .test-search-results-table tbody', 5000)
      .assert.containsText('#monarch-search-container .search-results-rows .test-search-results-table tbody', 'Alzheimer\'s disease')
      .end();
  },

  'Autocomplete Menu': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL)
      .waitForElementVisible('#app', 5000)
      .waitForElementVisible('.monarch-home-view', 5000)
      .assert.elementPresent('.monarch-autocomplete')
      .setValue('.monarch-autocomplete .test-input-search-text', 'anosm')
      .waitForElementVisible('.monarch-home-view .monarch-autocomplete .test-input-dropdown', 5000)
      .assert.containsText('.monarch-home-view .monarch-autocomplete .test-input-dropdown', 'anosmia for butyl mercaptan')
      .click('.monarch-home-view .monarch-autocomplete .test-input-dropdown .test-input-dropdown-option')
      .waitForElementVisible('.node-content-section', 5000)
      .assert.containsText('.node-description', 'Loss of or impaired ability to smell')
      .assert.containsText('.node-synonyms', 'anosmia')
      .end();
  },
};
