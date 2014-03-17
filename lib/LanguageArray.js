/**
 * @constructor
 * @param {string|Locale|Array.<(string|Locale)>}
 * @param {boolean=} unsafe if true locales will be filtered
 */
LanguageArray = function (locales, unsafe) {
  var self = this;
  
  self._locales = [];
  self._isFallenBack = false; // true if no valid locale provided
  
  if (locales instanceof LanguageArray) {
    locales = locales._locales;
  } else if (!_.isObject(locales) && !(locales instanceof Locale)) {
    locales = [locales];
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
  
  var hasLocales = self._locales.length > 0;
  if (! hasLocales) {
    console.warn("no locales specified, fallback to en_US");
    self._locales.push(new Locale());
    self._isFallenBack = true;
  }
};

/**
 * @return {!Array.<Locale>}
 */
LanguageArray.prototype.getLocales = function () {
  return this._locales.slice(0); // copy to make the array safe
};
/**
 * @return {!Locale}
 */
LanguageArray.prototype.getLocale = function () {
  return this._locales[0];
};

/**
 *
 */
LanguageArray.prototype.isFallenBack = function () {
  return this._isFallenBack;
};

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
  return this._locales;
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
    && _.every(other._locales, function (otherLocale) { // same locales
      return _.any(self._locales, LanguageArray.prototype.equals, otherLocale);
    });
};

EJSON.addType(LanguageArray.prototype.typeName(), function (array) {
  return new LanguageArray(array);
});
