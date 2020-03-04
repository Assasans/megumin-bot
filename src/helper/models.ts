import * as _ from 'lodash';
import * as chalk from 'chalk';

import { RowDataPacket } from 'mysql2/promise';

import Logger from './logger';

export type InfoType = 'static' | 'js';
export class InfoObject {
	public type: InfoType;
	public value: string;

	constructor(type: InfoType, value: string) {
		this.type = type;
		this.value = value;
	}

	public execute(): string {
		if(this.type !== 'js') return this.value;
		try {
			return eval(this.value);
		} catch(error) {
			Logger.nlp.warn(`[${chalk.red.bold('Eval')}] [${chalk.red('Ошибка')}]: ${error}`);
			return null;
		}
	}
}

export class Intent {
	public id: number;
	public name: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	public static createInstanceRow(row: RowDataPacket): Intent {
		return new Intent(
			row['id'],
			row['name']
		);
	}

	public static createInstance(name: string): Intent {
		return new Intent(
			null,
			name
		);
	}
}

export class Entity {
	public key: string;
	public type: string;

	public value: string;
	public confidence: number;

	constructor(key: string, type: string, value: string, confidence: number) {
		this.key = key;
		this.type = type;

		this.value = value;
		this.confidence = confidence;
	}

	public static createInstanceObject(object: any): Entity {
		return new Entity(
			object['key'],
			object['type'],

			object['value'],
			object['confidence']
		);
	}
}


export class ReplyArgument {
	public id: number;
	public key: string;
	public value: string;

	public type: ArgumentType;

	constructor(id: number, key: string, value: string, type: ArgumentType) {
		this.id = id;
		this.key = key;
		this.value = value;

		this.type = type;
	}

	public getValue(context?: any): string {
		if(this.type !== ArgumentType.JS) return this.value;
		try {
			return function(script: string) {
				return eval(script);
			}.call(context, this.value);
		} catch(error) {
			Logger.nlp.warn(`[${chalk.red.bold('Eval')}] [${chalk.red('Ошибка')}]: ${error}`);
			return null;
		}
	}

	public static createInstanceRow(row: RowDataPacket, type: ArgumentType): ReplyArgument {
		return new ReplyArgument(
			row['id'],
			row['name'],
			row['value'],

			type
		);
	}
}

export class ArgumentType {
	public static Static = new ArgumentType('static');
	public static JS = new ArgumentType('js');

	private static _values: Array<ArgumentType>;
	private name: string;
	private constructor(name: string) {
		this.name = name;

		if(!ArgumentType._values) ArgumentType._values = [];
		ArgumentType._values.push(this);
	}

	public static values(): Array<ArgumentType> {
		return ArgumentType._values;
	}

	public static get(name: string): ArgumentType {
		return _(ArgumentType.values()).find((type: ArgumentType, index: number) => {
			return type.getName().toLowerCase() === name.toLowerCase();
		});
	}

	public getName(): string {
		return this.name;
	}

	public isStatic(): boolean {
		return this.getName() === ArgumentType.Static.getName();
	}

	public jsJS(): boolean {
		return this.getName() === ArgumentType.JS.getName();
	}
}

export class Reply {
	public id: number;
	public intent: Intent;

	public format: string;
	public entities: Array<Entity>;

	constructor(id: number, intent: Intent, format: string, entities: Array<Entity>) {
		this.id = id;
		this.intent = intent;

		this.format = format;
		this.entities = entities;
	}

	public getText(args: Array<ReplyArgument>, context?: any): string {
		return this.format.replace(/{\w+}/g, (substring: string) => {
			const key: string = substring.slice(1, substring.length - 1);
			const argument: ReplyArgument = args.find((argument: ReplyArgument) => argument.key === key);

			let result: string = null;
			if(!argument) {
				result = '**__[ Произошла ошибка (отсутствует аргумент) ]__**';
			} else {
				result = argument.getValue(context);
			}

			if(result === null) {
				result = '**__[ Произошла ошибка (отсутствует результат) ]__**';
			}

			return result;
		});
	}

	public entitiesCorrect(entities: Array<Entity>): boolean {
		let corrent: boolean = true;
		_(this.entities).each((entity: Entity, index: number) => {
			//Logger.nlp.trace(`${chalk.yellowBright.bold('Check')}: ${entity.key}: ${entity.value} (${chalk.blueBright(entity.confidence)})`);
			//Logger.nlp.trace(`${chalk.yellowBright.bold('Against')}:`);
			if(!entities.find((entry: Entity) => {
				//ogger.nlp.trace(`${chalk.blueBright(entity.key)} === ${chalk.blueBright(entry.key)}: ${entry.key === entity.key ? chalk.greenBright.bold('true') : chalk.redBright.bold('false')}`);
				return entry.key === entity.key;
			})) {
				corrent = false;
			} else {
				if(!entities.find((entry: Entity) => {
					Logger.nlp.trace(`${chalk.blueBright(entity.value)} === ${chalk.blueBright(entry.value)}: ${entry.value === entity.value ? chalk.greenBright.bold('true') : chalk.redBright.bold('false')}`);
					return entry.value === entity.value;
				})) {
					corrent = false;
				}
			}
		});
		return corrent;
	}

	public static createInstanceRow(row: RowDataPacket, intent: Intent, entities: Array<Entity>): Reply {
		return new Reply(
			row['id'],
			intent,

			row['format'],
			entities
		);
	}

	public static createInstance(intent: Intent, format: string, entities: Array<Entity>): Reply {
		return new Reply(
			null,
			intent,

			format,
			entities
		);
	}
}