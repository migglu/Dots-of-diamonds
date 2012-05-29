
function addGameChatListener( socket ) {
	socket.on('message', function( data ) {
		var msg = data.user + ': ' + data.msg + '<br />';
		document.getElementById('game_chat').innerHTML += msg;
		scrollToBottom( document.getElementById('game_chat') );
	});
}

function emit( field )
{
	gameSocket.emit('message', {"msg":field.value});
	field.value = '';
	scrollToBottom( document.getElementById('game_chat') );
}

function scrollToBottom( field )
{
	field.scrollTop = field.scrollHeight;
}
