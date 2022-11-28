import { BaseEvent } from '#lib/classes/base-event.js'

class GuildMemberAddEvent extends BaseEvent {
	components = []

	constructor (options) {
		super(options)
	}
}

export default new GuildMemberAddEvent({
	name: 'guildMemberAdd',
	controller: async function (member) {
		return Promise.all(this.components.map(({ condition, resolver }) =>
			(typeof condition === 'function' && condition(member)) ||
			(typeof condition === 'boolean' && condition)
				? resolver(member)
				: null
		))
	}
})