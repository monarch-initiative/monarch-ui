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
  }
};
