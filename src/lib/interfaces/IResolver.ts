import { ClientEvents } from 'discord.js'

export interface IResolver<T extends keyof ClientEvents> {
    name: string
    condition: ((...args: ClientEvents[T]) => boolean)
	fn: (...args: ClientEvents[T]) => Promise<void> | void
}