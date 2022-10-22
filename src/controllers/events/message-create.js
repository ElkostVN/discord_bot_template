import { BaseEvent } from '#lib/classes/base-event'

class MessageCreateEvent extends BaseEvent {
	components = undefined

	constructor (options) {
		super(options)
	}
}

export default new MessageCreateEvent({
	name: 'messageCreate',
	controller: async function (client) {
		if (!this.components)
			this.components = await this.importComponents('message-create')

		return Promise.all(this.components.map(async func => func(client)))
	}
})