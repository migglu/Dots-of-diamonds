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
			
			db.loginSocket(user, pass, socket, chat.logout);
		});
	});
}

function setupChat()
{
	io.of('/chat').on('connection', function (socket) {
		socket.on('auth', function (token) {
			db.getUsername(token.token, chat.setLoggedIn, socket);
		});
	});
}




exports.connect = connect;
exports.broadcastToChat = broadcastToChat;
exports.broadcastLoggedIn = broadcastLoggedIn;
