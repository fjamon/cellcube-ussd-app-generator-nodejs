var express = require('express');
var router = express.Router();
var UssdPageBuilder = require('myriade-ussd-page-builder-node');
var tools = require('../../libs/tools');
var appConfig = null;
var pageBuilder = new UssdPageBuilder();
var descr = "{description}";

//Lecture des paramètres par défaut de l'application
router.use(function(req,res,next){
    appConfig = res.locals.appConfig;
    next();
});


//Page d'accueil du service
router.get('/', function(req, res, next) { 
    var options = {
        descr: descr,
        content: localizedStrings.welcome,
        links: [
            {href: "{ussdappname}/option_one", text: localizedStrings.optionOne},            
            {href: "{ussdappname}/option_two", text: localizedStrings.optionTwo},  
            {href: "{ussdappname}/askForUserName", text: localizedStrings.hi},                        
            {href: "{ussdappname}/setLocale?locale=" + (language == "fr"? "en" : "fr"), text: (language == "fr"? localizedStrings.english : localizedStrings.french)}    
        ]
    };    
    res.body = pageBuilder.getPage(options);
    next();       
});

/*
//Fonction qui redirige l'utilisateur vers le menu d'accueil du service
function redirectToHome(req, res, next){
    var options = {        
        erl: tools.stripTrailingSlash(config.ussd.servicePath) + "/" + config.ussd.defaultFile,
        encodeUrl: true
    };            
    res.body = pageBuilder.getRedirectPage(options)            
    next();
}
*/

/*
//Fonction qui permet de rediriger l'utilisateur vers un service particulier
function redirectToService(servicePath, defaultFile, req, res, next){
    var options = {        
        erl: tools.stripTrailingSlash(servicePath) + "/" + defaultFile,
        encodeUrl: true
    };            
    res.body = pageBuilder.getRedirectPage(options)            
    next();
}
*/

//Exports
module.exports = router;

