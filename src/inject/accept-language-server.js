// this part injects the language from the accept-header into the document
// the client script will pick it up and therefor always initially use
// the language the browser has sent with the request
var RX_LOCALE = /([a-z]{2}(?:-[a-z]{2})?)(?:;q=([\d\.]+))?/ig;

// this function exists so it is testable!
Translator._createLangaugeArrayFromHeader = function (headers) {
  var acceptLanguage = headers['accept-language']; // the key is already lower
  
  if (_.isString(acceptLanguage)) {
    // reference: http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.4
    var languages = [];
    acceptLanguage.replace(RX_LOCALE, function (string, locale, quality) {
      languages.push({
        locale: new Locale(locale),
        quality: quality != null ? parseFloat(quality) : 1.0
      });
    });
    languages = _.sortBy(languages, 'quality').reverse();
    var languageArray = new LanguageArray(_.pluck(languages, 'locale'));
    return languageArray.merge(Translator._defaultLanguage);
  } else {
    return Translator._defaultLanguage;
  }
};

Inject.obj('translator-language', function (req) {
  var headers = req.connection.parser.incoming.headers; // awesome object path
  return Translator._createLangaugeArrayFromHeader(headers);
});
