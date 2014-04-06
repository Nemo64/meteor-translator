/**
 * The namespace is actually a bounch of files but one file per locale. eg.:
 * myTool.en_US.lang.yml
 * myTool.de_DE.lang.yml
 *
 * This is the server implementation which means it blocks.
 *
 * @protected
 * @constructor
 * @param {string} name
 */
NamespaceAbstract = function (name) {
  var self = this;
  
  self._name = name;
};

/**
 * This variable will be created at runtime and would make problems here.
 *
 * @private
 * @type {Object.<string, !NamespaceAbstract>}
 */
//NamespaceAbstract._instances = {};

/**
 * @param {string} filename
 * @return {!NamespaceAbstract}
 */
NamespaceAbstract.instance = function (name) {
  var self = this; // reference to the Namespace implementation
  self.hasOwnProperty('_instances') || (self._instances = {}); // create instances
  
  var hasInstance = self._instances.hasOwnProperty(name)
                 && self._instances[name] instanceof self;
  if (! hasInstance) {
    self._instances[name] = new self(name);
  }
  
  return self._instances[name];
};

/**
 * @protected
 * @param {string} locale
 * @param {string} filename
 * @param {mixed}  error    additional error information
 */
NamespaceAbstract.prototype._loadError = function (locale, filename, error) {
  console.error(
    "couldn't load translation namespace '"
    + this._name + "' for locale '" + locale + "'"
    + "tried to access '" + filename + "' ",
    error.message, error
  );
};

/**
 * @protected
 * @param {string} locale
 * @return {string}
 */
NamespaceAbstract.prototype._filenameForLocale = function (locale) {
  return this._name + '.' + locale + '.lang.yml.json';
};

/**
 * Tells if a reactive call could happen. This is true if a call to ::get()
 * has not found a match but there are fallbacks that are loading right now.
 *
 * This is mostly usefull for tests but can also come in handy if you try to
 * do something that shouldn't be recomputed like:
 *
 * var message = translator.get("messages.my_message");
 * if (! translator.isLoading()) {
 *   sendMessage(message);
 *   Deps.currentComputation.stop();
 * }
 *
 * @return {bool}
 */
//NamespaceAbstract.prototype.isLoading = function () {
//  return false;
//};

/**
 * Prepares the Namespace for a language.
 * It may download/interpret files for that.
 * The call to this method should be optional!
 * 
 * @param {!Language} language
 */
//NamespaceAbstract.prototype.prepare = function (language) {
//  throw new Error("missing implementation of NamespaceAbstract::prepare");
//};

/**
 * Has to return the value of the given key.
 * If there is no value return undefined, not null!
 *
 * @param {string}    key
 * @param {!Language} language
 * @return {undefined|mixed}
 */
//NamespaceAbstract.prototype.get = function (key, language) {
//  throw new Error("missing implementation of NamespaceAbstract::get");
//};

/**
 * @param {string}    key
 * @param {!Language} language
 * @return {bool}
 */
NamespaceAbstract.prototype.has = function (key, language) {
  return this.get(key, language) !== undefined;
};

/**
 * Simply returns the name of this namespace.
 *
 * @return {string}
 */
NamespaceAbstract.prototype.toString = function () {
  return this._name;
};
