import { readdir } from 'fs/promises'

export class BaseEvent {
	constructor ({ name, controller }) {
		this.name = name
		this.controller = controller
	}

	async importComponents (path) {
		return Promise.all((await readdir(`src/components/${path}`)).map(r => import(`#src/components/${path}/${r}`).then(v => Object.keys(v).map(r => v[r])))).then(r => r.flat()) // eslint-disable-line
	}
}