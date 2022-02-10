class Bot {

	constructor(TOKEN) {
		this.TOKEN = TOKEN;
		this.URL = `https://api.telegram.org/bot${TOKEN}/`
		this.messageTypes = {}
	}

	start () {
		setInterval(async () => {
			let newMessage = await getUpdates()
			if(newMessage) {
				newMessage.message?.from.id ? this.saveUser(newMessage.message.from.id):this.saveUser(newMessage.callback_query.from.id)
				// console.log(newMessage)
				if(newMessage.message?.text) {
					return this.messageTypes['text'](newMessage.message)
				}

				if(newMessage?.message?.voice) {
					return this.messageTypes['voice'](newMessage.message)
				}
				if(newMessage?.callback_query) {
					console.log("callback_query")
					return this.messageTypes['callback_query'](newMessage.callback_query)
				}
				else{
					await this.sendMessage(newMessage.message.chat.id, "Men bunday narsani qabul qilmayman!")
				}
			}
		}, 500)
	}

	on(message, callback) {
		this.messageTypes[message] = callback
	}
	async sendPhoto(form){
		return await fetch(this.URL + 'sendPhoto', {
			method: 'POST',
			headers: {
				// 'Content-Type': 'application/json'
			},
			body: form
		})
	}

	async editMessageCaption(params){
		return await fetch(this.URL + 'editMessageCaption', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		})
	}
	async sendMessage (chatId, text, params) {
		return await fetch(this.URL + 'sendMessage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: chatId,
				text,
				...params
			})
		})
	}


	async sendMessageAdmin (chatId, text) {
		return await fetch(this.URL + 'sendMessage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				chat_id: chatId,
				text,
			})
		})
	}


	saveUser = (userId) => {
		let users = window.localStorage.getItem('users')
		users = users ? JSON.parse(users) : []
		users.find(el => el==userId) || users.push(userId)
		window.localStorage.setItem('users', JSON.stringify(users))
	}

}