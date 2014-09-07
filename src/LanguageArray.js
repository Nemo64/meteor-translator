/**
 * The LanguageArray is a container for locales. It'll make sure that it
 * only contains locales. Also the instance is constant, meaning that it's
 * content will not changed (unless on private access).
 *
 * It is mostly used to store a language and fallbacks.
 * 
 * @constructor
 * @param {string|Locale|Array.<(string|Locale)>|LanguageArray}
 */
LanguageArray = function (locales) {
  var self = this;
  
  self._locales = [];
  
  if (locales instanceof self.constructor) {
    locales = locales._locales;
  } else if (!_.isArray(locales)) {
    locales = locales != null ? [locales] : [];
  }
  
  _.each(locales, function (locale) {
    var isLocale = locale instanceof Locale;
    if (! isLocale) {
      locale = new Locale(locale);
    }
    var equals = Locale.prototype.equals;
    if (! _.any(self._locales, equals, locale)) {
      self._locales.push(locale);
    }
  });
  
};

/**
 * This little shortcut makes sure that what you got is a LanguageArray.
 * If it is not it will create one. If that fails it'l throw an exception.
 *
 * @param {string|Locale|Array.<(string|Locale)>|LanguageArray}
 */
LanguageArray.make = function (language) {
  if (language instanceof this) {
    return language;
  } else {
    return new this(language);
  }
};

_.extend(LanguageArray.prototype, {
  /**
   * @return {!Array.<Locale>}
   */
  getLocales: function () {
    return this._locales.slice(); // copy to make the array safe
  },
  
  /**
   * @return {Locale}
   */
  getLocale: function () {
    return this._locales[0];
  },

  /**
   * @return {boolean}
   */
  isEmpty: function () {
    return this._locales.length === 0;
  },

  /**
   * Creates a new LanguageArray which will continer all locales of this
   * with the locales of the specified language array attached.
   * It prevents that the same locale can be added 2 times!
   *
   * @param {LangaugeArray|Array.<(Locale|string)>|Locale|string} other
   * @return {!LanguageArray}
   */
  merge: function (other) {
    other = this.constructor.make(other); // just to be sure
    var locales = this._locales.concat(other._locales);
    return new this.constructor(locales);
  },

  /**
   * @return {string}
   */
  toString: function () {
    return "[" + this._locales.join(",") + "]";
  },
  
  /**
   * this method sorts the given locales
   * from the best matching to the worst matching.
   *
   * The use case is that the given locales are the available ones
   * and the current instance are the locales the user wants.
   *
   * imagine following situations:
   *
   * user wants: "de_DE" "de_AT" "de" "en_US" "en"
   * we have: "de_CH" "en_US"
   * the user should preferably get de_CH as it has a higher priority for him
   * en_US should be secound even though we have a perfect match for it
   *
   * another case:
   * user wants: "en_US" "en_MP" "en"
   * we have: "en" "en_MP"
   * even though en_US soft-matches with every locale, en_MP must be prefered
   *
   * @param {Array.<Locale>} locales
   * @return {Array.<Locale>}
   */
  prioritizeLocales: function (locales) {
    var self = this;
    // this array will contain the root language and its priority
    var languageWeights = {};
    
    var matches = 0;
    _.each(self._locales, function (locale) {
      var language = locale.getLanguage();
      
      if (! languageWeights.hasOwnProperty(language)) {
        languageWeights[language] = matches++;
      }
    });
    
    return _.sortBy(locales, function (locale) {
      var baseWeight = languageWeights[locale.getLanguage()] * -10;
      var weight = 0;
      _.each(self._locales, function (languageLocale) {
        weight = Math.max(weight, languageLocale.weightDifferences(locale));
      });
      
      if (weight <= 0) {
        return Infinity; // there was no match, put this at the end
      } else {
        return -(baseWeight + weight);
      }
    });
  },

  /**
   * @return {!Locale}
   */
  clone: function () {
    return new this.constructor(this._locales);
  },
  
  /**
   * @return {string}
   */
  toJSONValue: function () {
    return this._locales.join(' '); // shortcut for toString() on all
  },
  
  /**
   * @return {string}
   */
  typeName: function () {
    return "Translator.LanguageArray";
  },
  
  /**
   * @param {object}
   * @return {boolean}
   */
  equals: function (other) {
    var self = this;
    
    return other instanceof self.constructor // same instance
      && other._locales.length == this._locales.length // same amount of locales
      && _.every(other._locales, function (locale, index) { // same locales
        return self._locales[index].equals(locale);
      });
  }
});

EJSON.addType(LanguageArray.prototype.typeName(), function (locales) {
  var locales = locales != '' ? locales.split(' ') : null;
  return new LanguageArray(locales);
});
