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
	.get('/ping/:hosts', function (request, response) {
		const hosts = request.params.hosts.split(',');
		const reply = []
		const Prom = []
		hosts.forEach(function (host) {
			Prom.push( // ajout de l'oject Promise dans un table qui sera teste plus tard
				 ping.promise.probe(host, {
					timeout: false,
					extra: ['-c', '4']
				})
				.then(function (resp) {
					console.log(resp.inputHost)
					delete resp.output;
					delete resp.inputHost;
					reply.push(resp)
				}.bind(this))
			  )
		})
		Promise
			.all(Prom)
			.then(function () {
					console.log("=== END ===", Prom) 
					response.json(reply)
				}
			)
	})
	.use((request, response) => {
		response.status(404);
		response.json({
			error: "Page not found"
		});
	});

module.exports = router;
