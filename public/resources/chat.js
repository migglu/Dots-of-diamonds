function emit(field)
{
	var token = getCookie("Dots-of-Diamonds");
	chat.emit('publicMessage', {"msg":field.value, "token": token});
	field.value = '';
}

chat.on('publicMessage', function (data) {
	var field = document.getElementById('chat');
	field.innerHTML += data.user + ': ' + data.msg + '<br />';
	field.scrollTop = field.scrollHeight;
});
