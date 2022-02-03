const express = require("express");
const router = express.Router();
const network = require('network');
// const fs = require('fs');
const ping = require('ping');
const axios = require('axios');

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
			console.log(err || list);
			response.send('<pre>'+JSON.stringify(list)+'</pre>');
		})
	})

	.get('/ping/', async function (request, response) {
		const hosts = ['imp','192.168.1.1','google.com', 'yahoo.com'];

		for(let host of hosts){
			let res = await ping.promise.probe(host);
			console.log(res);
		}
		response.json(res)



		// const pings = [];
		// hosts.forEach(function (host) {
		// 	// WARNING: -i 2 argument may not work in other platform like window
		// 	ping.promise.probe(host, {
		// 			timeout: false,
		// 			// Below extra arguments may not work in platforms other than linux
		// 			extra: ['-i', '2'],
		// 	})
		// 	.then(function (response) {
		// 			console.log(response);
		// 			pings.push(2);
		// 	})
		// 	.done(
		// 		function (response) {
		// 			console.log(response);
		// 		}
		// 	);
		// 	pings.push(3);
		// 	response.json(pings)
		// });
	})

	.get('/nasa/', function (request, response) {
		axios.all([
				axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-03'),
				axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-02')
			]).then(axios.spread((response1, response2) => {
				console.log(response1.data.url);
				console.log(response2.data.url);
				response.json(response2.data)
				// response.send('<pre>'+JSON.stringify(response2.data)+'</pre>');
			})).catch(error => {
				console.log(error);
			});
		})

	.get('/data/', (request,response) => {
		const data = [
			{"name":"test de data!"},
			{"name": "eth0","ip_address": "192.168.1.100","mac_address": "b8:27:eb:dc:93:51","gateway_ip": "192.168.1.1","netmask": "255.255.255.128","type": "Wired"},
			{"name": "wlan0","ip_address": "192.168.1.200","mac_address": "b8:27:eb:89:c6:04","netmask": "255.255.255.128","type": "Wireless"}
		]
		response.json(data)
	})

	.use((request, response) => {
		response.status(404);
		response.json({
			error: "Page not found"
		});
	});

module.exports = router;
