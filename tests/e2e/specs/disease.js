module.exports = {
  'Marfan Syndrome - MONDO:0007947': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + 'disease/MONDO:0007947')
      .waitForElementVisible('#app', 5000)
      .waitForElementVisible('.node-content-section', 5000)
      .assert.containsText('.node-description', 'disorder of the connective tissue')
      .assert.elementCount('.node-card', 6)
      .end();
  },

  'Troyer syndrome - MONDO:0010156': (browser) => {
    browser
      .url(process.env.VUE_DEV_SERVER_URL + 'disease/MONDO:0010156')
      .waitForElementVisible('#app', 5000)
      .waitForElementVisible('.node-content-section', 5000)
      .assert.containsText('.node-description', 'which encodes the protein spartin')
      .assert.elementCount('.node-card', 5)
      .assert.containsText('.node-synonyms', 'spastic paraplegia')
      .end();
  },
};
