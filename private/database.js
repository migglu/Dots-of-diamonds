var mysql = require('db-mysql');
var db = new mysql.Database({
		"hostname": "localhost",
		"user": "sasho",
		"password": "password",
		"database": "dots_of_diamonds"
	});
var statics = require('./statics');
var crypto = require('crypto');

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
				db.connect(function(error)
				{
					if (error) {
						console.log("CONNECTION error: " + error);
						return;
					}
					this.query()
					.insert('dd_users', ['', user, mail, pass, '']) //FIXME: token?!
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
		});
		
		
	});
}

function login(user, pass, response, request)
{
	db.connect(function (error) {
		if (error) {
			console.log("CONNECTION error: " + error);
			return;
		}
		
		this.query()
		.select('id, pass')
		.from('dd_users')
		.where('name = ? AND pass = ?', [user, pass])
		.execute(function (error, rows, cols)
		{
			if (error) {
				console.log("QUERY error: " + error);
				return;
			}
			
			var token = rows[0].id + rows[0].pass + new Date().toString(); //unique token :)
			
			var hash = crypto.createHash('md5'); //BLOCKIIIIIIIIIIIIIIING, FIX AT ALL COST!
			hash.update(token);
			token = hash.digest('hex');
			console.log(token);
			
			db.connect(function (error) {
				if(error) {
					console.log("CONNECTION error: " + error);
					return;
				}
				
				this.query()
				.update('dd_users')
				.set({'token': token})
				.where('id = ?', [rows[0].id])
				.execute(function (error, result) {
					if(error) {
						console.log("UPDATE error: " + error);
					}
					console.log("callback made...");
					response.writeHead(200, {"Content-Type": "text/plain"});
					response.write("Logged in! :)");
					response.end();
					console.log(response);
				});
				
			});
		});
		
	});
}

exports.addUser = checkUser;
exports.login = login;
