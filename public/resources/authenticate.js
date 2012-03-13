var chat = io.connect('http://130.204.179.226:3000/chat');

chat.on('connect', function () {
	var token = getCookie("Dots-of-Diamonds");
	console.log(token);
	if(token != undefined)
	{
		chat.emit('auth', {"token": token});
	}
});