const path = require('path');
module.exports = function(app){
app
	.get("/", (request, response) => {
		response.sendFile(path.resolve(__dirname, '../UI/', 'index.html'));
	})
	.get("/dev", (request, response) => {
		response.sendFile(path.resolve(__dirname, '../UI/', 'index2.html'));
	})
	.get("/graph", (request, response) => {
		response.sendFile(path.resolve(__dirname, '../UI/', 'charts.html'));
	})
	.get("/minigraph", (request, response) => {
		response.sendFile(path.resolve(__dirname, '../UI/', 'MiniCharts.html'));
	})
	.get("/dashboard", (request, response) => {
		response.sendFile(path.resolve(__dirname, '../UI/', 'dashboard.html'));
	})
	// .get("/graph/:mode", (request, response) => {
	// 	response.sendFile(path.resolve(__dirname, '../UI/', 'charts.html'));
	// })
}