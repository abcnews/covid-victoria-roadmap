const { resolve } = require('path');
module.exports = {
  webpack: config => {
    const rules = config.module.rules;
    const scriptsRule = rules.find(x => x.__hint__ === 'scripts');
    scriptsRule.include.push(resolve(__dirname, 'node_modules/d3-array'), resolve(__dirname, 'node_modules/d3-scale'));
    rules.push({
      __hint__: 'data',
      test: /\.[tc]sv$/,
      loader: 'csv-loader',
      options: {
        dynamicTyping: true,
        header: true,
        skipEmptyLines: true
      }
    });

    return config;
  }
};
