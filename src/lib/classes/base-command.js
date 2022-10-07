export class BaseCommand {
	constructor ({ name, guildId, controller, data }) {
		this.data = data
		this.name = name
		this.guildId = guildId
		this.controller = controller
	}
}