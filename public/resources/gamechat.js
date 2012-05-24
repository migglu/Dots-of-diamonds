
function addGameChatListener( socket ) {
	socket.on('message', function( data ) {
		var msg = data.user + ': ' + data.msg + '<br />';
		document.getElementById('game_chat').innerHTML += msg;
	});
}

function emit( field )
{
	gameSocket.emit('message', {"msg":field.value});
	field.value = '';
}
