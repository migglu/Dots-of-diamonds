var server = require("./private/server");
var router = require("./private/router");
var requestHandlers = require("./private/requestHandlers");
var statics = require("./private/statics");

var handle = {};
handle['/'] = requestHandlers.serveIndex;
handle['/index'] = requestHandlers.serveIndex;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;
handle['/register'] = requestHandlers.register;
handle['/chat'] = requestHandlers.chat;

server.start(router.route, handle);