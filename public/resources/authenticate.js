var chatName = 'http://' + window.location.host + '/chat';

var chat = io.connect(chatName);

chat.on('connect', function () {
	var token = getCookie("Dots-of-Diamonds");
	if(token != undefined)
	{
		chat.emit('auth', {'token': token});
		chat.on('ok', addOkListener); 
	}
});

function addOkListener(response)
{
	if(!response.error)
	{
		if(!addedListeners) {
			addChatListeners();
		}
		if(!addedInviteListeners) {
			addGameInviteListeners();
		}
	} else {
		deleteCookie('Dots-of-Diamonds');
		window.location = '/index';
	}
	
}
