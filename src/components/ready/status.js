export default {
	condition: true,
	performer: async function (client) {
		console.log(`${client.user.tag} is ready`)
	}
}