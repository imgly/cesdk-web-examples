const path = require('path');
// const GracefulFSPlugin = require('graceful-fs-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  externals: {
    'onnxruntime-web': 'onnxruntime-web',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'umd',
      name: 'backgroundRemoval',
    },
  },
  plugins: [
    // new GracefulFSPlugin(),
  ]
};
