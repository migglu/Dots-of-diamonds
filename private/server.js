var http = require("http");
var url = require("url");
var io = require("./socket");

function start(route, handle) {
	function onRequest(request, response) {
		var pathname = url.parse(request.url).pathname;
		
		route(handle, pathname, response, request);
	}
	
	var server = http.createServer(onRequest);
	io.connect(server);
	
	server.listen(3000);
	
	console.log("Server has started");
}

exports.start = start;
