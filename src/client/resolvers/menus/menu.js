import { InteractionComponent } from '#lib/classes/interaction-component.js'

export default new InteractionComponent({
	customId: 'test-menu',
	condition: true,
	resolver: async interaction => interaction.reply({ content: 'test' })
})