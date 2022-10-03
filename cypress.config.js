const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.tiqets.com/en',
    watchForFileChanges: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 5000,
    requestTimeout: 10000
  },
  env: {
    language: 'en',
    currency: 'EUR'
  }
})

