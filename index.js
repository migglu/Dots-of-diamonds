var server = require("./private/server");
var router = require("./private/router");
var requestHandlers = require("./private/requestHandlers");
var statics = require("./private/statics");

function reset() {
	var db = require('./private/database');
	db.resetLoggedIn();
}
reset();

var handle = {};
handle['/'] = requestHandlers.serveIndex;
handle['/index'] = requestHandlers.serveIndex;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;
handle['/register'] = requestHandlers.register;
handle['/chat'] = requestHandlers.chat;
handle['/game'] = requestHandlers.game;

server.start(router.route, handle);
