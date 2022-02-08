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
		const PromiseOfPings = []
		hosts.forEach(function (host) {
			PromiseOfPings.push( // ajout de l'oject Promise dans un table qui sera teste plus tard
				 ping.promise.probe(host, {
					timeout: false,
					extra: ['-c', '2']
				})
				.then(function (result) {
					console.log('Ping -c2 ' +result.inputHost)
					delete result.output;
					delete result.inputHost;
					return result // sera recupere par Promise.All()
				}.bind(this)) // bind() retoune l'objet promise
			  )
		})
		Promise.all(PromiseOfPings)
			.then(function (resultat) { // recupere tous les resultats
					// console.log("=== END ===", PromiseOfPings, resultat) 
					response.json(resultat)
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
