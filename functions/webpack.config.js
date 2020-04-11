const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: 'development',
  entry: './src/index.ts',

  // ファイルの出力設定
  output: {
    path: `${__dirname}/`,
    filename: 'index.js',
    libraryTarget: 'this'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, 'tsconfig.json')
        }
      }
    ]
  },
  // import 文で .ts ファイルを解決するため
  // これを定義しないと import 文で拡張子を書く必要が生まれる。
  resolve: {
    // 拡張子を配列で指定
    extensions: ['.ts', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src')
    }
  },

  externals: [nodeExternals()]
};
