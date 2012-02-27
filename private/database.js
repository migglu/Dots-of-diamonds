var mysql = require('db-mysql');
var statics = require('node-static'); 

function addUser(user, mail, pass)
{
	new mysql.Database({
		"hostname": "localhost",
		"user": "sasho",
		"password": "password",
		"database": "dots_of_diamonds"
	}).connect(function(error) {
		if (error) {
			return console.log("CONNECTION error: " + error);
		}
		
		this.query()
		.insert('dd_users',
			['', user, mail, pass]
		)
		.execute(function(error, result) {
			if(error)
			{
				console.log("ERROR creating user!: " + error);
				return;
			}
		});
	});
	
}

exports.addUser = addUser;
