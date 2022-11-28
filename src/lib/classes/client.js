import { access, readdir } from 'node:fs/promises'
import { Client as DiscordClient, Collection } from 'discord.js'

import { BaseEvent } from '#lib/classes/base-event.js'
import { BaseCommand } from '#lib/classes/base-command.js'

export class Client extends DiscordClient {
	constructor (params) {
		super(params)
		this.commands = new Collection()
		this.menus = new Collection()
	}

	async isFolderExists (folder) {
		return access(`src/client/${folder}`).then(() => true).catch(() => false) // eslint-disable-line
	}

	async importFiles (folder) {
		return (await Promise.all(
			(await readdir(`src/client/${folder}`))
				.map(v => import(`#src/client/${folder}/${v}`)
					.then(r => Object.keys(r).map(v => r[v])) // eslint-disable-line
				)
		)).flat()
	}

	async setEventControllers () {
		if (!await this.isFolderExists('events'))
			throw new Error('Events folder dosn\'t exist')

		return Promise.all((await this.importFiles('events'))
			.map(async v => {
				if (!(v instanceof BaseEvent))
					throw new Error(`${v.constructor.name} isn't instance of BaseEvent`)

				if (!v.validateFilds())
					throw new Error(`Required fields are missing in ${v.constructor.name}, list of required fields: [${v.required}]`)

				await v.loadComponents()

				return v.once
					? this.once(v.name, async (...args) => v.controller(...args).catch(console.error)) // eslint-disable-line
					: this.on(v.name, async (...args) => v.controller(...args).catch(console.error)) // eslint-disable-line
			}))
	}

	async setClientCommands () {
		if (!await this.isFolderExists('commands'))
			throw new Error('Commands folder dosn\'t exist')

		return Promise.all((await this.importFiles('commands'))
			.map(v => {
				if (!(v instanceof BaseCommand))
					throw new Error(`${v.constructor.name} isn't instance of BaseCommand`)

				if (!v.validateFilds())
					throw new Error(`Required fields are missing in ${v.constructor.name}, list of required fields: [${v.required}]`)

				this.commands.set(v.name, v.controller)
				return this.application.commands.create(v.data.toJSON(), v.guildId)
			}))
	}

	async setClientMenus () {
		if (!await this.isFolderExists('menus'))
			throw new Error('Menus folder dosn\'t exist')

		return Promise.all((await this.importFiles('menus'))
			.map(v => {
				if (!(v instanceof BaseCommand))
					throw new Error(`${v.constructor.name} isn't instance of BaseCommand`)

				if (!v.validateFilds())
					throw new Error(`Required fields are missing in ${v.constructor.name}, list of required fields: [${v.required}]`)

				this.menus.set(v.name, v.controller)
				return this.application.commands.create(v.data.toJSON(), v.guildId)
			}))
	}

	static defaultIntents = [
		'READY',
		'RESUMED',
		'VOICE_SERVER_UPDATE',
		'USER_UPDATE',
		'APPLICATION_COMMAND_CREATE',
		'APPLICATION_COMMAND_UPDATE',
		'APPLICATION_COMMAND_DELETE',
		'INTERACTION_CREATE'
	]

	static intents = {
		GUILDS: [ [
			'GUILD_CREATE',
			'GUILD_UPDATE',
			'GUILD_DELETE',
			'GUILD_ROLE_CREATE',
			'GUILD_ROLE_UPDATE',
			'GUILD_ROLE_DELETE',
			'CHANNEL_CREATE',
			'CHANNEL_UPDATE',
			'CHANNEL_DELETE',
			'CHANNEL_PINS_UPDATE',
			'THREAD_CREATE',
			'THREAD_UPDATE',
			'THREAD_DELETE',
			'THREAD_LIST_SYNC',
			'THREAD_MEMBER_UPDATE',
			'THREAD_MEMBERS_UPDATE',
			'STAGE_INSTANCE_CREATE',
			'STAGE_INSTANCE_UPDATE',
			'STAGE_INSTANCE_DELETE'
		], 0 ],

		GUILD_MEMBERS: [ [
			'GUILD_MEMBER_ADD',
			'GUILD_MEMBER_UPDATE',
			'GUILD_MEMBER_REMOVE',
			'THREAD_MEMBERS_UPDATE'
		], 1 ],

		GUILD_BANS: [ [
			'GUILD_BAN_ADD',
			'GUILD_BAN_REMOVE'
		], 2 ],

		GUILD_EMOJIS_AND_STICKERS: [ [
			'GUILD_EMOJIS_UPDATE',
			'GUILD_STICKERS_UPDATE'
		], 3 ],

		GUILD_INTEGRATIONS: [ [
			'GUILD_INTEGRATIONS_UPDATE',
			'INTEGRATION_CREATE',
			'INTEGRATION_UPDATE',
			'INTEGRATION_DELETE'
		], 4 ],

		GUILD_WEBHOOKS: [ [
			'WEBHOOKS_UPDATE'
		], 5 ],

		GUILD_INVITES: [ [
			'INVITE_CREATE',
			'INVITE_DELETE'
		], 6 ],

		GUILD_VOICE_STATES: [ [
			'VOICE_STATE_UPDATE'
		], 7 ],

		GUILD_PRESENCES: [ [
			'PRESENCE_UPDATE'
		], 8 ],

		GUILD_MESSAGES: [ [
			'MESSAGE_CREATE',
			'MESSAGE_UPDATE',
			'MESSAGE_DELETE',
			'MESSAGE_DELETE_BULK'
		], 9 ],

		GUILD_MESSAGE_REACTIONS: [ [
			'MESSAGE_REACTION_ADD',
			'MESSAGE_REACTION_REMOVE',
			'MESSAGE_REACTION_REMOVE_ALL',
			'MESSAGE_REACTION_REMOVE_EMOJI'
		], 10 ],

		GUILD_MESSAGE_TYPING: [ [
			'TYPING_START'
		], 11 ],

		DIRECT_MESSAGES: [ [
			'MESSAGE_CREATE',
			'MESSAGE_UPDATE',
			'MESSAGE_DELETE',
			'CHANNEL_PINS_UPDATE'
		], 12 ],

		DIRECT_MESSAGE_REACTIONS: [ [
			'MESSAGE_REACTION_ADD',
			'MESSAGE_REACTION_REMOVE',
			'MESSAGE_REACTION_REMOVE_ALL',
			'MESSAGE_REACTION_REMOVE_EMOJI'
		], 13 ],

		DIRECT_MESSAGE_TYPING: [ [
			'TYPING_START'
		], 14 ],

		MESSAGE_CONTENT: [ [], 15 ],

		GUILD_SCHEDULED_EVENTS: [ [
			'GUILD_SCHEDULED_EVENT_CREATE',
			'GUILD_SCHEDULED_EVENT_UPDATE',
			'GUILD_SCHEDULED_EVENT_DELETE',
			'GUILD_SCHEDULED_EVENT_USER_ADD',
			'GUILD_SCHEDULED_EVENT_USER_REMOVE'
		], 16 ],

		AUTO_MODERATION_CONFIGURATION: [ [
			'AUTO_MODERATION_RULE_CREATE',
			'AUTO_MODERATION_RULE_UPDATE',
			'AUTO_MODERATION_RULE_DELETE'
		], 20 ],

		AUTO_MODERATION_EXECUTION: [ [
			'AUTO_MODERATION_ACTION_EXECUTION'
		], 21 ]
	}

	static generateIntentsBitfield (intentsArray) {
		return intentsArray.reduce((acc, v) => {
			if (!this.intents[v])
				throw new Error(`${v} intent doesn't exists`)

			return 1 << this.intents[v][1]
		}, 0)
	}
}