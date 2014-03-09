var RxValid = /^[a-z]{2}(?:)$/m;

LanguageArray = function (locales) {
  var self = this;
  
  self._locales = [];
  
  if (!_.isArray(locales)) {
    locales = [locales];
  }
  
  _.each(locales, function (locale) {
    var isLocale = locale instanceof Locale;
    if (! isLocale) {
      locale = new Locale(locale);
    }
    self._locales.push(locale);
  });
  
  var hasLocales = self._locales.length > 0;
  if (! hasLocales) {
    console.warn("no locales specified, fallback to en_US");
    self._locales.push(new Locale());
  }
};

/**
 * @return {Array.<Locale>}
 */
LanguageArray.prototype.getLocales = function () {
  return this._locales.slice(0); // copy to make the array safe
};
/**
 * @return {Locale}
 */
LanguageArray.prototype.getLocale = function () {
  return this._locales[0];
};
