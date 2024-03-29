var path = require('path')
var webpack = require('webpack')

const isCss = process.env.NODE_TYPE === 'css'
const getEntry = () => {
  if (isCss) {
    return './src/lib/importCss.js'
  }
  return process.env.NODE_ENV === 'development' ? './src/main.js' : './src/lib/index.js'
}

const getCssConfig = () => {
  if (!isCss) {
    return {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader" // 将 JS 字符串生成为 style 节点
          },
          {
            loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
          },
          {
            loader: "sass-loader" // 将 Sass 编译成 CSS
          }
        ]
    }
  }

  return {
    test: /\.scss$/,
    use: [{
      loader: 'file-loader',
      options: {
        name(file) {
          // folder 仅支持直接的文件，不支持多层
          return '../src/lib/index.css';
          // return 'css/[folder]/[name].[hash].css';
        },
      }
    }, 'sass-loader']
  }
}

module.exports = {
  entry: getEntry(),
  // entry: './src/lib/importCss.js',
  // entry: process.env.NODE_ENV === 'development' ? './src/main.js' : './src/lib/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    library: 'EleListPage',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      getCssConfig(),
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      // {
        // test: /\.(png|jpg|gif|svg)$/,
        // loader: 'url-loader'
        // options: {
        //   name: '[name].[ext]?[hash]'
        // }
      // },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 99999,
              esModule: false
            },
          },
        ],
      },
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve('src')
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
