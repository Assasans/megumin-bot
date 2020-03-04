import * as mysql from 'mysql2/promise';
import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as JSON5 from 'json5';

import { RowDataPacket, FieldPacket, Connection, QueryError, OkPacket } from 'mysql2/promise';

import { ConfigHelper } from './config';
import { ReplyArgument, Reply, Intent, Entity, ArgumentType } from './models';

import Logger from './logger';

type ResultPacket = [RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[], FieldPacket[]];

export class MySQL {
	private config: any;
	private db: Connection;

	constructor() {
		this.config = ConfigHelper.getConfig().mysql;
	}

	public create(): Bluebird<Connection> {
		return new Bluebird((resolve, reject) => {
			mysql.createConnection({
				host: this.config.host,
				user: this.config.user,
				password: this.config.password,
				database: this.config.database
			}).then((db: Connection) => {
				this.db = db;
				resolve(db);
			}).catch((error: Error) => {
				reject(error);
			});
		});
	}

	public fetchArguments(): Bluebird<Array<ReplyArgument>> {
		if(!this.db) throw new Error('DB is not ready!');

		return new Bluebird((resolve, reject) => {
			this.db.query('SELECT * FROM args').then(([
				result
			]: ResultPacket) => {
				let args: Array<ReplyArgument> = new Array<ReplyArgument>();
				_(result).each(async (row: RowDataPacket) => {
					const type: ArgumentType = ArgumentType.get(row['type']);

					const argument = ReplyArgument.createInstanceRow(row, type);
					args.push(argument);
				});
				resolve(args);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				reject(error);
			});
		});
	}

	public searchArgument(key: string): Bluebird<ReplyArgument> {
		if(!this.db) throw new Error('DB is not ready!');

		return new Bluebird((resolve, reject) => {
			this.db.query('SELECT * FROM args WHERER BINARY name = ?', [
				key
			]).then(([
				result
			]: ResultPacket) => {
				const row: RowDataPacket = result[0];
				if(row) {
					const type: ArgumentType = ArgumentType.get(row['type']);

					const argument: ReplyArgument = ReplyArgument.createInstanceRow(row, type);
					resolve(argument)
				} else {
					resolve(null);
				}
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				reject(error);
			});
		});
	}

	public fetchReplies(): Bluebird<Array<Reply>> {
		if(!this.db) throw new Error('DB is not ready!');

		return new Bluebird((resolve, reject) => {
			this.db.query('SELECT * FROM replies').then(([
				result
			]: ResultPacket) => {
				let replies: Array<Reply> = new Array<Reply>();
				_(result).each(async (row: RowDataPacket) => {
					const intent: Intent = await this.fetchIntent(row['intent']);

					let entities: Array<Entity> = new Array<Entity>();
					_(JSON5.parse(row['entities'])).each((entry: any, index: number) => {
						const entity: Entity = Entity.createInstanceObject(entry);
						entities.push(entity);
					});

					const reply = Reply.createInstanceRow(row, intent, entities);
					replies.push(reply);
				});
				resolve(replies);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				reject(error);
			});
		});
	}

	public searchReplies(intent_id: number): Bluebird<Array<Reply>> {
		if(!this.db) throw new Error('DB is not ready!');

		return new Bluebird((resolve, reject) => {
			this.db.query('SELECT * FROM replies WHERE BINARY intent = ?', [
				intent_id
			]).then(async ([
				result
			]: ResultPacket) => {
				let replies: Array<Reply> = new Array<Reply>();
				for(const row of <RowDataPacket[]>result) {
					const intent: Intent = await this.fetchIntent(row['intent']);

					let entities: Array<Entity> = new Array<Entity>();
					_(JSON5.parse(row['entities'])).each((entry: any, index: number) => {
						const entity: Entity = Entity.createInstanceObject(entry);
						entities.push(entity);
					});

					const reply = Reply.createInstanceRow(row, intent, entities);
					replies.push(reply);
				}
				resolve(replies);
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				reject(error);
			});
		});
	}

	public fetchIntent(id: number): Bluebird<Intent> {
		if(!this.db) throw new Error('DB is not ready!');

		return new Bluebird((resolve, reject) => {
			this.db.query('SELECT * FROM intents WHERE id = ?', [
				id
			]).then(([
				result
			]: ResultPacket) => {
				const row: RowDataPacket = result[0];
				if(row) {
					const intent = Intent.createInstanceRow(row);
					resolve(intent)
				} else {
					resolve(null);
				}
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				reject(error);
			});
		});
	}

	public searchIntent(name: string): Bluebird<Intent> {
		if(!this.db) throw new Error('DB is not ready!');

		return new Bluebird((resolve, reject) => {
			this.db.query('SELECT * FROM intents WHERE BINARY name = ?', [
				name
			]).then(([
				result
			]: ResultPacket) => {
				const row: RowDataPacket = result[0];
				if(row) {
					const intent = Intent.createInstanceRow(row);
					resolve(intent)
				} else {
					resolve(null);
				}
			}).catch((error: QueryError) => {
				Logger.mysql.warn(error);
				reject(error);
			});
		});
	}
}