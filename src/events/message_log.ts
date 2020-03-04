import { Message, Guild, TextChannel, GuildMember, User, DMChannel, Channel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';

import Logger from '../helper/logger';

import * as chalk from 'chalk';

export function register(client: CommandoClient) {
	client.on('message', (message: Message) => {
		const author: User = message.author;
		const content: string = message.content;
		const member: GuildMember = message.member;
		const channel: Channel = message.channel;

		if(author.id === client.user.id) return;
		if(content.length < 1) return;

		if(message.guild) {
			const guild: Guild = message.guild;
			Logger.discord.trace(`[${chalk.blueBright(guild.name)}/${chalk.blueBright.bold('#' + (<TextChannel>message.channel).name)}] [${chalk.yellowBright(author.username)}#${chalk.yellow(author.discriminator)}${member ? member.nickname ? ` (${chalk.yellowBright.bold(member.nickname)})` : '' : ''}]: ${content}`);
		} else {
			if(channel instanceof DMChannel) {
				Logger.discord.trace(`[${chalk.blueBright('ЛС')}/${chalk.blueBright.bold(channel.recipient.username)}#${chalk.blueBright.bold(channel.recipient.discriminator)}] [${chalk.yellowBright(author.username)}#${chalk.yellow(author.discriminator)}${member ? member.nickname ? ` (${chalk.yellowBright.bold(member.nickname)})` : '' : ''}]: ${content}`);
			}
		}
	});
}