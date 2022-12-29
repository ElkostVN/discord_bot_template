import 'dotenv/config'

import { Client } from '#interactors/Client.js'

async function main (): Promise<void> {
	console.clear()

	await Client.initClient({ intents: 'GuildMembers' })
}

main().catch(console.error)