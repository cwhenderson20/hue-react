const Express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Webpack Requirements
const webpack = require('webpack');
const webpackConfigBuilder = require('../webpack.config');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

// Initialize Express
const app = new Express();

if (process.env.NODE_ENV !== 'production') {
	const webpackConfig = webpackConfigBuilder(process.env.NODE_ENV);
	const compiler = webpack(webpackConfig);
	
	app.use(webpackDevMiddleware(compiler, { noInfo: true, stats: { colors: true } }));
	app.use(webpackHotMiddleware(compiler));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static(path.resolve(__dirname, '../dist')));

app.listen('4001', () => console.log("Server running on port 4001"));
