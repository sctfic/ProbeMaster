const  SSH2Promise = require('ssh2');
var colors = require('colors');
const sshconfig = {
    host: 'localhost',
    // port: 22,
    username: 'pi',
    password: '}Z%@tN9Rlnx9*{he'
    // identity: '/here/is/my/key1'
}
const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.forwardOut('*', 8000, 'imp', 80, (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
        console.log('TCP :: CLOSED');
        conn.end();
    }).on('data', (data) => {
        console.log('TCP :: DATA: ' + data);
    }).end([
        'HEAD / HTTP/1.1',
        'User-Agent: curl/7.27.0',
        'Host: 127.0.0.1',
        'Accept: */*',
        'Connection: close',
        '',
        ''
    ].join('\r\n'));
  });
}).connect(sshconfig);


function getTunnel(){

}


module.exports = {getTunnel};