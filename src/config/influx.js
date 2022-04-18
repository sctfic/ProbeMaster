const INFLUXDB_HOST = process.env.INFLUXDB_HOST || 'localhost';
const INFLUXDB_PORT = process.env.INFLUXDB_PORT || 8086;
const INFLUXDB_USERNAME = process.env.INFLUXDB_USERNAME || 'nodejs';
const INFLUXDB_PASSWORD = process.env.INFLUXDB_PASSWORD || 'R4pYdeSgtlM94QOp';
const INFLUXDB_DATABASE = process.env.INFLUXDB_DATABASE || 'home';

module.exports = {
    INFLUXDB_HOST,
    INFLUXDB_PORT,
    INFLUXDB_USERNAME,
    INFLUXDB_PASSWORD,
    INFLUXDB_DATABASE,
}
