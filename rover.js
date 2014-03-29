var gpio = require("pi-gpio");
var async = require("async");

var directions = {
    "forward": [19, 24], 
    "back": [21, 26], 
    "left": [21, 24], 
    "right": [19, 26]
};

var getPins = function(d) {
    for (var i in directions) {
        if (i === d) {
            return directions[i];
        }
    }
};

var getAllPins = function () {
    var allPins = [];
    for (var i in directions) {
        var pins = directions[i];
        for (var p = 0, _length = pins.length; p < _length; p++) {
            if (allPins.indexOf(pins[p]) === -1) {
                allPins.push(pins[p]);
            }
        }
    }
    
    return allPins;
};

var openGpioPinCalls = function(pins, mode) {
    return pins.map(function(p) {
        return function(callback) {
            gpio.open(p, mode, callback);
        };
    });
};

module.exports.init = function(callback) {
    // init the direction pins
    var allPins = getAllPins();
    
    var cbs = openGpioPinCalls(allPins, "output");
    async.parallel(cbs, callback);
};

module.exports.cleanup = function (callback) {
    getAllPins().forEach(function (p) {
        gpio.close(p); 
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
    
    pins.forEach(function(p) {
        gpio.write(p, 1);
    });
    
    callback(null, pins);
};

module.exports.stop = function(callback) {
    for (var i in directions) {
        directions[i].forEach(function(p) {
            gpio.write(p, 0, function() {
               //gpio.close(p); 
            });
        });
    }
    
    callback(null, true);
};
