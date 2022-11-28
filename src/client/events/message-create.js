import { BaseEvent } from '#lib/classes/base-event.js'

class MessageCreateEvent extends BaseEvent {
	components = []

	constructor (options) {
		super(options)
	}
}

export default new MessageCreateEvent({
	name: 'messageCreate',
	controller: async function (message) {
		return Promise.all(this.components.map(({ condition, resolver }) =>
			(typeof condition === 'function' && condition(message)) ||
			(typeof condition === 'boolean' && condition)
				? resolver(message)
				: null
		))
	}
})