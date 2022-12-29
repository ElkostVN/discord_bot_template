import { ClientEvents } from 'discord.js'

import { EventMode } from '#lib/enums/EventMode.js'

export interface IEvent {
    name: keyof ClientEvents
    mode: EventMode
    interactor: () => Promise<void>
}