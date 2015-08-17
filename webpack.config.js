module.exports = {
	entry: {
		app: [
			'./src/BatchTimer.js'
		],
	},
	output: {	
		path: './dist',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel' }
		]
	}
};