"use strict";

// Assign variables
const presets = ["@babel/preset-env"];
const plugins = [
  "@babel/plugin-transform-regenerator",
  "@babel/plugin-syntax-throw-expressions",
  "@babel/plugin-transform-modules-commonjs",
  "@babel/plugin-proposal-optional-chaining"
];

// Babel configuration
const rcConfig = {
  comments: false,
  presets,
  plugins
};

// Export
module.exports = api => {
  api.cache(true);
  return {
    env: {
      test: rcConfig,
      development: rcConfig
    }
  };
};
