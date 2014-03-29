var gpio = require("pi-gpio");
var async = require("async");

var directions = {
    "forward": [19, 24], 
    "back": [], 
    "left": [], 
    "right": []
};

var getPins = function(d) {
    for (var i in directions) {
        if (i === d) {
            return directions[i];
        }
    }
};

var openGpioPinCalls = function(pins, mode) {
    return pins.map(function(p) {
        return function(callback) {
            gpio.open(p, mode, callback);
        };
    });
};

module.exports.move = function(direction, callback) {
    var _d = direction ? direction.toLowerCase() : direction;
    if (!_d) {
        callback(new Error('Direction was not specified'));
        return;
    }
    
    var pins = getPins(_d);
    if (!pins) {
        callback(new Error('Invalid direction'));
        return;
    }
    
    var cbs = openGpioPinCalls(pins, "output");
    async.parallel(cbs, function(err) {
       if (err) {
           callback(err);
       } else {
           pins.forEach(function(p) {
               gpio.write(p);
           });
           
           callback(null, pins);
       }
    });
};

module.exports.stop = function() {
    for (var i in directions) {
        directions[i].forEach(function(p) {
            gpio.close(p);
        });
    }
};
