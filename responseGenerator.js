var fs = require('fs');

exports.send404 = funcion (response) {
	console.error("REsource not found");

	response.writeHead(404, {
		'Content-Type': 'text/plain'
	});
	response.end('Not Found');
}

exports.sendJson = function (data, response) {
	response.writeHead(200, {
		'Content-Type': 'text/plain'
	});

	response.end(JSON.stringify(data));
}

exports.send500 = function (data, response) {
	console.error(data.red);

	response.writeHead(500, {
		'Content-Type': 'text/plain'
	});
	response.end(data);
}

exports.staticFile = function (staticPath) {
	return function(data, response) {
		var readStream;

		//fix so routes to /home and /home.html both work
		data = data.replace(/^(\/home)(.html)?$/i,'$1.html');
		data = '.' + staticPath + data;

		fs.stat(data, function (error,stats) {

			if (error || stats.isDirectory()) {
				return exports.send404(response);
			}

			readStream = fs.createReadStream(data);
			return readStream.pipe(response);
		});
	}
}