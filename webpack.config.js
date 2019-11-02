module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [ '@babel/preset-env' ],
            },
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          }
          
        ],
        
          
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'url-loader',
        ],
      }
    ]
  },
  output: {
    filename: 'index.min.js',
    path: __dirname
  },
  devtool: 'inline-source-map',
  devServer: {
    stats: 'errors-only',
    contentBase: __dirname,
    compress: true,
    port: 9000
  }
};
