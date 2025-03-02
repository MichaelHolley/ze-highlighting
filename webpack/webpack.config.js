const path = require('node:path');
const CopyPlugin = require('copy-webpack-plugin');
const { exec } = require('node:child_process');

module.exports = {
  mode: 'production',
  entry: {
    executor: path.resolve(__dirname, '..', 'src', 'executor.ts'),
    popup: path.resolve(__dirname, '..', 'src', 'popup.ts')
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: '.', to: '.', context: 'public' },
        { from: './icons', to: './icons' }
      ]
    })
  ]
};
