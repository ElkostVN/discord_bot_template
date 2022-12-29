import { IEvent } from '#lib/interfaces/IEvent.js'
import { ClientEvents } from 'discord.js'
import { EventMode } from '#lib/enums/EventMode.js'

export abstract class AbstractEvent<T extends keyof ClientEvents> implements IEvent {
	public readonly name: T
	public readonly mode: EventMode

	public interactor: (...args: ClientEvents[T]) => Promise<void>

	constructor ({ name, mode, interactor }: AbstractEvent<T>) {
		this.name = name
		this.mode = mode
		this.interactor = interactor
	}
}