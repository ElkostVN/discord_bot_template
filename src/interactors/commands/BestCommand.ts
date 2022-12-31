import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'

import { ChatInputCommand } from '#core/entities/ChatInputCommand.js'

export default new ChatInputCommand({
	name: 'best-command',
	data: new SlashCommandBuilder()
		.setName('best-command')
		.setDescription('best-command'),
	interactor: async (interaction: ChatInputCommandInteraction): Promise<void> => {
		console.log(interaction)
	}
})