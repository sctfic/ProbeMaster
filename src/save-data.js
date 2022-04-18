const { getInfluxDBConnection } = require('./database/influx');

async function saveData(data) {

    // const sun = {
    //     elevation: sunElevationfromGPS,
    //     power: data.sun.Power,
    //     uvi: data.sun.uvIndex,
    // }
    // const wind = {
    //     speed: data.wind_speed,
    //     degrees: data.wind_deg,
    //     gust: data.wind_gust,
    // }

    const database = getInfluxDBConnection();

    await database.writePoints([
        {
            measurement: 'light',
            fields: {flux: data.light.value,},
            tags: data.light.tags
        },
        {
            measurement: 'temperature',
            fields: {temperature: data.temperature.value,},
            tags: data.temperature.tags
        },
        {
            measurement: 'pressure',
            fields: {pressure: data.pressure.value,},
            tags: data.pressure.tags
        },
        {
            measurement: 'humidity',
            fields: {humidity: data.humidity.value,},
            tags: data.humidity.tags
        },
        {
            measurement: 'CO2',
            fields: {CO2: data.CO2.value,},
            tags: data.CO2.tags
        },
        // {
        //     measurement: 'wind',
        //     fields: wind,
        //     tags: [data.wind.tags]
        // },
        // {
        //     measurement: 'precipitation',
        //     fields: {rain: data.rain.value,},
        //     tags: [data.rain.tags]
        // },
        // {
        //     measurement: 'sun',
        //     fields: sun,
        //     tags: [data.sun.tags]
        // },
        {
            measurement: 'other',
            fields: {
                voltage: data.other.voltage,
                capacity: data.other.capacity,
            },
            tags: data.other.tags
        },
    ]);
}

module.exports = {
    saveData,
}
