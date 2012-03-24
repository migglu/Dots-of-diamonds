var mysql = require('db-mysql');
var db = new mysql.Database({
		"hostname": "localhost",
		"user": "sasho",
		"password": "password",
		"database": "dots_of_diamonds"
	});
var statics = require('./statics');
var crypto = require('crypto');


var io = require('./socket')

function resetLoggedIn()
{
	db.connect(function(error) {
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		
		this.query()
		.update('dd_users')
		.set({'loggedin': 0})
		.where('1 = 1')
		.execute(function (error, result) {
			if(error) {
				console.log("RESET error: " + error);
			}
		});
	});
}

function logout(token) {
	db.connect(function(error) {
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		
		this.query()
		.update('dd_users')
		.set({'loggedin': 0})
		.where('token = ?', [token])
		.execute(function (error, result) {
			if(error) {
				console.log("LOGOUT error: " + error);
			}
		});
		
	});
}

function register (user, mail, pass, response, request) {
	db.connect(function(error)
	{
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		this.query()
		.insert('dd_users', ['', user, mail, pass, '', 0]) //FIXME: token?!
		.execute(function(error, result) {
			if(error)
			{
				console.log("ERROR creating user: " + error);
				statics.serveFile('register_error.html', response, request);
				return;
			}
			statics.serveFile('register_success.html', response, request);
		});
	});
}


function checkUser(user, mail, pass, response, request)
{
	db.connect(function(error) {
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		
		
		this.query()
		.select('COUNT(*) AS `size`')
		.from('dd_users')
		.where('name = ? OR mail = ?', [user, mail])
		.execute(function(error, rows, cols) {
			if(error)
			{
				console.log('Query error: ' + error);
				return;
			}
			
			if(rows[0].size != 0)
			{
				statics.serveFile('register_error.html', response, request);
			} else
			{
				register(user, mail, pass, response, request);
			}
		});
		
		
	});
}

function loginSocket(user, pass, socket, duplicateCallback)
{
	db.connect(function (error) {
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		
		this.query()
		.select('id, pass, token, loggedin')
		.from('dd_users')
		.where('name = ? AND pass = ?', [user, pass])
		.execute(function (error, rows, cols)
		{
			if (error) {
				console.log("QUERY error: " + error);
				return;
			}
			if(rows[0] == undefined)
			{
				return;
			}
			
			if(rows[0].loggedin == 1)
			{
				duplicateCallback(rows[0].token);
			}
			var token = rows[0].id + '' + rows[0].pass + '' + new Date().toString();
			
			var hash = crypto.createHash('md5'); //BLOCKIIIIIIIIIIIIIIING, FIX AT ALL COST!
			hash.update(token);
			token = hash.digest('hex');
			
			db.connect(function (error) {
				if(error) {
					console.log("CONNECTION error: " + error);
					return;
				}
				
				this.query()
				.update('dd_users')
				.set({'token': token, 'loggedin': 1})
				.where('id = ?', [rows[0].id])
				.execute(function (error, result) {
					if(error) {
						console.log("UPDATE error: " + error);
					}
					console.log("callback made...");
					//response.writeHead(200, {"Content-Type": "text/plain"});
					//response.write("Logged in! :)");
					//response.end();
					//var socket = io.getSocket();
					socket.set('token', token, function() {
						socket.emit('login', {"token": token});
					});
				});
			});
		});
	});
	
}

function getUsername(token, register, socket)
{
	console.log(token);
	db.connect(function (error) {
		if (error) {
			console.log("AUTHENTICATION error: " + error);
			return;
		}
		
		this.query()
		.select('name')
		.from('dd_users')
		.where('token = ?', [token])
		.execute(function (error, rows, cols) {
			if(error || rows[0] == undefined)
			{
				console.log("TOKEN error: [CRITICAL ERROR] " + error);
				return;
			}
			
			register(rows[0].name, token, socket);
			
		});
	});
}

exports.addUser = checkUser;
exports.loginSocket = loginSocket;
exports.getUsername = getUsername;
exports.logout = logout;
exports.resetLoggedIn = resetLoggedIn;
