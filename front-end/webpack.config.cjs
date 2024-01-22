const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  entry: "./src/kombstra/main.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'kombstra.js',
  },
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource'
      },
      {
        test: /\.css$/i,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: { presets: ["@babel/preset-env"] }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        // options: {
        //   reactivityTransform: true
        // }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: 'true',
      __VUE_PROD_DEVTOOLS__: 'false',
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
    }),
    new VueLoaderPlugin()
  ]
}