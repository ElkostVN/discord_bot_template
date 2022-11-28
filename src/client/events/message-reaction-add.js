import { BaseEvent } from '#lib/classes/base-event.js'

class MessageReactionAddEvent extends BaseEvent {
	components = []

	constructor (options) {
		super(options)
	}
}

export default new MessageReactionAddEvent({
	name: 'messageReactionAdd',
	controller: async function (messageReaction, user) {
		return Promise.all(this.components.map(({ condition, resolver }) =>
			(typeof condition === 'function' && condition(messageReaction, user)) ||
			(typeof condition === 'boolean' && condition)
				? resolver(messageReaction, user)
				: null
		))
	}
})