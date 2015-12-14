var express = require('express');
var router = express.Router();
var pageBuilder = require('myriade-ussd-page-builder-node');
var appConfig = null;
var descr = "{description}";

router.use(function(req,res,next){
    appConfig = res.locals.appConfig;
    next();
});

router.get('/', function(req, res, next) { 
    var options = {
        descr: descr,
        content: res.locals.localizedStrings.welcomeToYourUSSDApp,
        links: [
            {href: "{ussdappname}/option_one", text: res.locals.localizedStrings.optionOne},            
            {href: "{ussdappname}/option_two", text: res.locals.localizedStrings.optionTwo},                                     
            {href: "{ussdappname}/setLocale?locale=" + (res.locals.language == "fr"? "en" : "fr"), text: (res.locals.language == "fr"? res.locals.localizedStrings.english : res.locals.localizedStrings.french)}    
        ]
    };    
    res.body = pageBuilder.generateContentPage(options);
    next();       
});

module.exports = router;

