module.exports = !!process.env.TEAMCITY_VERSION
  ? require('eslint-teamcity')
  : require('eslint').CLIEngine.getFormatter('stylish')
