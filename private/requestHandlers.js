var querystring = require("querystring");
var fs = require("fs");
var statics = require("./statics");
var user = require("./user");

function game(response, request)
{
	statics.serveFile('/dagame.html', response, request);
}

function chat(response, request)
{
	//authentication?
	console.log("ABOUT TO SERVE chat");
	statics.serveFile('/chat.html', response, request);
}

function login(response, request)
{
	user.login(response, request);
}

function serveIndex(response, request)
{
	statics.serveFile('/index.html', response, request);
}

function register(response, request)
{
	user.register(response, request);
}

function show(response) {
	console.log("Request handler 'show' was called.");
	fs.readFile("/tmp/test.png", "binary", function (error, file)
	{
		if(error)
		{
			response.writeHead(500, {"Content-Type" : "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type" : "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
}

//exports.login = login;
exports.register = register;
exports.show = show;
exports.serveIndex = serveIndex;
exports.chat = chat;
exports.game = game;
