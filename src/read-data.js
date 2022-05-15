const Influx = require('influx');
const bodyParser = require('body-parser');
const { getInfluxDBConnection } = require('./database/influx');

module.exports = function(app){
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    influx.getDatabaseNames()
        .then((db) => {
            console.log('Available measurement names : [' + db.join('], [') + ']')
        })
        .catch(error => console.log({ error }));
    influx.getMeasurements()
        .then((names) => {
                console.log('Available measurement names : [' + names.join('], [') + ']')
            })
        .catch(error => console.log({ error }));
    // influx.getSeries()
    // 	.then((series) => {
    // 		console.log("Available Series names :\n\t[" + series.join("]\n\t[") + ']')
    // 	})
    // 	.catch(error => console.log({ error }));

}

async function readData(query, request, response) {
    const database = getInfluxDBConnection();
    
    // console.log(query, request, response);

    // [CO2], [Capacity], [humidity], [light], [other], [pressure], [temperature], [voltage]

    // {
    //     "serie": "voltage",
    //     "tags": [
    //         {
    //             "name": "type",
    //             "value": "Battery"
    //         },
    //         {
    //             "name": "type",
    //             "value": "Battery"
    //         }
    //     ],
    //     "times": {
    //         "start": "2022-04-29T22:00:00.0Z",
    //         "end": "2022-05-01T22:00:00.0Z"
    //     },
    //     "precision": 0.01,
    //     "NbPoints":1000
    // }

    const f=1/query.precision;
    var queryStr = `
        select (round(mean("${Influx.escape.measurement(query.serie)}")*${f})/${f}) as "mean"
        from "${Influx.escape.measurement(query.serie)}"
        where time > ${Influx.escape.stringLit(query.times.start)} and time < ${Influx.escape.stringLit(query.times.end)}`
    query.tags.forEach(function(tag){
        var operator = 'or'
        if ((tag.operator) == 'and') {
            operator = 'and'
        }
        queryStr += `
        ${operator} ${Influx.escape.tag(tag.name)} = ${Influx.escape.stringLit(tag.value)}`
    })

    const dt1 = new Date(query.times.start);
    const dt2 = new Date(query.times.end);
    const diff = Math.abs(Math.round((dt2.getTime() - dt1.getTime()) / 1000));
    const interval = Math.round(diff / query.NbPoints);
    
    queryStr += `
        group by time(${interval}s)
        order by time
        limit ${query.NbPoints*1}`
    
    console.log(queryStr);

    database.query(queryStr)
        .then(result => response.status(200).json(result))
        .catch(error => response.status(500).json({ error }));

}

module.exports = {
    readData,
}
