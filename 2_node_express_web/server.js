var config = require('config');
var app = require('./app');
var http = require('http');

/**
 * server start
 */
var port = config.get('server.port');

var server = http.createServer(app);
server.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
server.on('error', onError);

// Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}