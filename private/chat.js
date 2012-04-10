var io = require('./socket');
var db = require('./database');

var loggedInByToken = {};
var loggedInById = {};
var loggedInByName = {}; //I hate you, Valyo and Bankin...


function setGlobalMessageListener(socket)
{
	
	socket.on('publicMessage', function(msg) {
		if(loggedInByToken[msg.token] === undefined)
		{
			socket.get('token', function(err, token) {
				if(!err)
				{
					socket.get('userId', function (err, id) {
						if(!err)
						{
							safeLogout(socket, token, id);
						}
					});
				}
			});
			
			console.log("UNAUTHORIZED MESSAGE : " + msg.msg);
		} else {
			socket.get('token', function (err, token) {
				socket.get('userId', function(err1, id) {
					if (msg.token != token || err || err1) {
						safeLogout(socket, token, id);
					} else {
						if(msg.msg.trim() != '')
						{
							io.broadcastToChat({"msg": msg.msg, "user": loggedInByToken[msg.token].name});
						}
					}
				});
			});
		}
	});
	
	socket.on('logout', function(msg) {
		socket.get('token', function (err, token) {
			if(err)
			{
				console.log("logout error..");
				return;
			}
			
			if(token != msg.token) {
				socket.get('userid', function (err, id) {
					if(!err) {
						logoutAll(token, id);
					}
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
				if(err) 
				{
					console.log('logout error.. ');
				}
				safeLogout(socket, token, id);
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
		} else {
			if(message.id != undefined && message.id != null && loggedInById[message.id] != undefined) {
				for(var key in loggedInById[message.id])
				{
					loggedInById[message.id][key].emit('privateMessage', { 'msg': message.msg, 
																		'user': loggedInByToken[message.token].name, 
																		'id': loggedInByToken[message.token].id });
				}
			}
		}
	});
	
}


function safeLogout(socket, token, id)
{
	var name;
	if(loggedInByToken[token] != undefined)
	{
		name = loggedInByToken[token].name;
	}
	if(socket != undefined && token != undefined && id != undefined && name != undefined)
	{
		if(loggedInByToken[token] != undefined && loggedInById[id] != undefined && loggedInByName[name] != undefined)
		{
			logout(socket, token, id, name);
		}
	}
}

function logout(socket, token, id, name) {
	var index = loggedInByName[name].indexOf(socket);
	
	delete loggedInByName[name][index];
	
	index = loggedInById[id].indexOf(socket);
	delete loggedInById[id][index];
	
	if(loggedInByName[name].length == 0)
	{
		delete loggedInByToken[token];
		delete loggedInByName[name];
		delete loggedInById[id];
		sendUserNames();
		db.logout(token);
	}
}

function logoutAll(token, id, name) {
	if(name == undefined && loggedInByToken[token] != undefined)
	{
		name = loggedInByToken[token].name;
	}
	
	delete loggedInByToken[token];
	delete loggedInByName[name];
	delete loggedInById[id];
	sendUserNames();
	db.logout(token);
}

function setLoggedIn(name, id, token, socket)
{
	loggedInByToken[token] = {'name':name, 'id': id};
	if(loggedInByName[name] == undefined)
	{
		loggedInByName[name]= new Array();
	}
	loggedInByName[name].push(socket);
	
	if(loggedInById[id] == undefined)
	{
		loggedInById[id] = new Array();
	}
	loggedInById[id].push(socket);
	
	socket.set('token', token, function() {
		socket.set('userid', id, function() {
			socket.emit('ok', {'error': 0});
			setGlobalMessageListener(socket);
			setPrivateMessageListener(socket);
		});
	});
	
	sendUserNames();
}

function sendUserNames() {
	var names = [];
	for (var key in loggedInByToken) {
		if(names.indexOf(loggedInByToken[key]) < 0)
		{
			names.push(loggedInByToken[key]);
		}
	}
	io.broadcastLoggedIn(names);
}

function chatAuthListener(socket) {
	socket.on('auth', function (token) {
		if(token.token == undefined)
		{
			socket.emit('ok', {'error': 'No token...'});
			console.log('UNDEFINED TOKEN...');
			return;
		}
		db.getUsername(token.token, setLoggedIn, socket);
	});
}

exports.setLoggedIn = setLoggedIn;
exports.logout = logout;
exports.logoutAll = logoutAll;
exports.chatAuthListener = chatAuthListener;
			
