import { Client } from 'discord.js'

import { resolver } from '#lib/types/resolver.js'
import { EventMode } from '#lib/enums/EventMode.js'
import { ReadyEvent } from '#core/events/Ready.js'

export default new ReadyEvent({
	name: 'ready',
	mode: EventMode.on,
	interactor: async function (client: Client): Promise<void> {
		const self = this as ReadyEvent

		const resolvers = self.resolvers.filter((v: resolver<'ready'>) => v.condition(client))
		await Promise.all(resolvers.map(v => v.fn(client)))
	}
})