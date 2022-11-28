import { BaseComponent } from '#lib/classes/base-component.js'

export class InteractionComponent extends BaseComponent {
	constructor (options) {
		super(options)
		this.customId = options.customId
	}
}