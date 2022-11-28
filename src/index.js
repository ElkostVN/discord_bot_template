import 'dotenv/config'

import { createDiscordClient } from '#lib/utils/create-discord-client.js'

async function main () {
	console.clear()

	await createDiscordClient()
}

main()
	.catch(console.error)