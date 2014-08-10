/**
 * @constructor
 * @param {!Language} language
 */
Translator = function (language) {
  var self = this;
  
  self._usedNamespaces = {};
  self._namespaceDep = new Deps.Dependency();
  self._language = null;
  self._languageDep = new Deps.Dependency();
  
  self.setLanguage(language);
  
  Deps.autorun(function () {
    self._namespaceDep.depend();
    
    // if what we get is the global lang it might rerun
    _.each(self._usedNamespaces, function (namespace) {
      namespace.prepare(self.getLanguage());
    });
  });
};

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
    this._namespaceDep.depend();
    return _.any(this._usedNamespaces, function (namespace) {
      return namespace.isLoading();
    });
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

    if (! _.isFunction(callback)) {
      throw new Error("Translator ready callback is not a function");
    }
    Deps.autorun(function (c) {
      // only depend on the namespace in client because the server implementation
      // is synchron and therefor doesn't have these dependencies
      if (Meteor.isClient) {
        _.each(self._usedNamespaces, function (namespace) {
          // TODO find a more obvious way instead of accessing a private member
          _.each(namespace._locales, function (obj) {
            obj.dep.depend(); // subscribe to changes of the locale files
          });
        });
      }
      
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
    Deps.flush(); // call prepare immediately to prevent isLoaded to be false directly after
    // FIXME there shouldn't be a global flush here
  },
  
  /**
   * Gets the current language. If no language is defined
   *
   * @param {boolean} reactive
   * @return {!LanguageArray}
   */
  getLanguage: function (reactive) {
    var self = this;

    if (self._language != null) {
      self._languageDep.depend();
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
    var self = this;
    var alreadyUsed = self._usedNamespaces.hasOwnProperty(filename);
    if (! alreadyUsed) Deps.nonreactive(function () {
      var namespace = Namespace.instance(filename);
      namespace.prepare(self.getLanguage());
      self._usedNamespaces[filename] = namespace;
      self._namespaceDep.changed();
    });
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
    
    var namespace = _.find(self._usedNamespaces, function (namespace) {
      return namespace.has(key, language);
    });
    
    if (namespace != null) {
      // no dependency required as new namespaces will be appended to the list
      var result = namespace.get(key, language);
      var data = {
        key: key, // for warnings etc.
        language: language,
        locale: result.locale,
        parameters: parameters || {},
        translator: self,
        meta: result.meta
      };
      return self.filter(result.value, data);
    }
    
    // if the translation fails...
    self._namespaceDep.depend(); // it might come later
    
    if (! this.isLoading() && typeof console !== 'undefined') {
      console.warn("Translation for key '" + key + '" is missing!');
    }
    
    return null;
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
