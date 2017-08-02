const express = require('express');
const app = express();
const path = require('path');
const portno = 5000;





const https = require('https');

app.get('/query', function(req, res) {
    //console.log(Object.keys(req.query)[0])
    var options = {
      hostname: 'crest-tq.eveonline.com',
      port: 443,
      path: Object.keys(req.query)[0],
      method: 'GET'
    };

    var req = https.request(options, function(response) {
      console.log('statusCode:', response.statusCode);
      //console.log('headers:', response.headers);

      response.on('data', function(d) {
        process.stdout.write(d);
      });
      res.send(response);
    });
    req.end();

    req.on('error', function(e) {
      console.error('failed');
      console.error(e);
    });
})



////////////////////////////////////////////////////////


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

app.listen(process.env.PORT || portno);
console.log("running on " + portno);
