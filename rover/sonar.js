var gpio = require("pi-gpio"),
    async = require("async"),
    sleep = require("sleep");

// this is the gpio pin for the ultrasonic sensor on the pirocon. It handles both the trigger and the echo.
var pin = 8;
// the timeout to wait for the pulses, in milliseconds
var timeout = 20;

/* 
    This object handles the sending of the initial pulse. Tried to mimick arduino ping code:

    The PING is triggered by a HIGH pulse of 2 or more microseconds.
    Give a short LOW pulse beforehand to ensure a clean HIGH pulse
*/
var sendPulseObj = {
    setUp: function(callback) {
        gpio.open(pin, "output", callback);
    },
    cleanPulse: function(callback) {
        gpio.write(pin, 0, callback);
    },
    sendHighPulse: function (callback) {
        sleep.usleep(2);
        gpio.write(pin, 1, callback);
    },
    sendLowPulse: function (callback) {
        sleep.usleep(5);
        gpio.write(pin, 0, callback);
    }
};

function sendPulse (cb) {
    async.series(sendPulseObj, cb);
}

function waitForChange(initial, callback) {
    var start = new Date(),
        _value = initial;
    
    async.whilst(
        function() {
            var end = new Date();
            return _value === 0 && (end - start) < timeout;
        },
        function (callback) {
            gpio.read(pin, function(err, value) {
               _value = value;
               callback(err);
            });
        },
        callback
    );
}

function getDistance(time) {
    // At room temperature and pressure the speed of sound is 340 m/s, time is in milliseconds so
    var distance2_in_m = 340 * (time / 1000),
        distance2_in_cm = distance2_in_m * 100;
        
    // the actual distance is half of distance2_in_cm since the pulse had to travel twice the distance (there and back)
    return distance2_in_cm / 2;
}

function getPulseTime (callback) {
    gpio.setDirection(pin, "input", function(err) {
        if (err) {
            callback(err);
        } else {
            waitForChange(0, function(err1) {
                var start = new Date();
                waitForChange(1, function(err2) {
                    var end = new Date();
                    
                    // this is the time it took for the pulse to go from HIGH to LOW
                    var time = end - start,
                        distance = getDistance(time);
                        
                    console.log(err1);
                    console.log(err2);
                    console.log('time: ' + time + ', distance: ' + distance);
                        
                    // at these ranges results are unreliable
                    if (distance >= 200 || distance <= 0) {
                        distance = null;
                    }
                                        
                    callback(null, distance);
                });
            });
        }
    });
}

function cleanup () {
    gpio.close(pin);
}

module.exports.distance = function(callback) {
    sendPulse(function (err) {
        if (err) {
            callback(err);
        } else {
            getPulseTime(callback);
        }
    });
};

module.exports.cleanup = cleanup;
