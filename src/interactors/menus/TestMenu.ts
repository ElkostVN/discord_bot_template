import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction } from 'discord.js'

import { ContextMenuCommand } from '#core/entities/ContextMenuCommand.js'

export default new ContextMenuCommand({
	name: 'best-context-command',
	data: new ContextMenuCommandBuilder()
		.setName('best-context-command')
		.setType(ApplicationCommandType.Message),
	interactor: async (interaction: ContextMenuCommandInteraction): Promise<void> => {
		console.log('hi', interaction)
	}
})