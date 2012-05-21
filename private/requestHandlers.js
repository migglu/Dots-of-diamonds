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

exports.register = register;
exports.serveIndex = serveIndex;
exports.chat = chat;
exports.game = game;
