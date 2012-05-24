var io = require('./socket');
var db = require('./database');
var gameWaitingRoom = require( './pendingRoom' );

var loggedInByToken = {}; // token => { name, id }
var loggedInById = {}; // id => socket[]
var loggedInByName = {}; // name => socket[]

function setGlobalMessageListener(socket)
{
	socket.on('initGame', function(msg) {
		if(isNaN(msg.id)) {
			console.log('Initializing game error: ' + msg.id);
			return;
		}
		if(loggedInById[msg.id] != undefined)
		{
			
			for( rsocket in loggedInById[ msg.id ] ) {
				gameWaitingRoom.sendInvite( socket, loggedInById[ msg.id ][ rsocket ] );
			}
		}
		
	});
	
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
					if ((msg.token != token) || err || err1) {
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
		console.log( 'logging out:' );
		console.log( msg );
		socket.get('token', function (err, token) {
			if(err)
			{
				console.log("logout error..");
				return;
			}
			console.log( 'token = ' + token );
			console.log( 'msg.token = ' + msg.token );
			if(token == msg.token) {
				socket.get('userid', function (err, id) {
					if(!err) {
						console.log( 'token = ' + token );
						console.log( 'id = ' + id );
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
		console.log( message.msg );
		if(loggedInByToken[message.token] === undefined)
		{
			console.log("UNAUTHORIZED PRIVATE MESSAGE : " + message.msg);
		} else {
			console.log( loggedInById[message.id] );
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

exports.setLoggedIn = setLoggedIn;
exports.logout = logout;
exports.logoutAll = logoutAll;
			
