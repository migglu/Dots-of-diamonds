var url = require("url");
var db = require("./database");
var MIN_USERNAME_LENGTH = 3;
var MAX_USERNAME_LENGTH = 20;

function checkRegisterQuery(user, mail, pass, response, request, callback)
{
	if(user === undefined || mail === undefined 
		|| pass === undefined || user.length < MIN_USERNAME_LENGTH
		|| user.length > MAX_USERNAME_LENGTH)
	{
		console.log("Trying to register falsely.. exiting!");
		return;
	}
	
	callback(user, mail, pass, response, request);
}

function checkLoginQuery(user, pass, response, request, callback)
{
	if(user === undefined || pass === undefined 
		|| user.length < MIN_USERNAME_LENGTH
		|| user.length > MAX_USERNAME_LENGTH)
	{
		console.log("Trying to login falsely.. exiting!");
		return;
	}
	console.log("Calling the database function");
	callback(user, pass, response, request);
}

function reg(response, request)
{
	if (request.method == 'GET')
	{
		var urlParts = url.parse(request.url, true);
		var user = urlParts.query["reg[user]"];
		var mail = urlParts.query["reg[mail]"];
		var pass = urlParts.query["reg[pass]"];
		console.log(urlParts.query);
		
		checkRegisterQuery(user, mail, pass, response, request, db.addUser);
	}
}

function login(response, request)
{
	if (request.method == 'GET')
	{
		var urlParts = url.parse(request.url, true);
		var user = urlParts.query["reg[user]"];
		var pass = urlParts.query["reg[pass]"];
		
		checkLoginQuery(user, pass, response, request, db.login);
	}
}

exports.register = reg;
//exports.login = login;
