const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

let configDev = {
  entry: "./src/index.js",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env",
            {
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          ],
        },
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/img/'
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/fonts/'
            }
          }
        ]
      },
    ]
  },
  resolve: { 
    extensions: ["*", ".js", ".jsx"],
    fallback: {
      "crypto": false,
    } 
   },
  output: {
    path: path.resolve("./dist/assets"),
    publicPath: "/assets/",
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: "./src/",
    port: 3000,
    publicPath: "/assets/",
    historyApiFallback: true,
    hotOnly: true,
    open: true
  },
}

let configProd = {
  entry: "./src/index.js",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env",
            {
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          ],
        }

      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/img/'
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: './assets/fonts/'
            }
          }
        ]
      }
    ]
  },
  resolve: { 
    extensions: ["*", ".js", ".jsx"],
    fallback: {
      "crypto": false,
    } 
   },
  output: {
    path: path.resolve("./dist/assets"),
    publicPath: "/assets/",
    filename: '[name].[hash].js',
  },
  devServer: {
    contentBase: "./src/",
    port: 3000,
    publicPath: "/assets/",
    historyApiFallback: true,
    hotOnly: true,
    open: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      { from: path.resolve('src/assets'), to: path.resolve('dist/assets') },
      { from: path.resolve('src/data/seo.json'), to: path.resolve('dist/seo.json') },
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: path.resolve('dist') + '/index.html'
    }),
  ]
}

module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    return configDev;
  }

  if (argv.mode === 'production') {
    return configProd;
  }

}
