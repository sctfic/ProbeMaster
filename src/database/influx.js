const { InfluxDB, FieldType } = require('influx');
const {
    INFLUXDB_HOST,
    INFLUXDB_PORT,
    INFLUXDB_USERNAME,
    INFLUXDB_PASSWORD,
    INFLUXDB_DATABASE,
} = require('../config/influx');

function getInfluxDBConnection() {

    console.log(
        "\nINFLUXDB_HOST=",INFLUXDB_HOST,
        "\nINFLUXDB_PORT=",INFLUXDB_PORT,
        "\nINFLUXDB_USERNAME=",INFLUXDB_USERNAME,
        "\nINFLUXDB_DATABASE=",INFLUXDB_DATABASE,
    )
    return new InfluxDB({
        host: INFLUXDB_HOST,
        port: INFLUXDB_PORT,
        username: INFLUXDB_USERNAME,
        password: INFLUXDB_PASSWORD,
        database: INFLUXDB_DATABASE,
        schema: [
            {
                measurement: 'light',
                fields: {
                    flux: FieldType.FLOAT,
                },
                tags: [ // liste des tags valide
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'temperature',
                fields: {
                    temperature: FieldType.FLOAT,
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'pressure',
                fields: {
                    pressure: FieldType.INTEGER,
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'other',
                fields: {
                    voltage: FieldType.FLOAT,
                    capacity: FieldType.FLOAT,
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'sun',
                fields: {
                    elevation: FieldType.FLOAT,
                    power: FieldType.FLOAT,
                    uvi: FieldType.FLOAT,
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'wind',
                fields: {
                    speed: FieldType.FLOAT, // vitesse
                    degrees: FieldType.FLOAT, // direction
                    gust: FieldType.FLOAT, // rafale
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'precipitation',
                fields: {
                    rain: FieldType.FLOAT,
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'humidity',
                fields: {
                    humidity: FieldType.FLOAT,
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
            {
                measurement: 'CO2',
                fields: {
                    CO2: FieldType.FLOAT,
                },
                tags: [
                    'probe',
                    'location',
                    'area',
                    'room',
                    'type'
                ]
            },
        ],
    });
}

module.exports = {
    getInfluxDBConnection,
}
