const Influx = require('influx');
const { getConnection } = require('../src/database/influx');
const { saveData } = require('../src/save-data');

// Connect to a single host with a full set of config details and
// a custom schema
// http://rpimaster:8086/query?u=nodejs&p=R4pYdeSgtlM94QOp&q=SHOW%20DATABASES
// http://rpimaster:8086/query?u=nodejs&p=R4pYdeSgtlM94QOp&q=SHOW%20MEASUREMENTS&db=home
// http://rpimaster:8086/query?u=nodejs&p=R4pYdeSgtlM94QOp&q=SHOW%20SERIES&db=home

// liste des tags valide
// http://rpimaster:8086/query?u=nodejs&p=R4pYdeSgtlM94QOp&q=SHOW%20TAG%20KEYS&db=home

// http://83.193.216.74:8083/


// CLI
// influx -execute 'SELECT * FROM "temperature" LIMIT 300' -database="home"
// influx -execute 'SHOW SERIES ON "home"'
// influx -execute 'SHOW MEASUREMENTS ON "home"'
// influx -execute 'SHOW TAG KEYS ON "home"'


module.exports = function(app){
app
    .post("/probe", (request, response) => {
		response.status(201);
		console.log('.post(/probe)',request.body);
		// request.body.Network.hostname
		response.json({ Status: 'Success', url: request.url, HostName: request.body.Network.hostname });
    })
    .post('/API/db/test', async function (request, response) {
		var raw = request.body;

		var data = {
			light:{
				value:raw.Probe.LUX.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					location:'indoor',
					type:'test',
					room:'livingroom',
					area:'serramoune',
				}
			},
			temperature:{
				value:raw.Probe.Temperature.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					location:'indoor',
					type:'test',
					room:'livingroom',
					area:'serramoune',
				}
			},
			pressure:{
				value:raw.Probe.Pressure.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					location:'indoor',
					type:'test',
					room:'livingroom',
					area:'serramoune',
				}
			},
			humidity:{
				value:raw.Probe.Humidity.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					location:'indoor',
					type:'test',
					room:'livingroom',
					area:'serramoune',
				}
			},
			CO2:{
				value:raw.Probe.CO2.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					location:'indoor',
					type:'test',
					room:'livingroom',
					area:'serramoune',
				}
			},
			voltageBat:{
				value:raw.Energy.Battery.Voltage.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					type:'Battery',
					room:'livingroom',
					area:'serramoune',
				}
			},
			voltagePow:{
				value:raw.Energy.PowerSupply.Voltage.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					location:'indoor',
					type:'PowerSupply',
					room:'livingroom',
					area:'serramoune',
				}
			},
			capacityBat:{
				value:raw.Energy.Battery.Capacity.Raw,
				tags: {
					probe:raw.Settings.Lan.Hostname,
					location:'indoor',
					type:'Battery',
					room:'livingroom',
					area:'serramoune',
				}
			},
			// wind:{
			// 	value:423,
			// 	tags: ['greenHouse']
			// },
			// precipitation:{
			// 	value:423,
			// 	tags: ['greenHouse']
			// },
			// sun:{
			// 	value:423,
			// 	tags: ['greenHouse']
			// },

		};
		console.log('.post(/API/db/test)',data);

		saveData(data);
    })
}





