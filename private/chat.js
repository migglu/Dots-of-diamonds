var io = require('./socket');
var db = require('./database');

var loggedIn = {};


//function 

function setGlobalMessageListener(socket)
{
	socket.on('publicMessage', function(msg) {
		//~ socket.get('token', function (err, data) {
			//~ console.log("socket token = " + data);
			//~ if(err)
			//~ {
				//~ console.log("Not logged in...");
				//~ return;
			//~ }
			//~ console.log("AAAAAAAAAAAAAAA");
			//~ console.log(loggedIn);
			//~ console.log("AAAAAAAAAAAAAAA");
			//~ if(data == msg.token) //fixme loggedIn for?
			//~ {
				//~ if(loggedIn[msg.token] === undefined)
				//~ {
					//~ socket.on('publicMessage', null);
				//~ } else {
					if(loggedIn[msg.token] === undefined)
					{
						console.log("UNAUTHORIZED MESSAGE : " + msg.msg);
						socket.on('publicMessage', function() {});
					} else {
						io.broadcastToChat({"msg": msg.msg, "user": loggedIn[msg.token]});
					}
				//~ }
			//~ }
		//~ });
	});
	
	socket.on('logout', function(msg) {
		socket.get('token', function (err, data) {
			if(err)
			{
				console.log("logout error..");
				return;
			}
			
			if(data == msg.token)
			{
				logout(data);
			}
		});
	});
	
	socket.on('disconnect', function() {
		socket.get('token', function (err, data) {
			if(err) {
				console.log("logout error..");
				return;
			}
			logout(data);
		});
	});
}


function logout(token) {
	delete loggedIn[token];
	sendUserNames();
	db.logout(token);
}

function setLoggedIn(name, token, socket)
{
	loggedIn[token] = name;
	socket.set('token', token, function() {
		console.log(loggedIn);
		setGlobalMessageListener(socket);
	});
	sendUserNames();
}

function sendUserNames() {
	var key;
	var names = [];
	for (key in loggedIn) {
		names.push(loggedIn[key]);
	}
	io.broadcastLoggedIn(names);
}



exports.setLoggedIn = setLoggedIn;
exports.logout = logout;
			
