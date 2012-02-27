var url = require("url");
var db = require("./database");
var MAX_USERNAME_LENGTH = 3;

function reg(response, request)
{
	if (request.method == 'GET')
	{
		var urlParts = url.parse(request.url, true);
		var user = urlParts.query["reg[user]"];
		var mail = urlParts.query["reg[mail]"];
		var pass = urlParts.query["reg[pass]"];
		console.log(urlParts.query);
		if(user === undefined || mail === undefined 
			|| pass === undefined || user.length < MAX_USERNAME_LENGTH)
		{
			console.log("Trying to register falsely.. exiting!");
			return;
		}
		
		db.addUser(user, mail, pass);
	}
	
	response.writeHead(200, {"Content-Type":"text/plain"});
	response.write("got it! :)");
	response.end();
}

exports.reg = reg;
