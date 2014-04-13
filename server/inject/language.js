var RX_LOCALE_SPLIT = /\s*[,;]\s*/;

Inject.obj('translator-language', function (req) {
  var headers = req.connection.parser.incoming.headers; // awesome object path
  var acceptLanguage = headers['accept-language']; // the key is already lower
  
  return {'an': 'object'};
});

/*WebApp.connectHandlers.use(function(req, res, next) {
  if(Inject.appUrl(req.url)) {
    var initialObject = {};
    
    try {
      var headers = req.connection.parser.incoming.headers; // awesome object path
      var acceptLanguage = headers['accept-language']; // the key is already lower
      
      Inject.obj('traslatorLanugage', acceptLanguage);
    } catch (e) {}
  }
  next();
});*/
