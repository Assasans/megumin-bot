import * as Discord from 'discord.js';
import { CommandoClient, CommandGroup } from 'discord.js-commando';

import * as Bluebird from 'bluebird';
import * as fs from 'promise-fs';

import * as _ from 'underscore';
import * as path from 'path';

import { Connection } from 'mysql2/promise';

import { ConfigHelper } from './helper/config';
import { MySQL } from './helper/mysql';
import { NLP } from './helper/nlp';

import * as log4js from 'log4js';
import Logger, { registerLoggers } from './helper/logger';

registerLoggers();

export const config = ConfigHelper.getConfig();

const botConfig = config.discord.accounts['megumin'];

export const client = new CommandoClient({
	owner: config.discord.owners,
	unknownCommandResponse: false, //AI patch
	commandPrefix: botConfig.prefix
});

//require('./gui/gui');

client.registry
	.registerGroups([
		['ai', 'Команды AI'],
	])
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.login(botConfig.token).then(async (token) => {
	Logger.discord.debug(`Токен: ${token}`);

	if(client.user.bot) {
		client.generateInvite([
			Discord.Permissions.FLAGS.ADMINISTRATOR
		]).then((link) => {
			Logger.discord.info(`Ссылка для приглашения бота: ${link}`);
		}).catch((error: Error) => { //TODO DiscordAPIError?
			Logger.discord.warn(error);
		});
	}
}).catch((error: Error) => { //TODO DiscordAPIError?
	Logger.discord.warn(error);
});

client.once('ready', () => {
	Logger.discord.debug(`Вход выполнен: ${client.user.username}#${client.user.discriminator}`);

	client.user.setActivity(`Тест AI // ${client.commandPrefix}help // ${config.info.name} ${config.info.version}`, {
		type: 'PLAYING'
	});
	client.user.setStatus('online');
});

client.on('error', (error: Error) => {
	Logger.discord.warn(error);
});

fs.readdir(path.resolve(__dirname, 'events')).then((files: string[]) => {
	_(files).each((file: string, index: number) => {
		if(file.endsWith('.js')) {
			Logger.main.info(`${index}: ${file}`);

			const handler = require(path.resolve(__dirname, 'events', file));
			if('register' in handler) {
				handler.register(client);
			}
		}
	});
}).catch((error: Error) => {
	Logger.main.warn(error);
});

export class App {
	private static instance: App;
	public static getInstance(): App {
		if(!this.instance) this.instance = new App();
		return this.instance;
	}

	private config: any;
	private mysql: MySQL;
	private nlp: NLP;

	private constructor() {}

	public getConfig(): any {
		if(!this.config) this.config = ConfigHelper.getConfig();
		return this.config;
	}

	public async getMySQL(): Promise<MySQL> {
		if(!this.mysql) {
			this.mysql = new MySQL();
			await this.mysql.create();
		}
		return this.mysql;
	}

	public getNLP(): NLP {
		if(!this.nlp) this.nlp = new NLP();
		return this.nlp;
	}
}

App.getInstance().getNLP();