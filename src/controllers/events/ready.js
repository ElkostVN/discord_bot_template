import { BaseEvent } from '#lib/classes/base-event'

class ReadyEvent extends BaseEvent {
	components = undefined

	constructor (options) {
		super(options)
	}
}

export default new ReadyEvent({
	name: 'ready',
	controller: async function (client) {
		if (!this.components)
			this.components = await this.importComponents('ready')

		return Promise.all(this.components.map(async ({ condition, performer }) => {
			if (
				(typeof condition === 'function' && condition(client))
				|| (typeof condition === 'boolean' && condition)
			) return performer(client)

			return null
		}))
	}
})