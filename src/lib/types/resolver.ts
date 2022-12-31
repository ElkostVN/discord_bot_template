import { ClientEvents } from 'discord.js'

export type resolver<T extends keyof ClientEvents> = { condition: ((...args: ClientEvents[T]) => boolean), fn: (...args: ClientEvents[T]) => Promise<void> | void }