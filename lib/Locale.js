var RxLocale = /^([A-Za-z]{2})(?:_([A-Za-z]{2}))$/m;
var RxCode = /^[A-Za-z]{2}$/m;

Locale = function (locale, country) {
  var numArgs = arguments.length;
  
  if (numArgs === 0 || locale == null) {
    this._fromParts("en", "US"); // default
  }
  else if (numArgs === 1) {
    if (RxCode.test(locale)) {
      this._fromParts(locale);
    } else {
      this._fromString(locale);
    }
  }
  else if (numArgs === 2) {
    this._fromParts(locale, country);
  } else {
    throw new Error("Invalid number of arguments for Locale " + numArgs);
  }
};

Locale.prototype = {
  /**
   * @private
   * @param {string} locale
   */
  _fromString: function (locale) {
    if (!_.isString(locale)) {
      throw new Error("Invalid type for locale '" + typeof locale + "'");
    }
    
    var parts = locale.match(RxLocale);
    if (parts === null) {
      throw new Error("Locale '" + locale + "' is not valid");
    }

    this._fromParts(parts[1], parts[2]);
  },
  /**
   * @private
   * @param {string}  language
   * @param {string=} country
   */
  _fromParts: function (language, country) {
    if (!RxCode.test(language)) {
      throw new Error("Invalid Language for locale " + language);
    }
    if (country && !RxCode.test(country)) {
      throw new Error("Invalid Country for locale " + locale);
    }
    
    this._language = language.toLowerCase();
    this._country = country ? country.toUpperCase() : null;
  },

  /**
   * @return {string}
   */
  getLanguage: function () {
    return this._language;
  },
  /**
   * @return {null|string}
   */
  getCountry: function () {
    return this._country;
  },
  /**
   * @return {string}
   */
  toString: function () {
    var result = [this._language];
    if (this._country !== null) {
      result.push(this._country);
    }
    return result.join("_");
  }
};
