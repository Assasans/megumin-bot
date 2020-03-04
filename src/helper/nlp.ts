import { NlpManager } from 'node-nlp';

import { Message, Client, User, GuildMember, TextChannel, Guild } from 'discord.js';

import * as Bluebird from 'bluebird';
import * as chalk from 'chalk';
import * as _ from 'lodash';

import { Entity, Intent, Reply, ReplyArgument } from './models';

import Logger from './logger';
import { App } from '../app';

export class NLP {
	private static readonly filename: string = 'model.nlp';

	public manager: NlpManager;

	constructor() {
		this.manager = new NlpManager({
			languages: [
				'ru'
			],
			nlu: { 
				useNoneFeature: false
			}
		});

		this.load();
		//this.init();
		//this.train();
	}

	public addDocument(text: string, intent: string) {
		this.manager.addDocument('ru', text, intent);
	}

	public init(): void {
		this.manager.addDocument('ru', 'Ты тут?', 'action.ping.youhere');
		this.manager.addDocument('ru', 'Ты где?', 'action.ping');

		this.manager.addDocument('ru', 'Пинг', 'action.ping.value');
		this.manager.addDocument('ru', 'Какой пинг?', 'action.ping.value');
		this.manager.addDocument('ru', 'Какой у тебя пинг?', 'action.ping.value');
		this.manager.addDocument('ru', 'Какой твой пинг?', 'action.ping.value');
		this.manager.addDocument('ru', 'Сколько пинг?', 'action.ping.value');
		this.manager.addDocument('ru', 'Сколько у тебя пинг?', 'action.ping.value');
		this.manager.addDocument('ru', 'Сколько у пинг у тебя?', 'action.ping.value');
		this.manager.addDocument('ru', 'Скажи пинг', 'action.ping.value');
		this.manager.addDocument('ru', 'Скажи свой пинг', 'action.ping.value');
		this.manager.addDocument('ru', 'Напиши пинг', 'action.ping.value');
		this.manager.addDocument('ru', 'Напиши свой пинг', 'action.ping.value');

		this.manager.addDocument('ru', 'Ку', 'greetings.hello');
		this.manager.addDocument('ru', 'Привет', 'greetings.hello');

		this.manager.addDocument('ru', 'Доброе утро', 'greetings.hello.morning');
		this.manager.addDocument('ru', 'Добрый день', 'greetings.hello.afternoon');
		this.manager.addDocument('ru', 'Добрый вечер', 'greetings.hello.evening');

		this.manager.addDocument('ru', 'Кто ты?', 'questions.whoyou');
		this.manager.addDocument('ru', 'Кто ты такая?', 'questions.whoyou');
		this.manager.addDocument('ru', 'Расскажи, кто ты?', 'questions.whoyou');
		this.manager.addDocument('ru', 'Расскажи про себя', 'questions.whoyou');
		this.manager.addDocument('ru', 'Расскажи что-то про себя', 'questions.whoyou');

		this.manager.addDocument('ru', 'Кто твои родители?', 'questions.yourparents');

		this.manager.addDocument('ru', 'Пока', 'greetings.goodbye');
		this.manager.addDocument('ru', 'Я спать', 'greetings.goodbye');
		this.manager.addDocument('ru', 'До свидания', 'greetings.goodbye');
		this.manager.addDocument('ru', 'До завтра', 'greetings.goodbye.tomorrow');
		this.manager.addDocument('ru', 'Спокойной ночи', 'greetings.goodbye.goodnight');

		this.manager.addDocument('ru', 'Как тебя звать?', 'questions.yourname');
		this.manager.addDocument('ru', 'Как тебя зовут?', 'questions.yourname');
		this.manager.addDocument('ru', 'Как тебя называть?', 'questions.yourname');
		this.manager.addDocument('ru', 'Как тебя называют?', 'questions.yourname');
		this.manager.addDocument('ru', 'Какое твое имя?', 'questions.yourname');
		this.manager.addDocument('ru', 'Скажи свое имя', 'questions.yourname');
		this.manager.addDocument('ru', 'Напиши свое имя', 'questions.yourname');

		this.manager.addDocument('ru', 'Тебе сколько?', 'questions.yourage');
		this.manager.addDocument('ru', 'Сколько тебе годиков?', 'questions.yourage');
		this.manager.addDocument('ru', 'Сколько годиков тебе?', 'questions.yourage');
		this.manager.addDocument('ru', 'Сколько годиков?', 'questions.yourage');
		this.manager.addDocument('ru', 'Сколько лет?', 'questions.yourage');
		this.manager.addDocument('ru', 'Сколько тебе?', 'questions.yourage');
		this.manager.addDocument('ru', 'Сколько тебе лет?', 'questions.yourage');
		this.manager.addDocument('ru', 'Тебе сколько лет?', 'questions.yourage');
		this.manager.addDocument('ru', 'Скажи свой возраст', 'questions.yourage');
		this.manager.addDocument('ru', 'Напиши свой возраст', 'questions.yourage');

		this.manager.addDocument('ru', 'Как у тебя дела?', 'questions.howyou');
		this.manager.addDocument('ru', 'Как дела?', 'questions.howyou');
		this.manager.addDocument('ru', 'Как делишки?', 'questions.howyou');
		this.manager.addDocument('ru', 'Как дела у тебя?', 'questions.howyou');

		this.manager.addDocument('ru', 'Кто тебя сделал?', 'questions.creator');
		this.manager.addDocument('ru', 'Кто тебя создал?', 'questions.creator');
		this.manager.addDocument('ru', 'Кто тебя написал?', 'questions.creator');
		this.manager.addDocument('ru', 'Кем ты создана?', 'questions.creator');
		this.manager.addDocument('ru', 'Кем ты была создана?', 'questions.creator');
		this.manager.addDocument('ru', 'Кем ты была сделана?', 'questions.creator');
		this.manager.addDocument('ru', 'Кем ты была написана?', 'questions.creator');

		this.manager.addDocument('ru', 'Расскажи, что ты умеешь', 'questions.actions');
		this.manager.addDocument('ru', 'Расскажи, что ты умеешь делать', 'questions.actions');
		this.manager.addDocument('ru', 'Расскажи, что ты умеешь делать выполнять', 'questions.actions');
		this.manager.addDocument('ru', 'Что ты умеешь?', 'questions.actions');
		this.manager.addDocument('ru', 'Что ты умеешь делать?', 'questions.actions');
		this.manager.addDocument('ru', 'Что ты умеешь выполнять?', 'questions.actions');

		this.manager.addDocument('ru', 'С днем рождения', 'congratulations.birthday');
		this.manager.addDocument('ru', 'С ДР', 'congratulations.birthday');

		this.manager.addDocument('ru', 'С Новым Годом', 'congratulations.newyear');

		this.manager.addDocument('ru', 'Ты вообще бот или нет?', 'questions.youbot');
		this.manager.addDocument('ru', 'Ты вообще бот?', 'questions.youbot');
		this.manager.addDocument('ru', 'Ты бот или нет?', 'questions.youbot');
		this.manager.addDocument('ru', 'Ты бот?', 'questions.youbot');
		this.manager.addDocument('ru', 'А ты бот?', 'questions.youbot');
		this.manager.addDocument('ru', 'А ты бот или нет?', 'questions.youbot');

		this.manager.addDocument('ru', 'Ты вообще человек или нет?', 'questions.youperson');
		this.manager.addDocument('ru', 'Ты вообще человек?', 'questions.youperson');
		this.manager.addDocument('ru', 'Ты человек или нет?', 'questions.youperson');
		this.manager.addDocument('ru', 'Ты человек?', 'questions.youperson');
		this.manager.addDocument('ru', 'А ты человек?', 'questions.youperson');
		this.manager.addDocument('ru', 'А ты человек или нет?', 'questions.youperson');

		/*this.manager.addDocument('ru', 'Кто такая Аква?', 'character.aqua');
		this.manager.addDocument('ru', 'Кто такая Вода?', 'character.aqua');

		this.manager.addDocument('ru', 'Кто такой Казума?', 'character.kazuma');

		this.manager.addDocument('ru', 'Кто такая Даркнесс?', 'character.kazuma');

		this.manager.addDocument('ru', 'Кто такая Мегумин?', 'character.megumin');

		this.manager.addDocument('ru', 'Кто такая Комекко?', 'character.komekko');

		this.manager.addDocument('ru', 'Кто такая Юн-юн?', 'character.yunyun');
		this.manager.addDocument('ru', 'Кто такая Юнюн?', 'character.yunyun');

		this.manager.addDocument('ru', 'Кто такая Юйюй?', 'character.yuiyui');*/
	}

	public async process(text: string): Promise<any> {
		return new Bluebird(async (resolve, reject) => {
			Logger.nlp.trace(`[${chalk.greenBright('Обработка сообщения')}]: ${text}`);
			this.manager.process('ru', text).then((response: any) => {
				if(response.intent === 'None') {
					Logger.nlp.trace(`[${chalk.greenBright('Сообщение обработано')}]: Intent не найден: ${text}`);
					reject(null);
				} else {
					Logger.nlp.trace(`[${chalk.greenBright('Сообщение обработано')}]: Intent: ${response.intent}`);
				}

				resolve(response);
			});
		});
	}

	public async handleIntent(response: any, message: Message): Promise<string> {
		return new Bluebird(async (resolve, reject) => {
			const client: Client = message.client;
			const author: User = message.author;
			const content: string = message.content;
			const member: GuildMember = message.member;
	
			if(author.id === client.user.id) return;
			if(content.length < 1) return;
			if(author.bot) return;
			if(!message.guild) return;
			if(!(message.channel instanceof TextChannel)) return;
	
			const guild: Guild = message.guild;
			const channel: TextChannel = message.channel;

			if(response.intent === 'None') {
				//No intent
				return;
			}
			const intentName: string = response.intent;
			
			let entities: Array<Entity> = new Array<Entity>();
			_(response.entities).each((entry: Array<any>, key: string) => {
				if(key === 'intent') return;
				_(entry).each((entry: any, index: number) => {
					const entity: Entity = new Entity(key, entry.type, entry.value, entry.confidence);
					entities.push(entity);
				});
			});
	
			const intent: Intent = await (await App.getInstance().getMySQL()).searchIntent(intentName);
			if(!intent) {
				Logger.nlp.warn(`[${chalk.greenBright('[Обработка сообщение')}]: Intent не найден в MySQL (${chalk.blueBright(intentName)})`);

				return resolve("[ Intent not found in MySQL ]");
			}
			const repliesAll: Array<Reply> = await (await App.getInstance().getMySQL()).searchReplies(intent.id);
			const replies: Array<Reply> = repliesAll.filter((reply: Reply, index: number) => {
				//Logger.witai.trace(reply.format + ' = ' + reply.entitiesCorrect(entities));
				return reply.entitiesCorrect(entities);
			});
			if(replies.length > 0) {
				//console.log(replies);
				const reply: Reply = _(replies).sample();
				console.log(reply);
				const args: Array<ReplyArgument> = await (await App.getInstance().getMySQL()).fetchArguments();

				const response: string = reply.getText(args, {
					client: client,
					message: message,
					member: member,
					author: author,
					channel: channel,
					guild: guild
				});
	
				Logger.nlp.trace(`[${chalk.greenBright('Ответ обработан')}]: ${response}`);
	
				return resolve(response);
			}
			//TODO
			return resolve("[ N/A ]");
		});
	}

	public async train(): Promise<void> {
		await this.manager.train();
	}

	public save(): void {
		this.manager.save(NLP.filename);
	}

	public load(): void {
		this.manager.load(NLP.filename);
	}
}