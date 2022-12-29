import { AbstractEvent } from '#lib/abstacts/AbstractEvent.js'

export class ReadyEvent extends AbstractEvent<'ready'> {
	constructor (props: AbstractEvent<'ready'>) {
		super(props)
	}
}