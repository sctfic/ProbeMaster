const  SSH2Promise = require('ssh2-promise');
var colors = require('colors');
const sshconfig = {
    host: 'localhost',
    username: 'pi',
    password: '}Z%@tN9Rlnx9*{he'
    // identity: '/here/is/my/key1'
}
const ssh = new SSH2Promise(sshconfig);
//Promise
ssh.connect().then(() => {
    console.log('ssh ' + (sshconfig.username.cyan)+'@'+ (sshconfig.host.green))
});
(async function(){
    const tunnel = await ssh.addTunnel({localPort:1025, remoteAddr: "imp", remotePort: 80});
    console.log(tunnel); //Local port
})();

function getTunnel(){

    //Promise
    //It will establish the socks connection, one per ssh connection, and return the port
    //It is mainly used for reverse tunneling
    ssh.getTunnel().then((result) => {
        console.log('getTunnel ',result)
    }).catch((err) => {
        console.log('err ',err)
    });
        // ssh.getSocksPort()
        //     .then(function (port) {
        //         console.log('Socket on port'+port); //Socks port
        //     }
        // );
}


module.exports = {getTunnel};