var io = require('./socket');
var db = require('./database');

var loggedInByToken = {};
var loggedInById = {};


//function 

function setGlobalMessageListener(socket)
{
	
	socket.on('publicMessage', function(msg) {
		
		
		if(loggedInByToken[msg.token] === undefined)
		{
			console.log("UNAUTHORIZED MESSAGE : " + msg.msg);
			socket.on('publicMessage', function() {});
		} else {
			if(msg.msg.trim() != '')
			{
				io.broadcastToChat({"msg": msg.msg, "user": loggedInByToken[msg.token].name});
			}
		}
	});
	
	socket.on('logout', function(msg) {
		socket.get('token', function (err, token) {
			if(err)
			{
				console.log("logout error..");
				return;
			}
			
			if(data == msg.token)
			{
				socket.get('userid', function (err, id) {	
					logout(token, id);
				});
			}
		});
	});
	
	socket.on('disconnect', function() {
		socket.get('token', function (err, token) {
			if(err) {
				console.log("logout error..");
				return;
			}
			
			socket.get('userid', function (err, id) {	
				logout(token, id);
			});
		});
	});
}

function setPrivateMessageListener(socket)
{
	socket.on('privateMessage', function (message) {
		if(loggedInByToken[message.token] === undefined)
		{
			console.log("UNAUTHORIZED PRIVATE MESSAGE : " + message.msg);
			socket.on('privateMessage', function() {});
		} else {
			if(message.id != undefined && message.id != null && loggedInById[message.id] != undefined) {
				loggedInById[message.id].emit('privateMessage', { 'msg': message.msg, 
																	'user': loggedInByToken[message.token].name, 
																	'id': loggedInByToken[message.token].id });
			}
		}
	});
	
}


function logout(token, id) {
	delete loggedInByToken[token];
	delete loggedInById[id];
	sendUserNames();
	db.logout(token);
}

function setLoggedIn(name, id, token, socket)
{
	loggedInByToken[token] = {'name':name, 'id': id};
	loggedInById[id] = socket;
	
	socket.set('token', token, function() {
		socket.set('userid', id, function() {
			setGlobalMessageListener(socket);
			setPrivateMessageListener(socket);
		});
	});
	
	sendUserNames();
}

function sendUserNames() {
	var key;
	var names = [];
	for (key in loggedInByToken) {
		names.push(loggedInByToken[key]);
	}
	io.broadcastLoggedIn(names);
}



exports.setLoggedIn = setLoggedIn;
exports.logout = logout;
			
