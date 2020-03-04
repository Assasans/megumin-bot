import { Message, Guild, TextChannel, GuildMember, User, MessageMentions } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';

import * as util from 'util';
import * as chalk from 'chalk';
import * as Bluebird from 'bluebird';

import { App } from '../app';
import { NLP } from '../helper/nlp';
import { MathHelper } from '../helper/math';

import Logger from '../helper/logger';

export function register(client: CommandoClient) {
	client.on('message', (message: Message) => {
		return new Bluebird(async (resolve, reject) => {
			const author: User = message.author;
			const content: string = message.content;
			const member: GuildMember = message.member;
	
			let cleanContent: string = content;
	
			if(author.id === client.user.id) return;
			if(content.length < 1) return;
			if(author.bot) return;
	
			const channel = message.channel;
	
			//if(!channel.name.startsWith('megumin')) return;
			if(content.startsWith('//')) return;
			if(content.startsWith(client.commandPrefix)) return;
	
			if(!message.isMemberMentioned(client.user) && !content.toLowerCase().includes('мегумин') && !content.toLowerCase().includes('мег')) return;
	
			await channel.startTyping();
	
			cleanContent = cleanContent.replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '');
	
			const nlp: NLP = App.getInstance().getNLP();
	
			nlp.process(cleanContent).then(async (response) => {
				if(response == null) {
					await channel.stopTyping(true);
					return resolve(message.reply('Я еще такое не умею.\n`Intent` не найден.'));
				}
	
				nlp.handleIntent(response, message).then(async (result: string) => {
					Bluebird.delay(MathHelper.random(2000, 5000)).then(async () => {
						if(App.getInstance().getConfig().nlp.intents_debug) {
							const inspectedIntents: string = util.inspect(response.classifications, {
								depth: null
							});
	
							message.reply(`Intents: \`\`\`javascript\n${inspectedIntents}\`\`\``);
						}
	
						await channel.stopTyping(true);
						return resolve(await message.reply(result));
					}).catch((error: Error) => {
						Logger.nlp.warn(error);
						return reject(error);
					});
				}).catch((error: Error) => {
					Logger.nlp.warn(error);
					return reject(error);
				});
			}).catch((error: Error) => {
				Logger.nlp.warn(error);
				return reject(error);
			});
		});
	});
}
