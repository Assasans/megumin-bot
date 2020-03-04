import { Message, TextChannel } from 'discord.js';
import { Command, CommandMessage, CommandoClient } from 'discord.js-commando';

module.exports = class SayCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'say',
			group: 'util',
			memberName: 'say',
			description: 'Отправить сообщение',
			ownerOnly: true,
			guildOnly: true,
			args: [
				{
					key: 'content',
					type: 'string',
					prompt: 'Укажите сообщение'
				},
				{
					key: 'channel',
					type: 'channel',
					prompt: 'Укажите название текстового канала',
					default: (message: CommandMessage) => message.channel
				}
			]
		});
	}

	public async run(message: CommandMessage, args: {} | string | string[]): Promise<Message | Message[]> {
		const channel: TextChannel = args['channel'];
		const content: string = args['content'];

		if(message.deletable) {
			message.delete();
		}

		return channel.send(content);
	}
}