/**
 * Module dependencies.
 */
var debug = require('debug')('{name}:server');
var http = require('http');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./{ussdappname}/router.js');
var app = express();

var UssdPageBuilder = require('myriade-ussd-page-builder-node');
var pageBuilder = new UssdPageBuilder();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var defaultPort = 6891;

//--------------------
//Middleware qui vas lire certaines informations utiles envoyées par la plateforme USSD
//-----------------------------------------------------
app.use(function(req,res,next){
    res.locals.msisdn = req.get('user-msisdn');
    res.locals.imsi = req.get('user-imsi');
    res.locals.userSubscription = req.get('user-subscription');
    res.locals.userIdentity = req.get('user-identity');   
    res.set('Content-Type','application/xml'); 
    next();    
});
app.use('/{ussdappname}', routes);


//===================
//Gestion des erreurs
//===================
//------------------------------------
//Interception des erreurs de type 404
//------------------------------------
app.use(function(req, res, next) {
  var msg = res.locals.language == "fr"? "Désolé, la page demandée n'existe pas." : "Sorry, the page you were looking for was not found."    
    var options = {        
        content: msg     
    };
    res.send(pageBuilder.getPage(options));  
});





//---------------------------------

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || defaultPort);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

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
      console.error(bind + ' privilège root requis');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' est déjà utilisé');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports = app;