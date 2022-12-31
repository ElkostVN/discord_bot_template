import lodash from 'lodash'
import { readdir } from 'node:fs/promises'
import { ClientEvents, Collection } from 'discord.js'

import { IEvent } from '#lib/interfaces/IEvent.js'
import { resolver } from '#lib/types/resolver.js'
import { Resolver } from '#core/entities/Resolver.js'
import { EventMode } from '#lib/enums/EventMode.js'

export abstract class AbstractEvent<T extends keyof ClientEvents> implements IEvent {
	public readonly name: T
	public readonly mode: EventMode

	public resolvers = new Collection<string, resolver<T>>()

	public interactor: (...args: ClientEvents[T]) => Promise<void>

	constructor ({ name, mode, interactor }: { name: T, mode: EventMode, interactor: (...args: ClientEvents[T]) => Promise<void> }) {
		this.name = name
		this.mode = mode
		this.interactor = interactor
	}

	public addResolver (key: string, resolver: resolver<T>): boolean {
		this.resolvers.set(key, resolver)
		if (!this.resolvers.get(key))
			return false

		return true
	}

	public removeResolver (key: string): boolean {
		this.resolvers.delete(key)
		if (this.resolvers.get(key))
			return false

		return true
	}

	public async uploadResolvers (): Promise<void> {
		const folderName = lodash.kebabCase(this.constructor.name.replace(/Event/, ''))
		const files: string[] = await readdir(`dist/interactors/resolvers/${folderName}`).then(r => r.filter(v => v.endsWith('.js'))).catch(() => [])
		const resolvers: Resolver<T>[] = await Promise.all(files.map(v => import(`#interactors/resolvers/${folderName}/${v}`).then(v => v.default)))

		resolvers.forEach((v: Resolver<T>) => this.addResolver(v.name, { condition: v.condition, fn: v.fn }))
	}
}