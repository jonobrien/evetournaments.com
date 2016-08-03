var express = require('express');
var app = express();
var path = require('path');
var portno = 3000;

// viewed at http://localhost:portno
if (process.env.EVE_JS_PROD) {
    console.log("prod setup");
    app.use('/eve/static', express.static('static'));
    app.get('/eve/', function(req, res) {
        res.sendFile(path.join(__dirname + '/tournaments.html'));
    });
}
else {
    console.log("dev setup");
    app.use('/static', express.static('static'));
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/tournaments.html'));
    });
}

app.listen(portno);
console.log("running on " + portno)