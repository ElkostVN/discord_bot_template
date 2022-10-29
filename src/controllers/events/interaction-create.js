import { readdir } from 'node:fs/promises'

import { BaseEvent } from '#lib/classes/base-event'

class InteractionCreateEvent extends BaseEvent {
	components = {
		buttons: null,
		selectMenus: null,
		modals: null
	}

	handlers = {
		buttons: {},
		selectMenus: {},
		modals: {}
	}

	constructor ({ name, controller }) {
		super({ name, controller })
	}

	getHandlerByCustomId (customId, type) {
		return this.handlers[type][customId]
	}

	setHandlerByCustomId (customId, type, fn) {
		this.handlers[type][customId] = fn
	}

	getInteractionType (interaction) {
		switch (true) {
			case interaction.isButton():
				return { interactionType: 'buttons' }
			case interaction.isSelectMenu():
				return { interactionType: 'selectMenus' }
			case interaction.isModalSubmit():
				return { interactionType: 'modals' }
			default:
				return { interactionType: undefined }
		}
	}

	isComponentsLoaded () {
		return Object.keys(this.components).every(r => this.components[r] !== null)
	}

	isHandlerExists (customId, interactionType) {
		return this.components[interactionType]?.includes(customId)
	}

	isHandlerLoaded (customId, interactionType) {
		return this.handlers[interactionType][customId]
	}

	async loadComponents () {
		const components = (
			await Promise.allSettled(
				(await readdir('src/components/interactions'))
					.map(v => readdir(`src/components/interactions/${v}`))
			)
		)
			.map(r => r.status === 'fulfilled' ? r.value.map(v => v.split('.').shift()) : [])
			.reduce((acc, v, i) => ({ ...acc, [Object.keys(this.components)[i]]: v }), {})

		this.components = components
	}

	async loadHandler (customId, interactionType) {
		const alias = {
			buttons: 'buttons',
			selectMenus: 'select-menus',
			modals: 'modals'
		}

		const fn = await import(`#src/components/interactions/${alias[interactionType]}/${customId}`).then(({ default: fn }) => fn)
		return this.setHandlerByCustomId(customId, interactionType, fn)
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
}

export default new InteractionCreateEvent({
	name: 'interactionCreate',
	controller: async function (interaction) {
		if (interaction.isCommand())
			await interaction.deferReply({ content: 'Interaction is processed', ephemeral: true })
		else await interaction.deferUpdate()

		if (!this.isComponentsLoaded())
			await this.loadComponents()

		if (interaction.isCommand() && !interaction.isContextMenuCommand())
			return this.executeCommand(interaction)

		if (interaction.isContextMenuCommand())
			return this.executeContextMenuCommand(interaction)

		const { interactionType } = this.getInteractionType(interaction)
		if (!interactionType)
			return this.sendError(interaction, { content: '> The handler of the interaction couldn\'t be found', ephemeral: true })

		if (!this.isHandlerExists(interaction.customId, interactionType))
			return this.sendError(interaction, { content: '> The handler of the interaction couldn\'t be found', ephemeral: true })

		if (!this.isHandlerLoaded(interaction.customId, interactionType))
			await this.loadHandler(interaction.customId, interactionType)

		const handler = this.getHandlerByCustomId(interaction.customId, interactionType)
		if (typeof handler !== 'function')
			return this.sendError(interaction, { content: '> Unexpected error, contact technical support', ephemeral: true })

		return handler(interaction)
	}
})