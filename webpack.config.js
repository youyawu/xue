const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = {
  devtool: "source-map",
  mode: "development",
  entry: "./src/index.js",
  output: {
    publicPath: "", //模板、样式、脚本、图片等资源的路径中统一会加上额外的路径
    path: path.resolve(__dirname, "dist"),
    filename: "./js/[name].[hash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // exclude: /node_modules/,
        // exclude: path.resolve(__dirname, 'node_modules'), //编译时，不需要编译哪些文件
        //include: path.resolve(__dirname, 'src'),//在config中查看 编译时，需要包含哪些文件
        loader: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // favicon: './src/img/favicon.ico',      //图标
      // inject: "body",
      template: "./index.html", //指定要打包的html
      filename: "index.html", //指定输出路径和文件名
      minify: {
        //压缩
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true, //删除空白符与换行符
        removeAttributeQuotes: true, //去除属性引用
      },
    }),
  ],
  devServer: {
    port: 9001,
    // contentBase: path.join(__dirname,'public'), //配置 DevServer HTTP服务器的文件根目录
    compress: true, //是否开启Gzip压缩
    // historyApiFallback: true, //是否开发 HTML5 History API 网页
    hot: true, //是否开启模块热替换功能
    https: false, //  是否开启 HTTPS 模式
  },
};

module.exports = config;
