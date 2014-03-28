var gpio = require("pi-gpio");

var directions = ['forward', 'back', 'left', 'right'];

var getPins = function(d) {
	var pins;
	switch (d) {
        	case 'forward':
			pins = [19, 24];
		break;
        }
};

module.exports.move = function(direction, callback) {
    if (!direction) {
    	callback(new Error('Direction was not specified'));
    } else {
    	var d = direction.toLower();
        if (directions.indexOf(d) >= 0) {
		var pins = [];
                
	} else {
		callback(new Error('Invalid direction'));
	}
    }
};

module.exports.stop = function() {

};

