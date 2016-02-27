import webpack from 'webpack';
import webpackConfigBuilder  from '../webpack.config';
import { argv as args } from 'yargs';
import 'colors';

process.env.NODE_ENV = 'production';

const webpackConfig = webpackConfigBuilder(process.env.NODE_ENV);

webpack(webpackConfig).run((err, stats) => {
	const inSilentMode = args.s;

	if (!inSilentMode) {
		console.log('Generating minified bundle for production use via Webpack...'.bold.blue);
	}

	if (err) {
		console.log(err.bold.red);
		return 1;
	}

	const jsonStats = stats.toJson();

	if (jsonStats.hasErrors) {
		return jsonStats.errors.map(error => console.log(error.red));
	}

	if (jsonStats.hasWarnings && !inSilentMode) {
		console.log('Webpack generated the follow warnings: '.bold.yellow);
		jsonStats.warnings.map(warning => console.log(warning.yellow));
	}

	if (!inSilentMode) {
		console.log(`Webpack stats: ${stats}`);
	}

	console.log('The app has been compiled in production mode and written to /dist.'.green.bold);
	return 0;
});
