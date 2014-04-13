/**
 * The LanguageArray is a container for locales. It'll make sure that it
 * only contains locales. Also the instance is constant, meaning that it's
 * content will not changed (unless on private access).
 *
 * It is mostly used to store a language and fallbacks.
 * 
 * @constructor
 * @param {string|Locale|Array.<(string|Locale)>|LanguageArray}
 * @param {boolean=} unsafe if true locales will be filtered
 */
LanguageArray = function (locales, unsafe) {
  var self = this;
  
  self._locales = [];
  
  if (locales instanceof LanguageArray) {
    locales = locales._locales;
  } else if (!_.isArray(locales)) {
    locales = locales != null ? [locales] : [];
  }
  
  _.each(locales, function (locale) {
    try {
      var isLocale = locale instanceof Locale;
      if (! isLocale) {
        locale = new Locale(locale);
      }
      self._locales.push(locale);
    } catch (e) {
      // if errors weren't expected throw it further
      if (! unsafe) throw e;
    }
  });
  
  //var hasLocales = self._locales.length > 0;
  //if (! hasLocales) {
  //  console.warn("no locales specified, fallback to en_US");
  //  self._locales.push(new Locale());
  //  self._isFallenBack = true;
  //}
};

/**
 * This little shortcut makes sure that what you got is a LanguageArray.
 * If it is not it will create one. If that fails it'l throw an exception.
 *
 * @param {string|Locale|Array.<(string|Locale)>|LanguageArray}
 */
LanguageArray.make = function (language) {
  if (language instanceof LanguageArray) {
    return language;
  } else {
    return new LanguageArray(language);
  }
};

/**
 * @return {!Array.<Locale>}
 */
LanguageArray.prototype.getLocales = function () {
  return this._locales.slice(); // copy to make the array safe
};
/**
 * @return {Locale}
 */
LanguageArray.prototype.getLocale = function () {
  return this._locales[0];
};

/**
 * @return {boolean}
 */
LanguageArray.prototype.isEmpty = function () {
  return this._locales.length === 0;
};

/**
 * @return {string}
 */
LanguageArray.prototype.toString = function () {
  return "[" + this._locales.join(",") + "]";
}





/**
 * @return {!Locale}
 */
LanguageArray.prototype.clone = function () {
  return new LanguageArray(this._locales);
};
/**
 * @return {string}
 */
LanguageArray.prototype.toJSONValue = function () {
  return this._locales.join(' '); // shortcut for toString() on all
};
/**
 * @return {string}
 */
LanguageArray.prototype.typeName = function () {
  return "Translator.LanguageArray";
};
/**
 * @param {object}
 * @return {boolean}
 */
LanguageArray.prototype.equals = function (other) {
  var self = this;
  
  return other instanceof self.constructor // same instance
    && other._locales.length == this._locales.length // same amount of locales
    && _.every(other._locales, function (locale, index) { // same locales
      return self._locales[index].equals(locale);
    });
};

EJSON.addType(LanguageArray.prototype.typeName(), function (locales) {
  return new LanguageArray(locales.split(' '));
});
