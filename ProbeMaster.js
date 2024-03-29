const port = process.env.PORT || 3001;
const express = require('express');
const app = express();
const router = require('./router');

// CORS permet de configurer comment des applications web définies sur un autre domaine peuvent accéder aux ressources de votre serveur. Ce mécanisme est appelé CORS pour Cross-Origin Resource Sharing, d’où le nom de ce package. Faire appel à ce package sans lui passer d’arguments permet d’autoriser tous les accès à votre ressource
// const cors = require('cors');

// MORGAN permet de définir les informations que le serveur affiche dans la console à chaque fois qu’il reçoit une requête HTTP
// const morgan = require('morgan');

// permet de décomposer les requêtes HTTP POST, PATCH, etc. afin de pouvoir extraire les infoirmations tranmises dans des formulaires. Ces informations apparaissent dans le champ req.body
// const bodyParser = require("body-parser");

// app.use(morgan('combined')); 
// app.use(cors());
// app.use(bodyParser.json()); 
// app.use(bodyParser.urlencoded({
//         extended: true
//     }));

// Defini les repertoire dont l'url n'est pas interprete par le ROUTER mais juste servie directement
app.use(express.static(__dirname + '/statics'));
app.use(express.static(__dirname + '/Childrens/Chataignes/statics'));
app.use(express.static(__dirname + '/Childrens/Roblox/statics'));

// permet de définir les routes dans le fichier router.js
app.use(router);

app.listen(port, () => console.log('Server app listening on port ' + port));