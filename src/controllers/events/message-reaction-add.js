import { BaseEvent } from '#lib/classes/base-event'

class MessageReactionAddEvent extends BaseEvent {
	components = undefined

	constructor (options) {
		super(options)
	}
}

export default new MessageReactionAddEvent({
	name: 'messageReactionAdd',
	controller: async function (messageReaction, user) {
		if (!this.components)
			this.components = await this.importComponents('message-reaction-add')

		return Promise.all(this.components.map(async ({ condition, performer }) => {
			if (
				(typeof condition === 'function' && condition(messageReaction, user))
				|| (typeof condition === 'boolean' && condition)
			) return performer(messageReaction, user)

			return null
		}))
	}
})