const gpio = require('array-gpio');
const relays = [gpio.out(7),gpio.out(15),gpio.out(31),gpio.out(37)]
	relays[0]._index = {Relay:1, Pin:7, BCM:4,  wPi:7, query:null,succes:null, state:relays[0].state}
	relays[1]._index = {Relay:2, Pin:15, BCM:22, wPi:3, query:null,succes:null, state:relays[1].state}
	relays[2]._index = {Relay:3, Pin:31, BCM:6,  wPi:22, query:null,succes:null, state:relays[2].state}
	relays[3]._index = {Relay:4, Pin:37, BCM:26, wPi:25, query:null,succes:null, state:relays[3].state}
const axios = require('axios');
const CronJob = require('cron').CronJob;
var job = new CronJob('* * * * * *', () => {}, null, true, 'Europe/Paris'); // function() {console.log('CRON','You will see this message at the end (on stop)');}


module.exports = function(app){
	app
	.get("/API/cron/on/:time?", (request, response) => {
		let time = '';
		if(request.params.time) {time = request.params.time}
		let callbackCron = function (time) {
			let x = (new Date()).getSeconds()%16
			// console.log('/API/relay/'+(((x >> 3) & 1)*4)+','+(((x >> 2) & 1)*3)+','+(((x >> 1) & 1)*2)+','+((x & 1)*1)+'/pulse/'+time,x & 8,x & 4,x & 2,x & 1)
			axios.get('http://localhost:3001/API/relay/'+(((x >> 3) & 1)*4)+','+(((x >> 2) & 1)*3)+','+(((x >> 1) & 1)*2)+','+((x & 1)*1)+'/pulse/'+time)
		}
		job = new CronJob('* * * * * *', () => {callbackCron(time)}, null, true, 'Europe/Paris'); // function() {console.log('CRON','You will see this message at the end (on stop)');}
		job.start();
		response.json({cronJob:'enabled'});
	})
	.get("/API/cron/off", (request, response) => {
		// console.log(job._onTimeout)
		if(job){
			job.stop();
			response.json({cronJob:'stoped'})
		}
	})
	.get('/API/relay/', async function (request, response) {
		let r = []
		for(let x in relays){
			relays[x]._index.query = null
			relays[x]._index.state = relays[x].state ? 'on':'off' 
			relays[x]._index.succes = true
			r.push(relays[x]._index)
		}
		// console.log(r)
		response.json(r)
	})
	.get('/API/relay/:relays/:status/:time?', async function (request, response) {
		//https://raspberrypi.stackexchange.com/questions/66873/how-to-read-output-of-gpio-readall

		if(request.params.relays.match(/(a|A)(l|L){2}/)){request.params.relays = '1,2,3,4'}
		rlst = request.params.relays.split(',').map(x => x*1)
		// relays2change = request.params.relays.split(',')
		relays2change = relays.filter(function (element, index, array) {return rlst.includes(element._index.Relay)});
		// console.log(rlst,relays2change)
		
		let relayOn = (t) => {
			let r = []
			for(let x in relays2change){
				relays2change[x].on(t);
				relays2change[x]._index.query = 'on'
				relays2change[x]._index.state = relays2change[x].state ? 'on':'off' 
				relays2change[x]._index.succes = true
				r.push(relays2change[x]._index)
			}
			return r
		}
		let relayOff = (t) => {
			let r = []
			for(let x in relays2change){
				relays2change[x].off(t);
				relays2change[x]._index.query = 'off'
				relays2change[x]._index.state = relays2change[x].state ? 'on':'off' 
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
				relays2change[x]._index.state = relays2change[x].state ? 'on':'off' 
				relays2change[x]._index.succes = true
				r.push(relays2change[x]._index)
			}
			return r
		}
		let time = NaN
		if (request.params.time) {time = JSON.parse(request.params.time)}
		if (request.params.status == 'on') {
			// console.log(time)
			changed = relayOn(time)
		} else if(request.params.status == 'pulse') {
			if(!request.params.time){time = 900}
			// console.log(time)
			changed = relayPulse(time)
		} else {
			// console.log(time)
			changed = relayOff(time)
		}
		response.json(changed)
	})
}