var RX_LOCALE_SPLIT = /\s*[,;]\s*/;

LanguageArray.autodetect = function (options) {
  options = _.extend({
    availableLocales: [], // the locales to choose from
    defaultLocales: [], // the locales appended to the ones detected
    appendRoughMatch: true, // eg. if the user has en_GB he will get en_US as fallback
    connection: null // if used on the server this allows detection there
  }, options);
  
  // XXX this probably should be standadized by the meteor-header package
  var rawAcceptLocales = options.connection == null
    ? headers.get("accept-language")
    : headers.get(options.connection, "accept-language");
  
  if (_.isString(rawAcceptLang)) {
    var localeArray = rawAcceptLocales.split(RX_LOCALE_SPLIT);
    var acceptLang = new LanguageArray(localeArray, true); // normalizes and filters the locales
    
    if (! acceptLang.isFallenBack()) {
      // XXX everything in this block should not be here as it is, it's too long
      
      var availableLocales = new LanguageArray(options.availableLocales)._locales;
      var defaultLocales = new LanguageArray(options.defaultLocales)._locales;
      var result = {}; // { "en_US": new Locale("en_US") }
      
      _.each(acceptLang._locales, function (locale) {
        // add it this is an exact match
        var equals = Locale.prototype.equals;
        if (_.any(availableLocales, equals, locale)) {
          result[locale.toString()] = locale;
        }
        // add all rough matches
        var roughEquals = Locale.prototype.roughEquals;
        var roughMatches = _.filter(availableLocales, roughEquals, locale);
        _.each(roughMatches, function (locale) {
          result[locale.toString()] = locale;
        });
      });
      
      // and then the default fallbacks
      _.each(options.defaultLocales, function (locale) {
        result[locale.toString()] = locale;
      });
      
      return new LanguageArray(result);
    }
  }
  
  // fallback to default
  return new LanguageArray(options.defaultLocales);
};
