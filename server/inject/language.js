var RX_LOCALE_SPLIT = /\s*[,;]\s*/;

Inject.obj('translator-language', function (req) {
  var headers = req.connection.parser.incoming.headers; // awesome object path
  var acceptLanguage = headers['accept-language']; // the key is already lower
  
  return new LanguageArray(acceptLanguage.split(RX_LOCALE_SPLIT), true);
});
