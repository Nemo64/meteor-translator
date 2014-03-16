/**
 * @constructor
 * @param {!Language} language
 */
Translator = function (language) {
  var self = this;
  
  self._usedNamespaces = {};
  self._namespaceDep = new Deps.Dependency();
  self._language = null;
  
  self.setLanguage(language);
};

/**
 * Tells if there is a loading process going on.
 * If true the #get method might trigger a recompution and give wrong results.
 *
 * @return {boolean}
 */
Translator.prototype.isLoading = function () {
  this._namespaceDep.depend();
  return _.any(self._usedNamespaces, function (namespace) {
    return namespace.isLoading();
  });
};

/**
 * Calls the callback once when the translator in it's current state is ready.
 * If the secound parameter is provided, it will be called whenever the
 * translator is ready (eg. after the language was changed)
 *
 * @param {function()} callback
 * @param {boolean=}   repeat
 */
Translator.prototype.ready = function (callback, repeat) {
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
          obj.dep.depend();
        });
      });
    }
    
    // callback
    if (! self.isLoading()) {
      repeat || c.stop();
      callback();
    }
  });
};

/**
 * Changes the language of this translator and any dependency gets updated.
 *
 * @param {!LanguageArray|Array.<(Locale|string)>|string}
 */
Translator.prototype.setLanguage = function (language) {
  var self = this;

  if (language instanceof LanguageArray) {
    self._language = language;
  } else {
    self._language = new LanguageArray(language);
  }
  
  _.each(self._usedNamespaces, function (namespace) {
    namespace.prepare(self._language);
  });
};

/**
 * Adds a file to the lookup list.
 * Doing this twice will have no effect so don't worry about it.
 *
 * @param {string} filename
 */
Translator.prototype.use = function (filename) {
  var self = this;
  var alreadyUsed = self._usedNamespaces.hasOwnProperty(filename);
  if (! alreadyUsed) {
    var namespace = Namespace.instance(filename);
    self._usedNamespaces[filename] = namespace;
    namespace.prepare(self._language);
    self._namespaceDep.changed();
  }
};

/**
 * Looks up the string for the key. All used namespaces will be looked at.
 * The first namespace which has the result will be returned.
 *
 * @param {string}          key
 * @param {Array.<string>=} parameter
 * @param {Language=}       language
 *
 * @return {mixed}
 */
Translator.prototype.get = function (key, parameter, language) {
  var self = this;
  language = language || self._language;
  
  var namespace = _.find(self._usedNamespaces, function (namespace) {
    return namespace.has(key, language);
  });
  
  return namespace ? namespace.get(key, language) : key;
};

/**
 * This is the same as #get but it returns a function.
 * The returned function will then return the result.
 * This is usefull as the function is reactive.
 *
 * @param {string}          key
 * @param {Array.<string>=} parameter
 * @param {Language=}       language
 *
 * @return {function():string}
 */
Translator.prototype.getCallback = function (key, parameter, language) {
  return _.bind(this.get, this, key, parameter, language);
};
