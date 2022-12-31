import { ClientEvents } from 'discord.js'

import { IResolver } from '#lib/interfaces/IResolver.js'

export class Resolver<T extends keyof ClientEvents> implements IResolver<T> {
	public readonly name: string
	public readonly condition: ((...args: ClientEvents[T]) => boolean)
	public readonly fn: (...args: ClientEvents[T]) => Promise<void> | void

	constructor ({ name, condition, fn }: IResolver<T>) {
		this.name = name
		this.condition = condition
		this.fn = fn
	}
}