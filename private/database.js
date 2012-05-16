var mysql = require('db-mysql');
var db = new mysql.Database({
		"hostname": "localhost",
		"user": "sasho",
		"password": "password",
		"database": "dots_of_diamonds"
	});
var statics = require('./statics');
var crypto = require('crypto');
var io = require('./socket');

function initGame(id1, id2, callback)
{
	db.connect(function (err) {
		if(err) {
			console.log('CONNECTION error: ' + err);
			return;
		}
		
		this.query()
		.update('dd_users')
		.set({'ingame': 1})
		.where('id = ? OR id = ?', [id1, id2])
		.execute(function (err, res) {
			if(err)
			{
				console.log('Initializing game error: ' + err);
				return;		
			}
		});
		
		this.query()
		.insert('dd_games', ['', id1, id2, '', new Date()])
		.execute(function (err, res) {
			if(err) {
				console.log('Game initialization error...');
				return;
			}
			callback( res.id );
		});
	});
		
}

function inGame( socket, callbackOnOk, callbackOnError ) {
	db.connect( function( error ) {
		if( error ) {
			console.log("CONNECTION error: " + error);
			return;
		}
		console.log( socket );
		this.query()
		.select( 'ingame' )
		.from( 'dd_users' )
		.where( 'id = ?', [ socket.store.data.userid ] )
		.execute( function( error, rows, cols ) {
			
			if( error ) {
				console.log( 'Game init error' );
				return;
			}
			
			if( rows.length != 1) {
				if(callbackOnError != undefined ) {
					callbackOnError( socket );
				}
				console.log( 'Unexpected error! :(' );
				return;
			}
			if( rows[0].ingame == 1) {
				if(callbackOnError != undefined ) {
					callbackOnError( socket );
					console.log( 'Already in game :(' );
				}
				return;
			}
			
			callbackOnOk( socket );
			
		});
	});
}

function resetLoggedIn()
{
	db.connect(function(error) {
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		
		this.query()
		.update('dd_users')
		.set({'loggedin': 0, 'ingame': 0})
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

function registerUser(user, mail, pass, response, request) {
	db.connect(function(error)
	{
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		this.query()
		.insert('dd_users', ['', user, mail, pass, '', 0, 0]) //FIXME: token?!
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


function addUser(user, mail, pass, response, request)
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
				registerUser(user, mail, pass, response, request);
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
				duplicateCallback(rows[0].token, rows[0].id);
			}
			var token = rows[0].id + '' + rows[0].pass + '' + new Date().toString();
			console.log(token);
			
			var hash = crypto.createHash('sha256'); //BLOCKIIIIIIIIIIIIIIING, FIX AT ALL COST!
			hash.update(token);
			token = hash.digest('hex');
			
			db.connect( {async: false}, function (error) {
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
						return;
					}
					
					socket.set('token', token, function() {
						socket.emit('login', {"token": token});
						socket.emit('ok', {'error': 0});
					});
				});
			});
		});
	});
	
}

function loginUser(token, loginFunction, socket)
{
	db.connect(function (error) {
		if (error) {
			console.log("AUTHENTICATION error: " + error);
			return;
		}
		
		this.query()
		.select('id, name')
		.from('dd_users')
		.where('token = ?', [token])
		.execute(function (error, rows, cols) { // Error: Can't execute a query without being connected ?!?!
			if(error || rows[0] == undefined)
			{
				socket.emit('ok', {'error': 'Unknown token' + token});
				console.log("TOKEN error: [CRITICAL ERROR] " + error);
				return;
			}
			loginFunction(rows[0].name, rows[0].id, token, socket);
			
			
			
		});
	});
}

exports.addUser = addUser;
exports.loginSocket = loginSocket;
exports.loginUser = loginUser;
exports.logout = logout;
exports.resetLoggedIn = resetLoggedIn;
exports.initGame = initGame;
exports.inGame = inGame;
