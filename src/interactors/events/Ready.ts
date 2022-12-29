import { Client } from 'discord.js'

import { ReadyEvent } from '#core/events/Ready.js'
import { EventMode } from '#lib/enums/EventMode.js'

export default new ReadyEvent({
	name: 'ready',
	mode: EventMode.on,
	interactor: async (client: Client): Promise<void> => {
		console.log(`Hello ${client.user?.username}`)
	}
})