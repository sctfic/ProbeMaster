const express = require("express");
const router = express.Router();
const network = require('network');
// const fs = require('fs');
const ping = require('ping');
const axios = require('axios');
const interfacesJS = require('./network/interfaces');

router
	.get("/", (requestuest, response) => {
		const data = {};
		// response.send(`Express !`)
		const ippublic = network.get_public_ip(function(err, ip) {
			console.log(err || ip); // should return your public IP address
			response.send('IP Publique = '+ip);
		})
	})

	.get('/interfaces/', function (request, response) {
		network.get_interfaces_list(function(err, list) {
			response.json (list);
		});
	})

    .get("/interfaces/:name",(request,response)=>{
        // interfacesJS.getInterface(request.params.name)
		axios.get('http://localhost:3001/interfaces/')
			.then(function (resp) {
				// handle success
				// console.log(resp.data)
				const interface = resp.data.find(x => x.name === request.params.name)
				response.json(interface)
			})
			.catch(function (error) {
				// handle error
				console.log(error);
				response.status(404);
				response.json({
					error: "API not found"
				})
			})
			.then(function () {
				// always executed
			});

	})

	.get('/ping/:host', async function (request, response) {

		let res = await ping.promise.probe(request.params.host);
		console.log(res);
		response.json(res)
	})
	.get('/pings/', function (request, response) {

		const hosts = ['imp', 'yahoo.com','192.168.1.1','google.com'];
		hosts.forEach(function (host) {
				// WARNING: -i 2 argument may not work in other platform like window
			ping.promise.probe(host, {
				timeout: false,
				// Below extra arguments may not work in platforms other than linux
				extra: ['-i', '2'],
			})
			.then(function (resp) {
				console.log('display',resp);
				return resp
			})
			.done(
				// function (resp) {
				// 	console.log(resp);
				// }
			)
		});
	})

	
	.use((request, response) => {
		response.status(404);
		response.json({
			error: "Page not found"
		});
	});

module.exports = router;
