var fs = require('fs'),
    spawn = require('child_process').spawn;

var IMAGE_PATH = '/tmp/stream',
    IMAGE_NAME = 'pic.jpg';
    
var cameraProcess, streamingProcess;
    
module.exports.start = function() {
    if (!fs.existsSync(IMAGE_PATH)) {
        fs.mkdirSync(IMAGE_PATH);
    }
    
    if (!cameraProcess) {
        var fullPath = IMAGE_PATH + '/' + IMAGE_NAME;
        cameraProcess = spawn('raspistill', [
            '-rot', '180', 
            '-w', '640', 
            '-h', '480', 
            '-q', '5', 
            '-o', fullPath,
            '-tl', '500',
            '-t', '9999999',
            '-th', '0:0:0'
        ]);
        
        cameraProcess.on('exit', function(){
            console.log('camera process has stopped');
            cameraProcess = null;
        });
    }
    
    if (!streamingProcess) { 
        streamingProcess = spawn('mjpg_streamer', [
            '-i', '/usr/local/lib/input_file.so',
            '-f', IMAGE_PATH,
            '-n', IMAGE_NAME,
            '-o', '/usr/local/lib/output_http.so',
            '-w', '/usr/local/www'
        ]);
        
        streamingProcess.on('exit', function() {
            console.log('streaming process has stopped');
            streamingProcess = null;
        });
    }
};

module.exports.stop = function() {
    if (cameraProcess) {
        cameraProcess.kill();
    } else {
        console.log('camera process is undefined');
    }
    
    if (streamingProcess) {
        streamingProcess.kill();
    } else {
        console.log('streaming process is undefined');
    }
};
