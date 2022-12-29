import { IMenu } from '#lib/interfaces/IMenu.js'
import { AbstractHandler } from '#lib/abstacts/AbstractHandler.js'

export class MenusHandler extends AbstractHandler<IMenu> {
	constructor (path = 'dist/interactors/menus') {
		super(path)
	}
}