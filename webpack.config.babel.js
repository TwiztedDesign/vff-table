import {join} from 'path';


const include = join(__dirname, 'src');

module.exports =  {
    entry               : './src/vff-table.js',
    output              : {
        filename        : "vff-table.js",
        path            : join(__dirname, 'dist')

    },
    devtool             : 'source-map',
    module              : {
        rules         : [
            {
                test : /\.js$/,
                use : [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'eslint-loader',
                    }],
                include
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                   }],
                include
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }],
                include
            },
            {
                test : /\.json$/,
                use : 'json-loader',
                include
            }
        ]
    }
};
