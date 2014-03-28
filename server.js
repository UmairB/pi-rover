var http = require('http'); 
var path = require('path'); 
var express = require('express');
var move = require('./move.js');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'client')));

router.use('/move', function(req, res) {
  var params = req.query;
  if (params.direction) {
    move.move(direction, function(err, value) {
      if (!err) {
        res.json(value);
      }
    });
  } else if (params.stop) {
    move.stop(function(err, value) {
       if (!err) {
         res.json(value);
       }
    });
  }
});

server.listen(80, "192.168.0.18", function() {
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
