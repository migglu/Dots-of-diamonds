var io;
var db = require('./database');
var chat = require('./chat');

function broadcast(message)
{
	io.of('/chat').emit('publicMessage', message); // TODO: custon broadcast, only to logged in users
}

function connect(server)
{
	io = require('socket.io').listen(server);
	setupLogin();
	setupChat();
}



function setupLogin()
{
	io
	.of('/login')
	.on('connection', function(socket) {
		socket.on('login', function (data) {
			var user = data.user;
			var pass = data.pass;
			console.log("User = " + user);
			console.log("Pass = " + pass);
			db.loginSocket(user, pass, socket);
		});
	});
}

function setupChat()
{
	io
	.of('/chat')
	.on('connection', function (socket) {
		socket.on('auth', function (token) {
			console.log('token.token = ' + token.token);
			
			db.getUsername(token.token, chat.setLoggedIn, socket);
			
		});
	});
}




exports.connect = connect;
exports.broadcast = broadcast;
//exports.getSocket = getSocket;
