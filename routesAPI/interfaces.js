const network = require('network');

module.exports = function(app){
	app
	.get("/API/ip", (request, response) => {
		network.get_public_ip(function(err, ip) {
			console.log({'IPPublique' : ip,url:'http://'+ip+'/'});
			response.json({'IPPublique' : ip,url:'http://'+ip+'/'});
		})
	})
    .get("/API/interface/:name?",(request,response)=>{
        network.get_interfaces_list(
			function(err, list) {
                if (request.params.name) {
                    list = list.find(x => x.name === request.params.name)
                }
            response.json(list)
		});
	})
}