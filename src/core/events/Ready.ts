import { ClientEvents } from 'discord.js'

import { EventMode } from '#lib/enums/EventMode.js'
import { AbstractEvent } from '#lib/abstacts/AbstractEvent.js'
export class ReadyEvent extends AbstractEvent<'ready'> {
	constructor ({ name, mode, interactor }: { name: 'ready', mode: EventMode, interactor: (...args: ClientEvents['ready']) => Promise<void> }) {
		super({
			name, mode, interactor
		})
	}
}