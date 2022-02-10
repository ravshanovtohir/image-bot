async function getUpdates () {
	let message = window.localStorage.getItem('message')
	message = message ? JSON.parse(message) : undefined

	let response = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=` + message?.update_id)
	let { result } = await response.json()

	let newMessage = result.at(-1)

	if(message && message.update_id < result.at(-1).update_id) {
		window.localStorage.setItem('message', JSON.stringify(newMessage))
		return newMessage
	} else if (!message) {
		window.localStorage.setItem('message', JSON.stringify(newMessage))
		return newMessage
	}
}