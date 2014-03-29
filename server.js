var http = require('http'); 
var path = require('path'); 
var express = require('express');
var rover = require('./rover.test.js');

var router = express();
var server = http.createServer(router);

var moveRetObj = function (error, value) {
    return {
        error: error,
        value: value
    };
};

router.use(express.static(path.resolve(__dirname, 'client')));

router.use('/move', function(req, res) {
    //res.writeHead(200, { 'Content-Type': 'application/json' });
    
    var params = req.query,
        cb = function(err, value) {
            var obj = moveRetObj(err ? err.message : err, value);
            res.json(obj);
        };
        
    if (params.direction) {
        rover.move(params.direction, cb);
    } else if (params.stop) {
        rover.stop(cb);
    } else {
        res.json(moveRetObj('Invalid request. Direction or stop not specified.'));
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
