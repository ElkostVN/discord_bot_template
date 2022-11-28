import lodash from 'lodash'
import { readdir } from 'node:fs/promises'

import { BaseEvent } from '#lib/classes/base-event.js'
import { BaseComponent } from '#lib/classes/base-component.js'

class InteractionCreateEvent extends BaseEvent {
	required = [ 'name', 'controller', 'INTERACTIONS_X_HANDLERS' ]

	INTERACTIONS_X_HANDLERS = {
		MODALS: {

		},
		BUTTONS: {

		},
		MENUS: {

		},
		AUTOCOMPLETE: {

		}
	}

	ERRORS_ENUM = {
		RESOLVER_NOT_FOUND: 'RESOLVER_NOT_FOUND',
		COMMAND_RESOLVER_NOT_FOUND: 'COMMAND_RESOLVER_NOT_FOUND',
		CONTEXT_COMMAND_RESOLVER_NOT_FOUND: 'CONTEXT_COMMAND_RESOLVER_NOT_FOUND',
		CHECK_CONDITION_ERROR: 'CHECK_CONDITION_ERROR'
	}

	#ERRORS = {
		[this.ERRORS_ENUM.RESOLVER_NOT_FOUND]: {
			'ru': 'Не удалось найти функцию обработчик для данного события, обратитесь к разработчику',
			'default': 'The handler function for this event could not be found, contact the developer'
		},
		[this.ERRORS_ENUM.COMMAND_RESOLVER_NOT_FOUND]: {
			'ru': 'Не удалось найти функцию обработчик для использованной команды, обратитесь к разработчику',
			'default': 'Couldn\'t find the handler function for the command used, contact the developer'
		},
		[this.ERRORS_ENUM.CONTEXT_COMMAND_RESOLVER_NOT_FOUND]: {
			'ru': 'Не удалось найти функцию обработчик для использованной контекстной команды, обратитесь к разработчику',
			'default': 'The handler function for the context command used could not be found, contact the developer'
		},
		[this.ERRORS_ENUM.CHECK_CONDITION_ERROR]: {
			'ru': 'Вы не прошли проверку на соответствие условиям команды',
			'default': 'You haven\'t passed the verification for compliance with the conditions of the team'
		}
	}

	#FOLDERS = [ 'buttons', 'menus', 'modals', 'autocomplete' ]

	constructor (options) {
		super(options)
	}

	getError (locale, error) {
		return this.#ERRORS[error]
			? this.#ERRORS[error][locale]
				? this.#ERRORS[error][locale]
				: this.#ERRORS[error].default
			: this.#ERRORS.default
	}

	getInteractionType (interaction) {
		switch (true) {
			case interaction.isButton():
				return 'BUTTONS'
			case interaction.isSelectMenu():
				return 'MENUS'
			case interaction.isModalSubmit():
				return 'MODALS'
			case interaction.isAutocomplete():
				return 'AUTOCOMPLETE'
			default:
				return undefined
		}
	}

	checkCondition (condition, interaction) {
		return (typeof condition === 'function' && condition(interaction)) || (typeof condition === 'boolean' && condition)
	}

	async loadComponents () {
		const folderNames = this.#FOLDERS.map(v => lodash.kebabCase(v))
		const components = await Promise.all(
			folderNames
				.map(async v =>
					Promise.allSettled(
						(await readdir(`src/client/resolvers/${v}`))
							.map(f => import(`#src/client/resolvers/${v}/${f}`)
								.then(({ default: component }) => component)
							)
					)
				)
		)

		const [ buttonComponents, menuComponents, modalComponents, autocompleteComponents ] = components.map(v => {
			const [ rejectedComponents, fulfilledComponents ] = [
				v.filter(({ status, value }) => status === 'rejected' || !(value instanceof BaseComponent)),
				v.filter(({ status, value }) => status === 'fulfilled' && value instanceof BaseComponent)
			]

			rejectedComponents.forEach(({ status, _, reason }) => status === 'rejected' // eslint-disable-line
				? console.warn(`[WARN]: Failed to load component, reason: ${reason.code}, path: ${reason.message.match(/(?<=from)(.*)/, '')[0].trim()}`)
				: console.warn('[WARN]: Failed to load component, because it\'s not a BaseComponent instance')
			)

			return fulfilledComponents.map(({ _, value }) => value) // eslint-disable-line
		})

		menuComponents.forEach(({ customId, ...tail }) => this.INTERACTIONS_X_HANDLERS.MENUS[customId] = tail) // eslint-disable-line
		modalComponents.forEach(({ customId, ...tail }) => this.INTERACTIONS_X_HANDLERS.MODALS[customId] = tail) // eslint-disable-line
		buttonComponents.forEach(({ customId, ...tail }) => this.INTERACTIONS_X_HANDLERS.BUTTONS[customId] = tail) // eslint-disable-line
		autocompleteComponents.forEach(({ customId, ...tail }) => this.INTERACTIONS_X_HANDLERS.AUTOCOMPLETE[customId] = tail) // eslint-disable-line
	}

	async executeCommand (interaction) {
		return interaction.client.commands.has(interaction.commandName)
			? interaction.client.commands.get(interaction.commandName)(interaction)
			: this.sendError(interaction, { content: this.getError(interaction.locale, this.ERRORS_ENUM.COMMAND_RESOLVER_NOT_FOUND), ephemeral: true })
	}

	async executeContextMenuCommand (interaction) {
		return interaction.client.menus.has(interaction.commandName)
			? interaction.client.menus.get(interaction.commandName)(interaction)
			: this.sendError(interaction, { content: this.getError(interaction.locale, this.ERRORS_ENUM.CONTEXT_COMMAND_RESOLVER_NOT_FOUND), ephemeral: true })
	}

	async sendError (interaction, messageObject) {
		return interaction.deffered
			? interaction.editReply(messageObject)
			: interaction.reply(messageObject)
	}
}

export default new InteractionCreateEvent({
	name: 'interactionCreate',
	controller: async function (interaction) {
		if (interaction.isCommand() && !interaction.isContextMenuCommand())
			return this.executeCommand(interaction)

		if (interaction.isContextMenuCommand())
			return this.executeContextMenuCommand(interaction)

		return this.INTERACTIONS_X_HANDLERS[this.getInteractionType(interaction)]?.[interaction.customId]
			? this.checkCondition(this.INTERACTIONS_X_HANDLERS[this.getInteractionType(interaction)][interaction.customId].condition, interaction)
				? this.INTERACTIONS_X_HANDLERS[this.getInteractionType(interaction)][interaction.customId].resolver(interaction)
				: this.sendError(interaction, { content: this.getError(interaction.locale, this.ERRORS_ENUM.CHECK_CONDITION_ERROR), ephemeral: true })
			: this.sendError(interaction, { content: this.getError(interaction.locale, this.ERRORS_ENUM.RESOLVER_NOT_FOUND), ephemeral: true })
	}
})