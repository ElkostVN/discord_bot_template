export class BaseCommand {
	required = [ 'data', 'name', 'controller' ]

	constructor ({ name, guildId, controller, data }) {
		this.data = data
		this.name = name
		this.guildId = guildId
		this.controller = controller
	}

	validateFilds () {
		return this.required.every(v => this[v])
	}
}