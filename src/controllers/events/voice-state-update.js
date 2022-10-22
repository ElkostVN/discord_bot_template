import { BaseEvent } from '#lib/classes/base-event'

class VoiceStateUpdateEvent extends BaseEvent {
	components = undefined

	constructor (options) {
		super(options)
	}
}

export default new VoiceStateUpdateEvent({
	name: 'voiceStateUpdate',
	controller: async function (oldState, newState) {
		if (!this.components)
			this.components = await this.importComponents('voice-state-update')

		return Promise.all(this.components.map(async ({ condition, performer }) => {
			if (
				(typeof condition === 'function' && condition(oldState, newState))
				|| (typeof condition === 'boolean' && condition)
			) return performer(oldState, newState)

			return null
		}))
	}
})