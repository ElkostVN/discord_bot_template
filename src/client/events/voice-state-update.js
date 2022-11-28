import { BaseEvent } from '#lib/classes/base-event.js'

class VoiceStateUpdateEvent extends BaseEvent {
	components = []

	constructor (options) {
		super(options)
	}
}

export default new VoiceStateUpdateEvent({
	name: 'voiceStateUpdate',
	controller: async function (oldState, newState) {
		return Promise.all(this.components.map(({ condition, resolver }) =>
			(typeof condition === 'function' && condition(oldState, newState)) ||
			(typeof condition === 'boolean' && condition)
				? resolver(oldState, newState)
				: null
		))
	}
})