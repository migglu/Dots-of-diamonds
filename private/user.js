var url = require("url");
var db = require("./database");
var statics = require('./statics');
var MIN_USERNAME_LENGTH = 3;
var MAX_USERNAME_LENGTH = 20;

function checkRegisterQuery(user, mail, pass, response, request, callback)
{
	if(user === undefined || mail === undefined 
		|| pass === undefined || user.length < MIN_USERNAME_LENGTH
		|| user.length > MAX_USERNAME_LENGTH)
	{
		console.log("Trying to register falsely.. exiting!");
		statics.serveFile('register_error.html', response, request)
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
		//TODO return somekind of errro
		return;
	}
	callback(user, pass, response, request);
}

function register(response, request)
{
	if (request.method == 'GET')
	{
		var urlParts = url.parse(request.url, true);
		var user = urlParts.query["reg[user]"];
		var mail = urlParts.query["reg[mail]"];
		var pass = urlParts.query["reg[pass]"];
		
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

exports.register = register;
