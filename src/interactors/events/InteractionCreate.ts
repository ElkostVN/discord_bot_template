import { ChatInputCommandInteraction, ContextMenuCommandInteraction, Interaction } from 'discord.js'

import { resolver } from '#lib/types/resolver.js'
import { Client } from '#interactors/Client.js'
import { EventMode } from '#lib/enums/EventMode.js'
import { InteractionErrorCodes } from '#lib/enums/InteractionErrorCodes.js'
import { InteractionCreateEvent } from '#core/events/InteractionCreate.js'

export default new InteractionCreateEvent({
	name: 'interactionCreate',
	mode: EventMode.on,
	interactor: async function (interaction: Interaction): Promise<void> {
		const self = this as InteractionCreateEvent
		const client = interaction.client as Client

		if (interaction instanceof ChatInputCommandInteraction) {
			const fn = client.commands.get((interaction as ChatInputCommandInteraction).commandName)
			if (!fn) return self.sendError(interaction, InteractionErrorCodes.RESOLVER_NOT_FOUND)

			return fn(interaction)
		}

		if (interaction instanceof ContextMenuCommandInteraction) {
			const fn = client.menus.get((interaction as ContextMenuCommandInteraction).commandName)
			if (!fn) return self.sendError(interaction, InteractionErrorCodes.RESOLVER_NOT_FOUND)

			return fn(interaction)
		}

		const resolver = self.resolvers.find((v: resolver<'interactionCreate'>) => v.condition(interaction))
		if (resolver)
			return resolver.fn(interaction)

		return self.sendError(interaction, InteractionErrorCodes.RESOLVER_NOT_FOUND)
	}
})