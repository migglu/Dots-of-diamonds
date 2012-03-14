var io = require('./socket');

var loggedIn = {};


//function 

function setGlobalMessage(socket)
{
	socket.on('publicMessage', function(msg) {
		socket.get('token', function (err, data) {
			console.log("socket token = " + data);
			if(err)
			{
				console.log("Not logged in...");
				return;
			}
			
			if(data == msg.token) //fixme loggedIn for?
			{
				
				io.broadcast({"msg": msg.msg, "user": loggedIn[msg.token]});
			}
		});
	});
}


function setLoggedIn(name, token, socket)
{
	loggedIn[token] = name;
	socket.set('token', token, function() {
		console.log(loggedIn);
		setGlobalMessage(socket);
		
	});
}



exports.setLoggedIn = setLoggedIn;
			