import { Client } from '#lib/classes/client.js'

export async function createDiscordClient () {
	const { default: config } = await import('#configs/client.json', { assert: { type: 'json' } })

	if (Array.isArray(config.intents))
		config.intents = Client.generateIntentsBitfield(config.intents)

	const client = new Client(config)

	await client.setEventControllers()

	await client.login(process.env.DISCORD_BOT_TOKEN)

	await client.setClientCommands()
	await client.setClientMenus()
}