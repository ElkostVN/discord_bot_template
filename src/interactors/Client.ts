import { ApplicationCommand, ClientOptions, Collection, Client as DiscordClient } from 'discord.js'

import { IMenu } from '#src/lib/interfaces/IMenu.js'
import { IEvent } from '#lib/interfaces/IEvent.js'
import { IClient } from '#lib/interfaces/IClient.js'
import { ICommand } from '#lib/interfaces/ICommand.js'
import { MenusHandler } from '#core/entities/MenusHandler.js'
import { EventsHandler } from '#core/entities/EventsHandler.js'
import { CommandsHandler } from '#core/entities/CommandsHandler.js'

export class Client extends DiscordClient<true> implements IClient {
	private readonly _token: string
	private readonly _menusHandler: MenusHandler = new MenusHandler()
	private readonly _eventsHandler: EventsHandler = new EventsHandler()
	private readonly _commandsHandler: CommandsHandler = new CommandsHandler()

	public commands = new Collection<string, ICommand['interactor']>
	public menus = new Collection<string, IMenu['interactor']>

	constructor (props: ClientOptions, token: string) {
		super(props)
		this._token = token
	}

	public async checkFolders (): Promise<true> {
		await Promise.all([ this._menusHandler, this._eventsHandler, this._commandsHandler ].map(v => v.createFolderIfNotExists()))
		return true
	}

	public async authorize (): Promise<void> {
		await super.login(this._token)
	}

	public async initializeEventInteractors (): Promise<void> {
		const events: IEvent[] = await this._eventsHandler.importFiles()
		// @ts-ignore
		events.forEach((v: IEvent): this => this[v.mode](v.name, (...args) => v.interactor(...args).catch(console.error)))
	}

	public async initializeCommandInteractors (): Promise<void> {
		const commands: ICommand[] = await this._commandsHandler.importFiles()
		await Promise.all(commands.map((v: ICommand): Promise<ApplicationCommand> => {
			this.commands.set(v.name, v.interactor)
			return this.application.commands.create(v.data.toJSON(), v.guildId)
		}))
	}

	public async initializeMenuInteractors (): Promise<void> {
		const menus: IMenu[] = await this._menusHandler.importFiles()
		await Promise.all(menus.map((v: IMenu): Promise<ApplicationCommand> => {
			this.menus.set(v.name, v.interactor)
			return this.application.commands.create(v.data.toJSON(), v.guildId)
		}))
	}

	static async initClient (props: ClientOptions, token: string = process.env.DISCORD_BOT_TOKEN!): Promise<Client> {
		const client = new Client(props, token)

		await client.checkFolders()
		await client.initializeEventInteractors()

		await client.authorize()

		await client.initializeMenuInteractors()
		await client.initializeCommandInteractors()

		return client
	}
}