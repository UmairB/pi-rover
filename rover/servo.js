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
        active: false
    },
    tilt: {
        current: 0,
        middle: 120,
        maxLeft: 250,
        maxRight: 80,
        active: false
    }
};

var handleError = function (error, validState, callback) {
    callback(new Error(error));
    validState = false;
};

module.exports.reset = function () {
    var _p = format(command, servoNumber.pan, servoMovement.pan.middle),
        _t = format(command, servoNumber.tilt, servoMovement.tilt.middle);
        
    exec(_p, function() {}).on('exit', function() {
        servoMovement.pan.current = servoMovement.pan.middle;
    });
    
    exec(_t, function() {}).on('exit', function() {
        servoMovement.tilt.current = servoMovement.tilt.middle;
    });
};

module.exports.move = function(servo, direction, callback) {
    var validState = true;
    var _servo = servoNumber[servo];
    if (!_servo) {
        handleError('Invalid servo. Use pan or tilt', validState, callback);
    }
    
    if (servo === 'pan' && direction !== 'up' && direction !== 'down') {
        handleError('Can only use up and down for the pan servo', validState, callback);
    } else if (servo === 'tilt' && direction !== 'left' && direction !== 'right') {
        handleError('Can only use left and right for the tilt servo', validState, callback);
    }
    
    if (validState) {
        
    }
};

module.exports.stop = function() {
    
};
