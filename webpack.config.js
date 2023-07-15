const webpack = require("webpack");
const path = require("path");

module.exports = {
	devtool: "source-map",
	
	entry: {
		app: "./src/ts/app.ts"
	},
	
	module: {
		rules: [
			{
				loader: "ts-loader",
				exclude: /node_modules/
			}
		]
	},
	
	resolve: {
		extensions: [".ts"]
	},
	
  output: {
    path: path.resolve("./build/"),
		filename: "[name].js",
		sourceMapFilename: "[name].js.map"
	},
	
	plugins: [
		/*new webpack.LoaderOptionsPlugin({
      minimize: true
		}),
		
		new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify("production")
    }),
		
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
		})*/
  ]
};