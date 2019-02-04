module.exports = {
  'Disease Node Tests': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + 'disease/MONDO:0007947')
      .waitForElementVisible('#app', 5000)
      .waitForElementVisible('.node-content-section', 5000)
      .assert.containsText('.node-description', 'disorder of the connective tissue')
      .assert.elementCount('.node-card', 6)
      .end();
  }
};
