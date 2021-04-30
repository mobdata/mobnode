qconst path = require('path');

const config = {
  entry: [path.resolve(__dirname, 'src/routes/index.js')],
  //  output: {
  //    path: path.resolve(__dirname, 'src/routes'),
  //    filename: 'index.js'
  //  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        exclude: [
          path.resolve(__dirname, 'node_modules'),
        ],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
    ],
  },
  mode: 'development'

};

module.exports = config;

