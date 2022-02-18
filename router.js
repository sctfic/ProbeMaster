const express = require("express");
const router = express.Router();
const network = require('network');
// const fs = require('fs');
const axios = require('axios');
// const sshJS = require('./network/ssh');
// const ssh2JS = require('./network/ssh2');
const pingJS = require('./network/ping');
const gpio = require('array-gpio');

const relays = [gpio.out(7),gpio.out(15),gpio.out(31),gpio.out(37)]
	relays[0]._index = {Relay:1, Pin:7, BCM:4,  wPi:7, query:null,succes:null, state:relays[0].state}
	relays[1]._index = {Relay:2, Pin:15, BCM:22, wPi:3, query:null,succes:null, state:relays[1].state}
	relays[2]._index = {Relay:3, Pin:31, BCM:6,  wPi:22, query:null,succes:null, state:relays[2].state}
	relays[3]._index = {Relay:4, Pin:37, BCM:26, wPi:25, query:null,succes:null, state:relays[3].state}

async function getAllPromises(Promises){
	return await Promise.all(Promises)
		.then(
			function (resultat) { return resultat }
		)
		.catch(
			error => console.log(`Error in promises ${error}`)
		)
}

router
	.get("/", (requestuest, response) => {
		const data = {};
		const ippublic = network.get_public_ip(function(err, ip) {
			console.log('IP Publique : '+err || ip); // should return your public IP address
			response.send('IP Publique = '+ip);
		})
	})
	// .get("/ssh/", (requestuest, response) => {
	// 	sshJS.getTunnel()
	// })
	// .get("/ssh2/", (requestuest, response) => {
	// 	ssh2JS.getTunnel()
	// })
	.get('/API/interface/', async function (request, response) {
		network.get_interfaces_list(
			function(err, list) {
			// console.log(list)
			response.json (list)
			// return list
		});
		// const list = await interfacesJS.getAllInterface()
        // console.log('>>>',list)
	})
	.get("/API/cron/", (requestuest, response) => {
		const CronJob = require('cron').CronJob;
		const job = new CronJob('* * * * * *', function() {
			let x = (new Date()).getSeconds()%16
			console.log('/API/relay/'+(((x >> 3) & 1)*4)+','+(((x >> 2) & 1)*3)+','+(((x >> 1) & 1)*2)+','+((x & 1)*1)+'/pulse',x & 8,x & 4,x & 2,x & 1)
			axios.get('http://localhost:3001/API/relay/'+(((x >> 3) & 1)*4)+','+(((x >> 2) & 1)*3)+','+(((x >> 1) & 1)*2)+','+((x & 1)*1)+'/pulse')
		}, null // function() {console.log('CRON','You will see this message at the end (on stop)');}
		, true, 'Europe/Paris');
		job.start();
	})
	.get('/API/relay/', async function (request, response) {
		let r = []
		for(let x in relays){
			relays[x].on();
			relays[x]._index.query = null
			relays[x]._index.state = relays[x].state ? 'On':'Off' 
			relays[x]._index.succes = null
			r.push(relays[x]._index)
		}
		console.log(r)
		response.json(r)
	})
	.get('/API/relay/:relays/:status', async function (request, response) {
		//https://raspberrypi.stackexchange.com/questions/66873/how-to-read-output-of-gpio-readall

		if(request.params.relays.match(/(a|A)(l|L){2}/)){request.params.relays = '1,2,3,4'}
		rlst = request.params.relays.split(',').map(x => x*1)
		// relays2change = request.params.relays.split(',')
		relays2change = relays.filter(function (element, index, array) {return rlst.includes(element._index.Relay)});
		// console.log(rlst,relays2change)
		
		let relayOn = () => {
			let r = []
			for(let x in relays2change){
				relays2change[x].on();
				relays2change[x]._index.query = 'on'
				relays2change[x]._index.state = relays2change[x].state ? 'On':'Off' 
				relays2change[x]._index.succes = true
				r.push(relays2change[x]._index)
			}
			return r
		}
		let relayOff = () => {
			let r = []
			for(let x in relays2change){
				relays2change[x].off();
				relays2change[x]._index.query = 'off'
				relays2change[x]._index.state = relays2change[x].state ? 'On':'Off' 
				relays2change[x]._index.succes = true
				r.push(relays2change[x]._index)
			}
			return r
		}
		let relayPulse = (t) => {
			let r = []
			for(let x in relays2change){
				relays2change[x].pulse(t)
				relays2change[x]._index.query = 'pulse'
				relays2change[x]._index.state = relays2change[x].state ? 'On':'Off' 
				relays2change[x]._index.succes = true
				r.push(relays2change[x]._index)
			}
			return r
		}
		if (request.params.status == 'on') {
			changed = relayOn()
		} else if(request.params.status == 'pulse') {
			changed = relayPulse(250)
		} else {
			changed = relayOff()
		}
		response.json(changed)
	})
    .get("/API/interface/:name",(request,response)=>{
        // interfacesJS.getInterface(request.params.name)
		axios.get('http://localhost:3001/interface/')
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
	.get('/API/ping/:hosts/:args', async function (request, response) {
		// console.log(request.params)
		const Promises = pingJS.callPing(
								pingJS.splitIP(request.params.hosts),
								request.params.args.split('+')
							)
		response.json(
			await getAllPromises(Promises)
		)
	})
	.use(function(request, response, next) {
// $ curl http://rpimaster/notfound
// $ curl http://rpimaster/notfound -H "Accept: application/json"
// $ curl http://rpimaster/notfound -H "Accept: text/plain"
		response.status(404);
		console.log(request.accepts())
		// response.render('404', { url: request.url });
		response.json({ error: '404 Not found !', url: request.url  });
		return;
	  });

module.exports = router;
