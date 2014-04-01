var exec = require("child_process").exec,
    format = require("util").format;

var servoBlasterPath = '';
var command = 'echo %d=%d > /dev/servoblaster';

// these are the servo numbers which map to the appropriate gpio port. So servoblaster docs
var servoNumber = {
    pan: 6,
    tilt: 7
};

// values for min/max and default pwm
var servoMovement = {
    pan: {
        current: 0,
        middle: 120,
        maxUp: 50,
        maxDown: 210,
        active: false,
        directions: ['up', 'down']
    },
    tilt: {
        current: 0,
        middle: 170,
        maxLeft: 250,
        maxRight: 80,
        active: false,
        directions: ['left', 'right']
    }
};

var handleError = function (error, validState, callback) {
    callback(new Error(error));
    validState = false;
};

var execCommand = function(c, callback) {
    exec(c).on('exit', callback);
};

module.exports.init = function () {
    var _p = format(command, servoNumber.pan, servoMovement.pan.middle),
        _t = format(command, servoNumber.tilt, servoMovement.tilt.middle);
        
    execCommand(_p, function() {
        servoMovement.pan.current = servoMovement.pan.middle;
    });
    
    execCommand(_t, function() {
        servoMovement.tilt.current = servoMovement.tilt.middle;
    });
};

module.exports.move = function(direction, callback) {
    var servo;
    for (var m in servoMovement) {
        var s = servoMovement[m];
        if (s.directions.indexOf(direction) >= 0) {
            servo = m;
        }
    }
    
    if (!servo) {
        callback && callback(new Error('Invalid direction. Use up/down or left/right'));
    } else {
        var current = servoMovement[servo].current;
        if ((direction == 'left' && current < servoMovement[servo].maxLeft) || (direction == 'down' && current < servoMovement[servo].maxDown)) {
            current += 10;
        } else if ((direction == 'right' && current > servoMovement[servo].maxRight) || (direction == 'up' && current > servoMovement[servo].maxUp)) {
            current -= 10;
        }
        
        if (current != servoMovement[servo].current) {
            var _c = format(command, servoNumber[servo], current);
            execCommand(_c, function() {
                servoMovement[servo].current = current;
                callback && callback(null, true);
            });
        } else {
            callback && callback(null, false);
        }
    }
};
