var RX_LOCALE = /^([A-Za-z]{2,3})(?:[_-]([A-Z][a-z]+))?(?:[_-]([A-Za-z]{2}))?(?:[_-](\w+))?$/;

var RX_LANGUAGE = /^[A-Za-z]{2,3}$/;
var RX_SCRIPT = /^[A-Z][a-z]+$/;
var RX_TERRITORY = /^[A-Za-z]{2}$/;
var RX_VARIATION = /^\w+$/;

  /**
   * new Locale("en");
   * new Locale("en_US");
   * new Locale("en", "US");
   * new Locale("en", "Latn", "US");
   * new Locale("en", "Latn", "US", "POXIS");
   *
   * @constructor
   */
Locale = function () {
  var args = arguments;
  switch (args.length) {
    case 1:
      var locale = args[0];
      if (locale instanceof Locale) {
        locale = locale.toString();
      }
      this._fromString(locale);
      break;
    case 2:
      this._fromParts(args[0], null, args[1]);
      break;
    case 3:
    case 4:
      this._fromParts(args[0], args[1], args[2], args[3]);
      break;
    default:
      throw new Error("Invalid number of arguments for Locale");
  }
};

_.extend(Locale.prototype, {
  /**
   * @private
   * @param {string} locale
   */
  _fromString: function (locale) {
    if (!_.isString(locale)) {
      throw new TypeError("locale expected string, got " + typeof locale);
    }
    
    var parts = locale.match(RX_LOCALE);
    if (parts === null) {
      throw new SyntaxError("Locale '" + locale + "' is not valid");
    }

    this._fromParts.apply(this, parts.slice(1));
  },
  
  /**
   * @private
   * @param {string}  language
   * @param {string=} script
   * @param {string=} territory
   * @param {string=} variant
   */
  _fromParts: function (language, script, territory, variant) {
    if (!RX_LANGUAGE.test(language)) {
      throw new Error("Invalid Language " + language);
    }
    if (script != null && !RX_SCRIPT.test(script)) {
      throw new Error("Inalid script " + script);
    }
    if (territory != null && !RX_TERRITORY.test(territory)) {
      throw new Error("Invalid territory " + territory);
    }
    if (variant != null && !RX_VARIATION.test(variant)) {
      throw new Error("Invalid variant " + variant);
    }
    
    this._language = language.toLowerCase();
    this._script = script || null;
    this._territory = territory != null ? territory.toUpperCase() : null;
    this._variant = variant || null;
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
  getScript: function () {
    return this._script;
  },
  
  /**
   * @return {null|string}
   */
  getTerritory: function () {
    return this._territory;
  },
  
  /**
   * @return {null|string}
   */
  getVariant: function () {
    return this._variant;
  },
  
  /**
   * @return {string}
   */
  toString: function () {
    var result = [this._language, this._script, this._territory, this._variant];
    return _.without(result, null).join("_");
  },

  /**
   * @return {!Locale}
   */
  clone: function () {
    var self = this;
    return new Locale(self._language, self._territory);
  },
  
  /**
   * @return {string}
   */
  toJSONValue: function () {
    return this.toString();
  },
  
  /**
   * @return {string}
   */
  typeName: function () {
    return "Translator.Locale";
  },
  
  /**
   * @param {mixed}
   * @return {boolean}
   */
  roughEquals: function (other) {
    return other instanceof this.constructor
      && this._language === other._language;
  },
  
  /**
   * @param {mixed}
   * @return {boolean}
   */
  equals: function (other) {
    return this.roughEquals(other)
      && this._script === other._script
      && this._territory === other._territory
      && this._variant === other._variant;
  },
  
  /**
   * Weights how equal 2 locales are. The bigger the number the better.
   * 0  = no match
   * 10 = best possible match
   *
   * @param {mixed}
   * @return {number}
   */
  weightDifferences: function (other) {
    if (!(other instanceof this.constructor)) {
      return 0; // always because it needs to be an instance of locale
    }
  
    if (this._language !== other._language) {
      return 0; // still a completly different language
    }
    
    var result = 1; // yeah, we are getting somewhere
    
    if (this._territory === other._territory) {
      result += 6;
    } else if (this._territory == null || other._territory == null) {
      result += 3;
    }
    
    if (this._script === other._script) {
      result += 2;
    } else if (this._script == null || other._script == null) {
      result += 1;
    }
    
    if (this._variant === other._variant) {
      result += 1;
    } else if (this._variant == null || other._variant == null) {
      result += 0.5;
    }
    
    // this weighting is just a quick solution because
    // I have no idea what is how important.
    // please make better suggestions if you know more.
    
    return result;
  }
});


EJSON.addType(Locale.prototype.typeName(), function (string) {
  return new Locale(string);
});
