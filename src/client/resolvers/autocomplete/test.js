import { InteractionComponent } from '#lib/classes/interaction-component.js'

export default new InteractionComponent({
	customId: 'test-autocomplete',
	condition: true,
	resolver: async interaction => interaction.reply({ content: 'test' })
})