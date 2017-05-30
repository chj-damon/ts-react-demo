const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    /*
        html-webpack-plugin用来打包入口html文件
        entry配置的入口是js文件, webpack以js文件为入口, 遇到import, 用配置的loader加载引入文件
        但作为浏览器打开的入口html, 是引用入口js的文件, 它在整个编译过程的外面,
        所以, 我们需要html-webpack-plugin来打包作为入口的html文件
    */
    new HtmlWebpackPlugin({
        inject: true,
        filename: 'index.html',
        /*
            template参数指定入口html文件路径, 插件会把这个文件交给webpack去编译,
            webpack按照正常流程, 找到loaders中test条件匹配的loader来编译, 那么这里html-loader就是匹配的loader
            html-loader编译后产生的字符串, 会由html-webpack-plugin储存为html文件到输出目录, 默认文件名为index.html
            可以通过filename参数指定输出的文件名
            html-webpack-plugin也可以不指定template参数, 它会使用默认的html模板.
        */
        template: __dirname + '/index.html'
    })
];

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: [
        // 解析typescript
        {
            test: /\.tsx$/,
            exclude: '/node_modules/',
            use: [{
                loader: 'awesome-typescript-loader'
            }]
        }, 
        // 解析css
        {
            test: /\.css$/,
            exclude: /node_modules/,
            /*
                先使用css-loader处理, 返回的结果交给style-loader处理.
                css-loader将css内容存为js字符串, 并且会把background, @font-face等引用的图片,
                字体文件交给指定的loader打包, 类似上面的html-loader, 用什么loader同样在loaders对象中定义, 等会下面就会看到.
            */
            use: ['style-loader', 'css-loader'],
        }, 
        {
            test: /\.html$/,
            /*
            使用html-loader, 将html内容存为js字符串, 比如当遇到
            import htmlString from './template.html'
            template.html的文件内容会被转成一个js字符串, 合并到js文件里.
            */
            use: 'html-loader',
        }, 
        {
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            loader: 'file-loader',
        }, 
        /*
            匹配各种格式的图片和字体文件
            上面html-loader会把html中<img>标签的图片解析出来, 文件名匹配到这里的test的正则表达式,
            css-loader引用的图片和字体同样会匹配到这里的test条件
        */
        {
            test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            use: [
                'file-loader',
                'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}',
            ],
        }, 
        {
            test: /\.json$/,
            use: 'json-loader',
        }, 
        {
            test: /\.(mp4|webm)$/,
            use: 'url-loader?limit=10000',
        }]
    },
    plugins: plugins,
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js','.web.js','.js','.ts','.tsx','.css']
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
};