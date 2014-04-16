// the default language will be appended to the autodetected languages
// this is to always provide a language no matter
// if the language is implemented or not
Translator._defaultLanguage = new LanguageArray('en_US');
Translator.setDefaultLanguage = function (language) {
  language = LanguageArray.make(language); // throws error if wrong parameter
  this._defaultLanguage = language;
  // XXX the server implementation of the translator does not yet depend
  // on the autodetected language and therefor does not need to reactively
  // change if this value gets modified. That might change in the future
};

// this part injects the language from the accept-header into the document
// the client script will pick it up and therefor always initially use
// the language the browser has sent with the request
var RX_LOCALE_SPLIT = /\s*[,;]\s*/;
Inject.obj('translator-language', function (req) {
  var headers = req.connection.parser.incoming.headers; // awesome object path
  var acceptLanguage = headers['accept-language']; // the key is already lower
  
  var rawLocales = acceptLanguage.split(RX_LOCALE_SPLIT);
  var language = new LanguageArray(rawLocales, true);
  language.merge(Translator._defaultLanguage);
  return langauge;
});
