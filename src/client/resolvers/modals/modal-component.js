import { InteractionComponent } from '#lib/classes/interaction-component.js'

export default new InteractionComponent({
	customId: 'test-modal',
	condition: 'modal',
	resolver: async interaction => interaction.reply({ content: 'test' })
})