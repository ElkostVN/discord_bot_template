import { BaseEvent } from '#lib/classes/base-event'

class MessageCreateEvent extends BaseEvent {
	components = undefined

	constructor (options) {
		super(options)
	}
}

export default new MessageCreateEvent({
	name: 'messageCreate',
	controller: async function (message) {
		if (!this.components)
			this.components = await this.importComponents('message-create')

		return Promise.all(this.components.map(async ({ condition, performer }) => {
			if (
				(typeof condition === 'function' && condition(message))
				|| (typeof condition === 'boolean' && condition)
			) return performer(message)

			return null
		}))
	}
})