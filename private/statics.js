var statics = require('node-static');
var files = new (statics.Server)('./public');

function serve(response, request)
{
	request.addListener('end', function() {
		console.log("About to serve static " + request.url);
		files.serve(request, response);
	});
}

function serveFile(filename, response, request)
{
	console.log("About to serve static " + filename);
	request.addListener('end', function () {
		files.serveFile(filename, 500, {}, request, response);
	});
}

exports.serve = serve;
exports.serveFile = serveFile;
