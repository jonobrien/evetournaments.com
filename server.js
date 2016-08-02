var express = require('express');
var app = express();
var path = require('path');
var portno = 3000;

// viewed at http://localhost:portno
app.use('/static', express.static('static'));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/tournaments.html'));
});

app.listen(portno);
console.log("running on " + portno)