// babel.config.js
module.exports = {
  // include some basic presets for React development
  // see babel preset docs for exact list of features provided by these presets
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
      '@babel/preset-react',
    ],
  ],
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-syntax-jsx'
    ],
  ]
};
