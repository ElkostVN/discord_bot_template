import { Resolver } from '#core/entities/Resolver.js'

export default new Resolver<'ready'>({
	name: 'displayClientName',
	condition: () => true,
	fn (client) {
		console.log(client.user.username)
	}
})