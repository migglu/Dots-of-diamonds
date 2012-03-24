var token = getCookie("Dots-of-Diamonds");

function emit(field)
{
	chat.emit('publicMessage', {"msg":field.value, "token": token});
	field.value = '';
}

function logout()
{
	chat.emit('logout', {"token": token});
	window.location = '/index';
	deleteCookie("Dots-of-Diamonds");
	console.log(document.cookie);
}

function addChatListeners() {
	chat.on('publicMessage', function (data) {
		var field = document.getElementById('chat');
		field.innerHTML += data.user + ': ' + data.msg + '<br />';
		field.scrollTop = field.scrollHeight;
	});
	
	chat.on('loggedList', function(array) {
		var users = document.getElementById('users');
		users.innerHTML = '';
		var key;
		for (key in array)
		{
			users.innerHTML += array[key] + '<br />';
		}
	});
}
