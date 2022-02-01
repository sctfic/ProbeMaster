const express = require('express');
const network = require('network');
const ping = require('ping');
const axios = require('axios');

const app = express();
const port = 3001;

app.get('/', function (req, res) {
  const data = {};
  // res.send(`Express !`)
  const ippublic = network.get_public_ip(function(err, ip) {
    console.log(err || ip); // should return your public IP address
    res.send('IP Publique = '+ip);
  });
})

app.get('/network/', function (req, res) {
  network.get_interfaces_list(function(err, list) {
    console.log(err || list);
    res.send('<pre>'+JSON.stringify(list)+'</pre>');
  })
})


app.get('/ping/', function (req, res) {
  const hosts = ['imp','192.168.1.1','yahoo.com'];
  hosts.forEach(function (host) {
    ping.promise.probe(host)
        .then(function (result) {
            console.log(result);
            res.send('<pre>['+JSON.stringify(req.query)+','+JSON.stringify(result)+']</pre>');
        });
  });
})


app.get('/nasa/', function (req, res) {
  axios.all([
      axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-03'),
      axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-02')
    ]).then(axios.spread((response1, response2) => {
      console.log(response1.data.url);
      console.log(response2.data.url);
      res.send('<pre>'+JSON.stringify(response2.data)+'</pre>');
    })).catch(error => {
      console.log(error);
    });
  })


app.listen(port)