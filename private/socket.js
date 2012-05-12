var io;
var db = require('./database');
var chat = require( './chat' );
var game = require( './game' );

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
	setupGame();
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

function setupChat() {
	io.of('/chat').on('connection', function(socket) {
		login(socket, chat.setLoggedIn);
	});
}

function setupGame() {
	io.of( '/game' ).on( 'connection', function( socket ) {
		login( socket, game.setLoggedIn );
	});
}

function sendSingleMessage(socket, msgName, msgContent) {
	socket.emit(msgName, msgContent);
}
	
function login(socket, callback) {
	socket.on('auth', function (token) {
		if(token.token == undefined)
		{
			socket.emit('ok', {'error': 'No token...'});
			console.log('UNDEFINED TOKEN...');
			return;
		}
		
		db.loginUser(token.token, callback, socket);
	});
}

exports.connect = connect;
exports.broadcastToChat = broadcastToChat;
exports.broadcastLoggedIn = broadcastLoggedIn;
exports.sendSingleMessage = sendSingleMessage
exports.login = login;
