const path = require('path');

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
      }
    ]
  },
  externals: {
    "leaflet": "L",
  }
}