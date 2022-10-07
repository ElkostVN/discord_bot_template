import 'dotenv/config'

import { createDiscordClient } from '#lib/utils/create-discord-client'

async function main () {
	console.clear()

	await createDiscordClient()
}

await main()
	.catch(e => console.error(e))