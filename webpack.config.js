const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotenvPlugin = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    port: process.env.WEBPACK_PORT || 3000,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          'sass-loader'
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      hash: true
    }),
    new CopyWebpackPlugin([
      { from: 'public/assets', to: 'assets' },
    ]),
    new DotenvPlugin(),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, "src/components/"),
      pages: path.resolve(__dirname, "src/pages/"),
      utils: path.resolve(__dirname, "src/utils/"),
    },
    extensions: ['.js', '.json', '.ts', '.tsx'],
  }
};
