var RX_LOCALE = /^([A-Za-z]{2})(?:[_-]([A-Za-z]{2}))$/m;
var RX_CODE = /^[A-Za-z]{2}$/m;

Locale = function (locale, country) {
  var numArgs = arguments.length;
  
  if (numArgs === 0 || locale == null) {
    this._fromParts("en", "US"); // default
  }
  
  else if (numArgs === 1) {
    var arg = locale;
    if (arg instanceof Locale) {
      this._fromParts(arg._language, arg._country);
    } else if (RX_CODE.test(arg)) {
      this._fromParts(arg);
    } else {
      this._fromString(arg);
    }
  }
  
  else if (numArgs === 2) {
    this._fromParts(locale, country);
  } else {
    throw new Error("Invalid number of arguments for Locale " + numArgs);
  }
};

  /**
   * @private
   * @param {string} locale
   */
Locale.prototype._fromString = function (locale) {
  if (!_.isString(locale)) {
    throw new Error("Invalid type for locale '" + typeof locale + "'");
  }
  
  var parts = locale.match(RX_LOCALE);
  if (parts === null) {
    throw new Error("Locale '" + locale + "' is not valid");
  }

  this._fromParts(parts[1], parts[2]);
};
/**
 * @private
 * @param {string}  language
 * @param {string=} country
 */
Locale.prototype._fromParts = function (language, country) {
  if (!RX_CODE.test(language)) {
    throw new Error("Invalid Language for locale " + language);
  }
  if (country && !RX_CODE.test(country)) {
    throw new Error("Invalid Country for locale " + locale);
  }
  
  this._language = language.toLowerCase();
  this._country = country ? country.toUpperCase() : null;
};

/**
 * @return {string}
 */
Locale.prototype.getLanguage = function () {
  return this._language;
},
/**
 * @return {null|string}
 */
Locale.prototype.getCountry = function () {
  return this._country;
};
/**
 * @return {string}
 */
Locale.prototype.toString = function () {
  var result = [this._language];
  if (this._country !== null) {
    result.push(this._country);
  }
  return result.join("_");
};

/**
 * @return {!Locale}
 */
Locale.prototype.clone = function () {
  var self = this;
  return new Locale(self._language, self._country);
};
/**
 * @return {string}
 */
Locale.prototype.toJSONValue = function () {
  return this.toString();
};
/**
 * @return {string}
 */
Locale.prototype.typeName = function () {
  return "Translator.Locale";
};
/**
 * @param {mixed}
 * @return {boolean}
 */
Locale.prototype.roughEquals = function (other) {
  return other instanceof this.constructor
    && this._country === other._country;
}
/**
 * @param {mixed}
 * @return {boolean}
 */
Locale.prototype.equals = function (other) {
  return this.roughEquals(other)
    && this._language === other._language;
};


EJSON.addType(Locale.prototype.typeName(), function (string) {
  return new Locale(string);
});
