import { BaseEvent } from '#lib/classes/base-event.js'

class ReadyEvent extends BaseEvent {
	components = []

	constructor (options) {
		super(options)
	}
}

export default new ReadyEvent({
	name: 'ready',
	controller: async function (client) {
		return Promise.all(this.components.map(({ condition, resolver }) =>
			(typeof condition === 'function' && condition(client)) ||
			(typeof condition === 'boolean' && condition)
				? resolver(client)
				: null
		))
	}
})