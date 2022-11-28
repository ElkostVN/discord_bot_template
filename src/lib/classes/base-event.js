import lodash from 'lodash'
import { readdir } from 'node:fs/promises'

import { BaseComponent } from '#lib/classes/base-component.js'

export class BaseEvent {
	required = [ 'name', 'controller', 'components' ]

	constructor ({ name, controller }) {
		this.name = name
		this.controller = controller
	}

	validateFilds () {
		return this.required.every(v => this[v])
	}

	async loadComponents () {
		if (!this.components) return

		const folderName = lodash.kebabCase(this.name)
		const components = await Promise.allSettled((await readdir(`src/client/resolvers/${folderName}`)).map(f => import(`#src/client/resolvers/${folderName}/${f}`).then(({ default: component }) => component)))

		const [ rejectedComponents, fulfilledComponents ] = [
			components.filter(({ status, value }) => status === 'rejected' || !(value instanceof BaseComponent)),
			components.filter(({ status, value }) => status === 'fulfilled' && value instanceof BaseComponent)
		]

		rejectedComponents.forEach(({ status, _, reason }) => status === 'rejected' // eslint-disable-line
			? console.warn(`[WARN]: Failed to load component, reason: ${reason.code}, path: ${reason.message.match(/(?<=from)(.*)/, '')[0].trim()}`)
			: console.warn('[WARN]: Failed to load component, because it\'s not a BaseComponent instance')
		)

		this.components = fulfilledComponents.map(({ _, value }) => value) // eslint-disable-line
	}
}