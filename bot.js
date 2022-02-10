bot = new Bot(TOKEN)

let btn = document.querySelector('#button')
let input = document.querySelector('#text')
// console.log(label)
// console.log(input)

async function olma (){
	btn.addEventListener('click', async(e) => {
	let users = window.localStorage.getItem("users")
	users = users ? JSON.parse(users) : []
	if(users.length === 0) return;
	for (const chatid of users) {
		console.log(chatid, input.value)
		bot.sendMessageAdmin(chatid, input.value)

	}
	input.value = null
})
}

olma()

bot.on('text', async (msg) => {
	let chatId = msg.chat.id
	// bot Start
	const home = {
		reply_markup: JSON.stringify({
		  keyboard: [
			[{text: 'Liked ❤️'}, { text: 'Disliked 💔'}]
		  ],
		  resize_keyboard: true
		})
	  }
	if (msg.text === "/start") {
		await bot.sendMessage(chatId, "Men rasm qidiradigan botman!",home).then()
	}

	// liked photos
	if (msg.text === 'Liked ❤️') {
		let liked = window.localStorage.getItem("Liked")
		liked = liked ? JSON.parse(liked) : []
		liked = liked.filter(function(item) {
			console.log(item)
			return item.chatId === chatId
		})
		if (liked.length === 0) {
			await bot.sendMessage(chatId, "You have not liked photos!").then()
		} else {
			for (let likedElement of liked) {
				let form = new FormData()
				form.append("chat_id", chatId)
				form.append("photo", likedElement.photo)
				await bot.sendPhoto(form).then()
			}
		}
		return;
	}

	// disliked photos
	if (msg.text === "Disliked 💔") {
		let disliked = window.localStorage.getItem("Disliked")
		disliked = disliked ? JSON.parse(disliked) : []
		disliked = disliked.filter(function(item) {
			return item.chatId === chatId
		})
		if (disliked.length === 0) {
			await bot.sendMessage(chatId, "You have not disliked photos!").then()
		} else {
			for (let dislikedElement of disliked) {
				let form = new FormData()
				form.append("chat_id", chatId)
				form.append("photo", dislikedElement.photo)
				await bot.sendPhoto(form).then()
			}
		}
		return;
	}
	let text = msg.text.toLowerCase().split(' ').join('+')
	if(text.includes('/')) return
	let result = await fetch(`https://pixabay.com/api/?key=25631478-dfce721a8aa233d638902ca6c&q=${text}&image_type=photo&pretty=true`)
	result = await result.json()
	if(result.hits.length === 0) {
		await bot.sendMessage(chatId, 'Hech qanday rasm tapilmadi')
		return
	}

	// send image with keyboard
	let random = Math.floor(Math.random() * result.hits.length)
	let form = new FormData()
	form.append("chat_id", chatId)
	form.append("photo", result.hits[random].largeImageURL)
	form.append("reply_markup", JSON.stringify({
		inline_keyboard: [
			[ { text: '❤️', callback_data: '1' }, { text: '💔', callback_data: '2' } ]
		]
	}))
	await bot.sendPhoto(form)

})

bot.on("callback_query",(msg) =>{
	console.log(msg.message.photo[0].file_id)
	if(msg.data === '1'){
		let liked = window.localStorage.getItem("Liked")
		liked = liked ? JSON.parse(liked) : []
		liked.push({
			chatId: msg.message.chat.id,
			photo: msg.message.photo[0].file_id
		})
		window.localStorage.setItem("Liked", JSON.stringify(liked))
		bot.editMessageCaption({chat_id: msg.message.chat.id, message_id: msg.message.message_id,caption: "Liked ❤"}).then()
	}
	else{
		let disliked = window.localStorage.getItem("Disliked")
		disliked = disliked ? JSON.parse(disliked) : []
		disliked.push({
			chatId: msg.message.chat.id,
			photo:msg.message.photo[0].file_id
		})
		window.localStorage.setItem("Disliked", JSON.stringify(disliked))
		bot.editMessageCaption({chat_id: msg.message.chat.id, message_id: msg.message.message_id,caption: "Disliked 💔"}).then()
	}

})


bot.start()