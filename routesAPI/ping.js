const ping = require('ping');
const colors = require('colors');
async function getAllPromises(Promises){
	return await Promise.all(Promises)
		.then(
			function (resultat) { return resultat }
		)
		.catch(
			error => console.log(`Error in promises ${error}`)
		)
}
function splitIP(IPStrList) {
    return IPStrList.split(',');
}
function callPing(IPList, args) {
    const PromiseOfPings = []
    // IPList.forEach(
    IPList.map(function (host) {
        PromiseOfPings.push( // ajout de l'oject Promise dans un table qui sera teste plus tard
             ping.promise.probe(host, {
                timeout: 6,
                extra: args
            })
            .then(function (result) {
                console.log('Ping ' + (result.inputHost.green)+' '+((args.join(' ')).yellow))
                delete result.output;
                delete result.inputHost;
                return result // sera recupere par Promise.All()
            }.bind(this)) // bind() retoune l'objet promise
          )
    })
    return PromiseOfPings
}

module.exports = function(app){
	app
	.get('/API/ping/:hosts/:args?', async function (request, response) {
		if (!request.params.args) {
            request.params.args = '-c4+-i.2'
        }
		const Promises = callPing(
								splitIP(request.params.hosts),
								request.params.args.split('+')
							)
		response.json(
			await getAllPromises(Promises)
		)
	})
}





