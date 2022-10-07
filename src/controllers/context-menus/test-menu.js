import { ApplicationCommandType, ContextMenuCommandBuilder } from 'discord.js'

import { BaseCommand } from '#lib/classes/base-command'

export default new BaseCommand({
	data: new ContextMenuCommandBuilder()
		.setName('test-menu')
		.setType(ApplicationCommandType.Message),
	name: 'test-menu',
	guildId: null,
	controller: async interaction => interaction.editReply({ content: 'Context Menu Interaction' })
})