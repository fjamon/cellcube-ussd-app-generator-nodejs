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
var pageBuilder = require('myriade-ussd-page-builder-node');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//Initialize metrics computing
app.use(function(req,res,next){    
    res.locals.hrstart = process.hrtime();
    next();
});

//Edit configuration below to test language change
app.use(function (req, res, next){
    res.locals.localizedStrings = require('./{ussdappname}/strings/fr.js');
    res.locals.languageName = "Français";
    res.locals.language == "fr";
    
    //<- uncomment following lines to set english as the default language ->
    /*
    res.locals.localizedStrings = require('./{ussdappname}/strings/en.js');
    res.locals.languageName = "english";
    res.locals.language == "en";
    */
    next();
});

app.use(function(req,res,next){
    res.locals.msisdn = req.get('user-msisdn');
    res.locals.imsi = req.get('user-imsi');
    res.locals.userSubscription = req.get('user-subscription');
    res.locals.userIdentity = req.get('user-identity');   
    res.set('Content-Type','application/xml'); 
    next();    
});

//Mounting app routes
app.use('/{ussdappname}', routes);

//updating and returning response by setting metrics in headers
app.use(function(req, res, next){      
    var hrend = process.hrtime(res.locals.hrstart);    
    res.set('x-orangeci-execution-time',hrend[0] + hrend[1]/1000000);
    res.set('x-orangeci-execution-time-unit','ms');  
    if (res.body){        
        res.body = res.body.replace("undefined","");        
        res.send(res.body); 
    }
    else{
        next();
    }     
})
    
//404
app.use(function(req, res, next) {         
    var options = {        
        content: res.locals.localizedStrings.pageNotFound     
    };
    res.send(pageBuilder.generateContentPage(options));   
});  


module.exports = app;