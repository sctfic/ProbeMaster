const Influx = require('influx');
const bodyParser = require('body-parser');
const { getInfluxDBConnection } = require('./database/influx');

function view(request, response) {
    // var queryStr = `DROP SERIES FROM voltage,temperature,light,humidity,other,CO2,Capacity WHERE probe='ESP32_Probe_3'`
    var queryStr = `DROP SERIES FROM pressure WHERE probe='ESP32_Probe_0'`
    // where time > '2022-04-18T14:48:36.122Z' and time < '2023-01-23T14:48:36.122Z'

    var queryStr = `select count(*)
        from "light"
        where probe = 'ESP32_Probe_01'
        limit 6`
    // var queryStr = `select *
    //     from "light"
    //     where time > '2023-01-18T14:48:36.122Z' and time < '2023-01-23T14:48:36.122Z'
    //     limit 600`
    console.log(queryStr);
    const database = getInfluxDBConnection();
    database.query(queryStr)
        .then(result => {
            response.status(200).json(result);
        })
        .catch(error => response.status(500).json({ error }));


}
function size(){
    // sudo influx_inspect report-disk -detailed /var/lib/influxdb/data/
    // sudo du -sh /var/lib/influxdb/data/*
}

function ListHomeSeries(request, response){
    var queryStr = `SHOW SERIES ON "home"`;
    console.log(queryStr);
    const database = getInfluxDBConnection();

    database.query(queryStr)
        .then(series => {
            json=series.map(str => {
                var serie = str.key.split(',');
                var name = serie.shift();
                var unit;
                switch (name) {
                    case 'CO2':
                        unit = 'ppm'; precision = 10; break;
                    case 'humidity':
                        unit = '%'; precision = 0.1; break;
                    case 'light':
                        unit = 'lm'; precision = 1; break;
                    case 'Capacity':
                        unit = '%'; precision = 0.1; break;
                    case 'pressure':
                        unit = 'Pa'; precision = 10; break;
                    case 'temperature':
                        unit = '°C'; precision = 0.1; break;
                    case 'voltage':
                        unit = 'V'; precision = 0.001; break;
                    default:
                        unit = '-'; precision = 1; break;
                }
                serie = {name:name, Unit:unit, precision:precision,NbPoints:100, tags:serie}
                console.log(serie)
                return serie;
                // {name:'voltage', Unit:'V', precision:0.001, NbPoints:miniNbPts, tags:['PowerSupply']},
                // "CO2,area=serramoune,location=indoor,probe=ESP32_Probe_0,room=livingroom,type=test"
            })
        .catch(error => console.log({ error }));
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
        select (round(mean("${Influx.escape.measurement(query.name)}")*${f})/${f}) as "mean"
        from "${Influx.escape.measurement(query.name)}"
        where time > ${Influx.escape.stringLit(query.times.start)} and time < ${Influx.escape.stringLit(query.times.end)}`
    query.tags.forEach(function(tag){
        var operator = null;
        var [name,value] = tag.split('=');
        if(name.indexOf('and ') == 0){
            name = (name.split(' ',2))[1];
            operator = 'and';
        } else if (name.indexOf('or ') == 0){
            name = (name.split(' ',2))[1];
            operator = 'or';
        }
        queryStr += `
        ${operator} ${Influx.escape.tag(name)} = ${Influx.escape.stringLit(value)}`
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
    view,
    readData,
    ListHomeSeries,
}
