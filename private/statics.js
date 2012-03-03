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
	console.log("About to serve file " + filename);
	//request.addListener('end', function () {
		files.serveFile(filename, 200, {}, request, response);
		//response.end();
	//});
}

exports.serve = serve;
exports.serveFile = serveFile;
