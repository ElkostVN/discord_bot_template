import { BaseEvent } from '#lib/classes/base-event'

class GuildMemberAddEvent extends BaseEvent {
	components = undefined

	constructor (options) {
		super(options)
	}
}

export default new GuildMemberAddEvent({
	name: 'guildMemberAdd',
	controller: async function (member) {
		if (!this.components)
			this.components = await this.importComponents('guild-member-add')

		return Promise.all(this.components.map(async func => func(member)))
	}
})