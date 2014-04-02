var http = require('http'); 
var path = require('path'); 
var express = require('express');
var rover = require('./rover/rover.test.js');

var router = express();
var server = http.createServer(router);

var roverReturnObject = function (err, value) {
    var _err;
    if (typeof err == "string") {
        _err = err;
    } else if (err.message) {
        _err = err.message;
    }
    
    return {
        error: _err,
        value: value
    };
};

router.use(express.static(path.resolve(__dirname, 'client')));

router.use('/move', function(req, res) {
    var params = req.query;
    
    if (params.direction) {
        rover.move(params.direction, function(err, value) {
            res(roverReturnObject(err, value));
        });
    } else if (params.stop) {
        rover.stop(function(err, value) {
            res(roverReturnObject(err, value));
        });
    } else {
        res.json(roverReturnObject('Invalid request. Direction or stop not specified.'));
    }
});

router.use('/servo', function(req, res) {
   var direction = req.query.direction;
   if (direction) {
       rover.moveServo(direction, function(err, value) {
            res(roverReturnObject(err, value));
        });
   } else {
       res.json(roverReturnObject('Invalid request. Direction not specified.'));
   }
});

// if it errors, cleanup and exit
rover.cleanup();
rover.init(function (err) {
    if (!err) {
        server.listen(process.env.PORT || 80, process.env.IP || "192.168.0.18", function() {
            var addr = server.address();
            console.log("server listening at", addr.address + ":" + addr.port);
        });
    } else {
        console.log(err);
    }
});

process.on('exit', function () {
    console.log('terminating...');
    server.close(function() {
        console.log('Turning off server.'); 
    });
});
