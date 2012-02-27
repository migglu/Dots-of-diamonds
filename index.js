var server = require("./private/server");
var router = require("./private/router");
var requestHandlers = require("./private/requestHandlers");

var handle = {};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/upload'] = requestHandlers.upload;
handle['/show'] = requestHandlers.show;

server.start(router.route, handle);
