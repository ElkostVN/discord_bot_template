import { join } from 'node:path'

import { BaseEvent } from '#lib/classes/base-event'

class InteractionCreateEvent extends BaseEvent {
	constructor ({ name, controller }) {
		super({ name, controller })
	}

	#componentsPath = {
		button: '#src/components/buttons',
		selectMenu: '#src/components/select-menus',
		modalSubmit: '#src/components/modals'
	}

	#handlers = {
		button: {},
		selectMenu: {},
		modalSubmit: {}
	}

	getHandlerByCustomId (customId, type) {
		return this.#handlers[type][customId]
	}

	setHandlerByCustomId (customId, type, fn) {
		this.#handlers[type][customId] = fn
	}

	getInteractionType (interaction) {
		if (interaction.isButton())
			return 'button'

		if (interaction.isSelectMenu())
			return 'selectMenu'

		if (interaction.isModalSubmit())
			return 'modalSubmit'

		return undefined
	}

	async sendError (interaction, messageObject) {
		return interaction.editReply(messageObject)
	}

	async executeCommand (interaction) {
		if (interaction.client.commands.has(interaction.commandName))
			return interaction.client.commands.get(interaction.commandName)(interaction)
		else
			return this.sendError(interaction, { content: '> The command handler couldn\'t be found', ephemeral: true })
	}

	async executeContextMenuCommand (interaction) {
		if (interaction.client.contextMenus.has(interaction.commandName))
			return interaction.client.contextMenus.get(interaction.commandName)(interaction)
		else
			return this.sendError(interaction, { content: '> The handler of the context menu command couldn\'t be found', ephemeral: true })
	}

	async interactionHandler (interaction, interactionType) {
		let handler = this.getHandlerByCustomId(interaction.customId, interactionType)
		if (handler)
			return handler(interaction)

		handler = await import(join(this.#componentsPath[interactionType], interaction.customId)).then(({ default: handlers }) => handlers)
		if (!handler)
			return this.sendError(interaction, { content: '> The handler of the interaction couldn\'t be found', ephemeral: true })

		this.setHandlerByCustomId(interaction.customId, interactionType, handler)
		return handler(interaction)
	}
}

export default new InteractionCreateEvent({
	name: 'interactionCreate',
	controller: async function (interaction) {
		await interaction.deferReply()

		if (interaction.isCommand() && !interaction.isContextMenuCommand())
			return this.executeCommand(interaction)

		if (interaction.isContextMenuCommand())
			return this.executeContextMenuCommand(interaction)

		const interactionType = this.getInteractionType(interaction)
		if (!interactionType)
			return this.sendError(interaction, { content: '> The handler of the interaction couldn\'t be found', ephemeral: true })

		return this.interactionHandler(interaction, interactionType)
	}
})