module.exports = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "mocha",
  mochaOptions: {
    spec: ['./tests/bypass/*.test.js', './tests/unit/*.test.js'] // Target unit tests for mutation testing
  },
  coverageAnalysis: "perTest",
  symlinkNodeModules: true, // Enable symlinking node_modules
  mutate: [
    'server/index.js',          // Mutate the main server API file
    'server/utils/*.js'         // Mutate the price calculator utility
  ],
  logLevel: "info",
  disableTypeChecks: "{*.*}",
};