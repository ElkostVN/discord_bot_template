import { ICommand } from '#lib/interfaces/ICommand.js'
import { AbstractHandler } from '#lib/abstacts/AbstractHandler.js'

export class CommandsHandler extends AbstractHandler<ICommand> {
	constructor (path = 'dist/interactors/commands') {
		super(path)
	}
}