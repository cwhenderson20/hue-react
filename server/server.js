import Express from 'express';
import bodyParser from 'body-parser';
import path from 'path';

// Webpack Requirements
import webpack from 'webpack';
import webpackConfigBuilder from '../webpack.config';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

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
