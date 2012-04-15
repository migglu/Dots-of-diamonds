var io;
var db = require('./database');
var chat = require('./chat');

function broadcastLoggedIn(loggedIn) {
	io.of('/chat').emit('loggedList', loggedIn);
}

function broadcastToChat(message)
{
	//console.log(io.of('/chat'));
	io.of('/chat').volatile.emit('publicMessage', message); // TODO: custom broadcast, only to logged in users
}

function connect(server)
{
	io = require('socket.io').listen(server);
	setupLogin();
	setupChat();
}

function setupLogin()
{
	io.of('/login').on('connection', function(socket) {
		socket.on('login', function (data) {
			var user = data.user;
			var pass = data.pass;
			if(user != null && pass != null)
			{
				db.loginSocket(user, pass, socket, chat.logoutAll);
			}
		});
	});
}

function setupChat()
{
	io.of('/chat').on('connection', chat.chatAuthListener);
}




function sendGameStart(socket)
{
	socket.emit('gameStart', {});
}

function sendTurn(socket)
{
	socket.emit('turnAck', {});
}

function sendWait(socket)
{
	socket.emit('wait', {});
}

function sendGameEnd(socket)
{
	socket.emit('gameEnd', {});
}





exports.connect = connect;
exports.broadcastToChat = broadcastToChat;
exports.broadcastLoggedIn = broadcastLoggedIn;
exports.sendGameStart = sendGameStart;
exports.sendTurn = sendTurn;
exports.sendWait = sendWait;
exports.sendGameEnd = sendGameEnd;
