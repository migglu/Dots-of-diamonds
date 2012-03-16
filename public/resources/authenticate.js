var chatName = 'http://' + window.location.host + '/chat';

var chat = io.connect(chatName);

chat.on('connect', function () {
	var token = getCookie("Dots-of-Diamonds");
	console.log(token);
	if(token != undefined)
	{
		chat.emit('auth', {"token": token});
	}
});
