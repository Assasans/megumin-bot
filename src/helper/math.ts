import { Decimal } from 'decimal.js';

export class MathHelper {
	public static random(min: number, max: number): number {
		return Decimal.random().mul(max).minus(min).add(1).add(min).toNumber();
	}
}