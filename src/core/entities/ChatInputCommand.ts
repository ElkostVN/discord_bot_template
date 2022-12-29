import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { ICommand } from '#lib/interfaces/ICommand.js'

export class ChatInputCommand implements ICommand {
	public name: string
	public data: SlashCommandBuilder
	public guildId: string | undefined
	public interactor: (interaction: ChatInputCommandInteraction) => Promise<void>

	constructor ({ name, data, guildId, interactor }: ICommand) {
		this.name = name
		this.data = data
		this.guildId = guildId
		this.interactor = interactor
	}
}