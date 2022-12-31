import { ClientEvents, Interaction } from 'discord.js'

import { EventMode } from '#lib/enums/EventMode.js'
import { AbstractEvent } from '#lib/abstacts/AbstractEvent.js'
import { InteractionErrorCodes } from '#lib/enums/InteractionErrorCodes.js'

export class InteractionCreateEvent extends AbstractEvent<'interactionCreate'> {
	constructor ({ name, mode, interactor }: { name: 'interactionCreate', mode: EventMode, interactor: (...args: ClientEvents['interactionCreate']) => Promise<void> }) {
		super({ name, mode, interactor })
	}

	async sendError (interaction: Interaction, code: InteractionErrorCodes): Promise<void> { // add translations manager
		console.log(console.log(interaction), code)
	}
}