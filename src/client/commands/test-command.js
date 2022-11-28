import { ActionRowBuilder, ButtonBuilder, SlashCommandBuilder } from 'discord.js'

import { BaseCommand } from '#lib/classes/base-command.js'

export default new BaseCommand({
	data: new SlashCommandBuilder()
		.setName('test-command')
		.setDescription('test command'),
	name: 'test-command',
	guildId: null,
	controller: async interaction => interaction.reply({
		content: 'test button',
		components: [
			new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setLabel('Test')
						.setCustomId('test-button')
						.setStyle('Primary')
				)
		]
	})
})