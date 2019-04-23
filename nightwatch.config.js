const config = {
  'webdriver': {
    'start_process': true,
    'server_path': './node_modules/.bin/geckodriver',
    'cli_args': [
      '--log', 'debug'
    ],
    'port': 4444
  },
  'test_settings': {
    'firefox': {
      'desiredCapabilities': {
        'browserName': 'firefox',
        'acceptInsecureCerts': true
      }
    }
  }
};

module.exports = config;
