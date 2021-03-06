
const nodeExternals = require('webpack-node-externals');
webpack = require('webpack');

module.exports = [
    {
        devtool: 'eval-source-map',
        entry:  __dirname + "/app/main.js",//已多次提及的唯一入口文件
        output: {
            path: __dirname + "/public",//打包后的文件存放的地方
            filename: "bundle.js"//打包后输出文件的文件名
        },

        devServer: {
            contentBase: "./public",//本地服务器所加载的页面所在的目录
            historyApiFallback: true,//不跳转
            inline: true//实时刷新
        } ,
        node: {
            dns: 'empty',
            net: 'empty'
        },
        // plugins: [
        //     new webpack.IgnorePlugin(/^codemirror$/),
        //   ],
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js)$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "es2015", "react", "stage-1"
                            ]
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader"
                        }, {
                            loader: "css-loader"
                        }
                    ]
                }
            ]
        }
    },
    
    {
        // server
        entry:  __dirname + "/server/main.js",
        output: {
            path: __dirname +"/server" ,
            filename: 'server.js'
        },
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js)$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "es2015", "stage-1"
                            ]
                        }
                    },
                    exclude: /node_modules/
                }
            ]
        },
        // plugins: [
        //     new webpack.HotModuleReplacementPlugin() 
        //   ],
        target: 'node',
        externals: [nodeExternals()]
    },
]