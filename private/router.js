var statics = require("./statics");
function route(handle, pathname, response, request)
{
	console.log("About to route request for " + pathname);

	if(typeof handle[pathname] === 'function')
	{
		handle[pathname](response, request);
	} else {
		statics.serve(response, request);
	}
}

exports.route = route;
