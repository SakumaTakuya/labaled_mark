const path = require('path');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const SplitByPathPlugin = require('webpack-split-by-path');

module.exports = {
    mode : 'production',
    // モジュールバンドルを行う起点となるファイルの指定
    // 指定できる値としては、ファイル名の文字列や、それを並べた配列やオブジェクト
    // 下記はオブジェクトとして指定した例 
    entry: {
        bundle: './src/app.ts'
    },  
    output: {
        // モジュールバンドルを行った結果を出力する場所やファイル名の指定
        // "__dirname"はこのファイルが存在するディレクトリを表すnode.jsで定義済みの定数
        path: path.join(__dirname,'dist'),
        filename: '[name].js',  // [name]はentryで記述した名前(この例ではbundle）が入る
        // chunkFilename: "[name].js"
    },
    // モジュールとして扱いたいファイルの拡張子を指定する
    // 例えば「import Foo from './foo'」という記述に対して"foo.ts"という名前のファイルをモジュールとして探す
    // デフォルトは['.js', '.json']
    resolve: {
        extensions:['.ts','.js']
    },
    devServer: {
        // webpack-dev-serverの公開フォルダ
        contentBase: path.join(__dirname,'dist')
    },
    // モジュールに適用するルールの設定（ここではローダーの設定を行う事が多い）
    module: {
        rules: [
            {
                // 拡張子が.tsで終わるファイルに対して、TypeScriptコンパイラを適用する
                test:/\.ts$/,
                loader:'ts-loader'
            },
            {
                // 対象となるファイルの拡張子(scss)
                test: /\.scss$/,
                // Sassファイルの読み込みとコンパイル
                use: [
                    MiniCssExtractPlugin.loader,
                    // CSSをバンドルするための機能
                    {
                        loader: 'css-loader',
                        options: {
                            // オプションでCSS内のurl()メソッドの取り込まない
                            url: false,
                            // ソースマップの利用有無
                            sourceMap: true,
                            // Sass+PostCSSの場合は2を指定
                            importLoaders: 2
                        },
                    },
                    // PostCSSのための設定
                    {
                        loader: 'postcss-loader',
                        options: {
                            // PostCSS側でもソースマップを有効にする
                            sourceMap: true,
                            // ベンダープレフィックスを自動付与する
                            plugins: () => [require('autoprefixer')]
                        },
                    },
                    // Sassをバンドルするための機能
                    {
                        loader: 'sass-loader',
                        options: {
                            // ソースマップの利用有無
                            sourceMap: true,
                        }
                    }
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/main.css',
          }),
        // new ExtractTextPlugin('style.css'),
        // new SplitByPathPlugin(
        //     [{ name: 'vendor', path: __dirname + '/node_modules' }],
        //     // { ignore: [__dirname + '/node_modules/css-loader'] },
        //     { manifest: 'app-entry' }
        // )
    ],
    // source-map方式でないと、CSSの元ソースが追跡できないため
    devtool: "source-map"
}