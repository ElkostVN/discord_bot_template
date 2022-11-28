import { BaseComponent } from '#lib/classes/base-component.js'

export default new BaseComponent({
	condition: true,
	resolver: async function (client) {
		console.log(`${client.user.tag} is ready`)
	}
})