/**
 * @constructor
 * @param {!Language} language
 */
Translator = function (language) {
  var self = this;
  
  self._language = null;
  self._languageDep = new Tracker.Dependency();
};

/**
 * This object will contain all translation data available.
 * The key is the string representation of the key.
 * The value is an object with the key value pairs.
 *
 * On the Server side:
 * This variable will be filled by the resoure handler on the server side.
 *
 * On the Client side:
 * The client does not have it so it needs to be transfered there.
 * The requesting/sending happens in the server/client variants of this file.
 *
 * @type {Object.<string, Object.<string, mixed>>}
 */
Translator._data = {};

/**
 * This dependency gets changed whenever _data changes.
 * 
 * Only really needed on the client but it doesn't hurt on the server.
 */
Translator._dataDep = new Tracker.Dependency();

/**
 * This variables keeps instances of Locale.
 * If one is in here, it must be available in _data.
 */
Translator._availableLocales = {};

/**
 * This FilterList will be applied first. The result MUST be a string!
 *
 * @type {!FilterList}
 */
Translator.objectFilter = new FilterList("objectFilter", _.isString);

/**
 * When these filters are reached the data is already garanteed to be a string.
 * Here parameters should be inserted.
 *
 * @type {!FilterList}
 */
Translator.stringFilter = new FilterList("stringFilter", _.isString);


_.extend(Translator.prototype, {
  
  /**
   * Tells if there is a loading process going on.
   * If true the #get method might trigger a recompution and give wrong results.
   *
   * @return {boolean}
   */
  isLoading: function () {
    throw new Error("Implementation of Translator#isLoading missing");
  },

  /**
   * Calls the callback once when the translator in it's current state is ready.
   * If the secound parameter is provided, it will be called whenever the
   * translator is ready (eg. after the language was changed)
   *
   * @param {function()} callback
   * @param {boolean=}   repeat
   */
  ready: function (callback, repeat) {
    var self = this;

    Tracker.autorun(function (c) {
      self._languageDep.depend();
      
      // callback
      if (! self.isLoading()) {
        repeat || c.stop();
        callback();
      }
    });
  },

  /**
   * Changes the language of this translator and any dependency gets updated.
   *
   * @param {!LanguageArray|Array.<(Locale|string)>|string|null}
   */
  setLanguage: function (language) {
    var self = this;
    var before = self._language;
    
    if (language !== Translator._globalLang && language != null) {
      self._language = LanguageArray.make(language);
    } else {
      self._language = null; // global language
    }
    
    if (before != self._language) {
      self._languageDep.changed();
    }
  },
  
  /**
   * Gets the current language. If no language is defined
   *
   * @return {!LanguageArray}
   */
  getLanguage: function () {
    var self = this;
    self._languageDep.depend();

    if (self._language != null) {
      return self._language;
    } else {
      // _globalLang is defined in globalLang.js
      Translator._globalLangDep.depend();
      return Translator._globalLang;
    }
  },

  /**
   * Adds a file to the lookup list.
   * Doing this twice will have no effect so don't worry about it.
   *
   * @param {string} filename
   */
  use: function (filename) {
    console.warn("Translator.use() is deprecated and does nothing now! Simply remove it from your code");
  },


  /**
   * Looks up the string for the key. All used namespaces will be looked at.
   * The first namespace which has the result will be returned.
   *
   * @param {string}          key
   * @param {Array.<string>=} parameters
   *
   * @return {mixed}
   */
  get: function (key, parameters) {
    var self = this;
    var language = self.getLanguage();
    Translator._dataDep.depend();
    
    var locales = language.prioritizeLocales(Translator._availableLocales);
    var locale = _.find(locales, function (locale) {
      return Translator._data[locale.toString()].hasOwnProperty(key);
    });
    
    // not found? then null
    if (locale == null) {
      return null;
    }
    
    var result = Translator._data[locale.toString()][key];
  
    // this data object will contain all information 
    var data = {
      key: key, // for warnings etc.
      language: language,
      locale: result.locale,
      parameters: parameters || {},
      translator: self,
      meta: result.meta
    };
    
    return this.filter(result, data);
  },

  /**
   * Applies all translation filters to the given string
   *
   * @param {string} string
   * @param {Object.<string, *>} options
   * @return {string}
   */
  filter: function (string, options) {
    string = Translator.objectFilter.filter(string, options);
    string = Translator.stringFilter.filter(string, options);
    return string;
  },

  /**
   * This is the same as #get but it returns a function.
   * The returned function will then return the result.
   * This is usefull as the function is reactive.
   *
   * @param {string}          key
   * @param {Array.<string>=} parameter
   *
   * @return {function():string}
   */
  getCallback: function (key, parameter) {
    return _.bind(this.get, this, key, parameter);
  },

  createHelper: function () {
    var self = this;
    return function (key, kw) {
      return self.get(key, _.isObject(kw) ? kw.hash : {});
    }
  }
});
