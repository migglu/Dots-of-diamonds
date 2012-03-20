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
}

chat.on('publicMessage', function (data) {
	var field = document.getElementById('chat');
	field.innerHTML += data.user + ': ' + data.msg + '<br />';
	field.scrollTop = field.scrollHeight;
});
