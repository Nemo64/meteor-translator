/**
 * @constructor
 * @param {!Language} language
 */
Translator = function (language) {
  var self = this;
  
  self._usedNamespaces = {};
  self._language = null;
  self._languageDep = new Deps.Dependency();
  
  self.setLanguage(language);
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
  
  self._languageDep.changed();
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
  self._languageDep.depend();
  
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
