const express = require("express");
const app = express();
// const fs = require('fs');
// const sshJS = require('./network/ssh');
// const ssh2JS = require('./network/ssh2');
app.use(express.json());

require('./routesAPI/ping')(app)
require('./routesAPI/GPIO')(app)
require('./routesAPI/interfaces')(app)
require('./routesAPI/influxDB')(app)
require('./routesUI/index')(app)

app
	// .get("/ssh/", (request, response) => {
	// 	sshJS.getTunnel()
	// })
	// .get("/ssh2/", (request, response) => {
	// 	ssh2JS.getTunnel()
	// })

	.use(function(request, response, next) {
		response.status(404);
		console.log('.use(404)',request.rawHeaders,request.url)
		// response.render('404', { url: request.url });
		response.json({ error: '404 Not found !', url: request.url  });
		return;
	  });

module.exports = app;