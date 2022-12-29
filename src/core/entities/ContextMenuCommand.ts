import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from 'discord.js'

import { IMenu } from '#lib/interfaces/IMenu.js'

export class ContextMenuCommand implements IMenu {
	public name: string
	public data: ContextMenuCommandBuilder
	public guildId: string | undefined
	public interactor: (interaction: ContextMenuCommandInteraction) => Promise<void>

	constructor ({ name, data, guildId, interactor }: IMenu) {
		this.name = name
		this.data = data
		this.guildId = guildId
		this.interactor = interactor
	}
}