import { IEvent } from '#lib/interfaces/IEvent.js'
import { AbstractHandler } from '#lib/abstacts/AbstractHandler.js'

export class EventsHandler extends AbstractHandler<IEvent> {
	constructor (path = 'dist/interactors/events') {
		super(path)
	}
}