const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const WebpackStrip = require('webpack-strip');

const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextWebpackPlugin('stylesheets/[name]-less.css');
const extractSass = new ExtractTextWebpackPlugin('stylesheets/[name]-scss.css');

let isDev = process.env.NODE_ENV === 'production';// 判断是否为开发环境

module.exports = {
    context: __dirname,// 项目的根目录
    entry: {
        app: './index.js',
        vendor: ['babel-polyfill', 'react', 'react-dom', 'redux', 'react-redux']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'js/[name].bundle.js',
        publicPath: isDev ? 'http://localhost:8081/' : '/',
    },
    devtool: isDev ? 'cheap-module-eval-source-map' : '',
    module: {
        rules: [
            {
                test: /\.html$/,
                use: ['html-loader']
            },
            {
                test: /\.js(x)$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [
                    'babel-loader',
                    WebpackStrip.loader('console.log', 'console.warn', 'console.error')
                ]
            },
            {
                // 项目中的 .css 文件 全部通过注入<style>标签将CSS添加到DOM， postcss为其添加前缀以适应不同浏览器
                test: /\.css$/,
                use:[
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 1 }
                    },
                    'postss-loader'
                ]
            },
            {
                // 将less编译的css从bundle.js中抽离出来单独放入stylesheets文件夹下，这些样式将以<link/>标签引入
                test: /\.less$/,
                use: extractLess.extract(['css-loader', 'postcss-loader','less-loader'])
            },
            {
                test: /\.scss$/,
                use: extractSass.extract(['css-loader','postcss-loader','sass-loader'])
            },
            {
                test: /\.(png|jpg|gif|svg|jpeg)$/i,
                use: [
                    'file-loader?name=assets/[name]-[hash:5].[ext]',
                    'url-loader?limit=20000&name=assets/[name]-[hash:5].[ext]',
                    'image-webpack-loader'
                ]
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=10000&name=assets/[name]-[hash:5]'
            }
        ]
    },
    resolve: {
        // 在代码中引入文件时，可以省略相应的后缀
        extensions: [' ', '.js', '.jsx', '.css', '.less', '.json'],
        alias: {
            //  在此处以{key: value}形式写入对应的{路径名：路径}后，可以直接以路径名代替路径
            AppStore : 'src/stores/index.js',//后续直接 require('AppStore') 即可
            AppAction : 'src/actions/index.js',
        }
    },
    devServer: {
        // 所有来自 build/ 目录的文件都做 gzip 压缩：
        inline: true,// 在 dev-server 的两种不同模式之间切换。默认情况下，应用程序启用内联模式(inline mode)。这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台。
        hot: true,// 启用 webpack 的模块热替换特性
        port: 8081,
        compress: true,// gzip 压缩
        stats: { color: true },// 彩色字体
        contentBase:  path.join(__dirname, "build"),// 静态文件的根目录, 告诉服务器从哪里提供内容,推荐使用绝对路径,但是也可以从多个目录提供内容[path1, path2, ...]
        historyApiFallback: {
            // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 404.html
            rewrites: [
                { from: /^\/$/, to: '/assets/landing.html' },
                { from: /^\/subpage/, to: '/assets/subpage.html' },
                { from: /./, to: '/assets/404.html' }
            ]
        },
        headers: {
            // 在所有响应中添加首部内容
            'Access-Control-Allow-Origin': '*'
        },
        lazy: false, // 当启用 lazy 时，dev-server 只有在请求时才编译包(bundle)。这意味着 webpack 不会监视任何文件改动。我们称之为“惰性模式”。
        noInfo: false, // 启用 noInfo 后，诸如「启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏。错误和警告仍然会显示。
// 启用 quiet:true 后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自 webpack 的错误或警告在控制台不可见
        quiet: false
    },
    plugins: [
        extractLess,
        extractSass,
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',
            chunks: [ 'app', 'vendor']
        }),
        new OpenBrowserWebpackPlugin({ url: 'http://localhost:8081' }),
        new webpack.optimize.HotModuleReplacementPlugin()

    ]
};
