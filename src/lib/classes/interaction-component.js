import { BaseComponent } from '#lib/classes/base-component.js'

export class InteractionComponent extends BaseComponent {
	constructor ({ customId, ...options }) {
		super(options)
		this.customId = customId
	}
}