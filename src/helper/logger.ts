import * as log4js from 'log4js';
import * as chalk from 'chalk';

const Logger = {
	main: log4js.getLogger("Main"),
	mysql: log4js.getLogger("MySQL"),
	api: log4js.getLogger("API"),
	web: log4js.getLogger("Web"),
	nlp: log4js.getLogger("NLP"),
	discord: log4js.getLogger("Discord")
};

export function registerLoggers() {
	log4js.configure({
		appenders: {
			console: {
				type: 'console',
				layout: {
					type: 'pattern',
					pattern: `%[[%d{hh:mm:ss}] [%p/${chalk.bold('%c')}]%]: %m`
				}
			}
		},
		categories: {
			default: {
				appenders: [
					'console'
				],
				level: 'trace'
			}
		}
	});
}

export default Logger;