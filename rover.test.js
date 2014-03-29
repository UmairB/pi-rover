var async = require("async");

var maxTime = 500,
    throwError = false;

var directions = ['forward', 'back', 'left', 'right'];

var randomTimeOut = function (callback) {
    var waitTime = Math.floor(Math.random() * (maxTime + 1));
    setTimeout(function() {
        var err = null,
            value;
        if (throwError) {
            err = new Error('An error has occurred');
        } else {
            value = true;
        }
        
        callback(err, value);
    }, waitTime);
}

module.exports.init = function (callback) {
    callback(null);
}

module.exports.move = function(direction, callback) {
    var _d = direction ? direction.toLowerCase() : direction;
    if (!_d) {
        callback(new Error('Direction was not specified'));
    } else if (directions.indexOf(_d) === -1) {
        callback(new Error('Invalid direction'));
    } else {
        async.parallel([randomTimeOut, randomTimeOut], callback);
    }
};

module.exports.stop = function(callback) {
    async.parallel([randomTimeOut, randomTimeOut], callback);
};
