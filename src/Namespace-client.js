var STATUS_NEW = 1;
var STATUS_LOADING = 2;
var STATUS_LOADED = 4;
var STATUS_MISSING = 8;
var STATUS_ERROR = 16;

/**
 * The namespace is actually a bounch of files but one file per locale. eg.:
 * myTool.en_US.lang.yml
 * myTool.de_DE.lang.yml
 *
 * This is the client implementation which means it uses Dependencies.
 * Also it uses the HTTP interface of Meteor instead of the Asset one.
 *
 * @constructor
 * @private
 * @param {string} name
 */
Namespace.prototype._init = function (name) {
  var self = this;
  
  // get the existing locales from injection
  var namespaces = Injected.obj('translator-namespaces');
  if (! namespaces.hasOwnProperty(self._name)) {
    throw new Error("Namespace '" + self._name + "' does not exist");
  }
  
  self._locales = {}; // see loop in prepare
  self._loading = 0; // for telling if a request is running
  self._loadingDep = new Deps.Dependency(); // only important for #isLoading
  self._localesWarned = false; // "out of locales to load"
  self._existingLocales = namespaces[self._name]; // set of locale strings
};

/**
 * Tells if a reactive call could happen.
 * @return {bool}
 */
Namespace.prototype.isLoading = function () {
  this._loadingDep.depend();
  return this._loading > 0;
};

/**
 * Prepares the Namespace for a language.
 * It may download/interpret files for that.
 * 
 * @param {!Language} language
 */
Namespace.prototype.prepare = function (language) {
  var self = this;
  var locales = language.getLocales();
  
  // prepare data structure for all locales
  _.each(locales, function (locale) {
    var hasLocale = self._locales.hasOwnProperty(locale);
    if (! hasLocale) {
      // data to that locale
      self._locales[locale] = {
        dep: new Deps.Dependency,
        data: {},
        status: self._localeFileExists(locale) ? STATUS_NEW : STATUS_MISSING,
      };
      self._warned = false; // more locales, more warnings
    }
  });
  
  self._prepareLocales(locales);
};

/**
 * @private
 * @param {Locale} locale
 * @return {string}
 */
Namespace.prototype._filenameForLocale = function (locale) {
  return this._name + '.' + locale.toString() + '.lang.yml.json';
};

/**
 * @private
 * @param {Locale} locale
 * @return {boolean}
 */
Namespace.prototype._localeFileExists = function (locale) {
  return this._existingLocales.hasOwnProperty(locale);
};
  
/**
 * @private
 * @param {Array.<string>} locale
 */
Namespace.prototype._prepareLocales = function (locales) {
  var self = this;
  var locale = locales.shift(); // only prepare the first locale
  if (locale == null) {
    if (! self._localesWarned) {
      console.warn("No more locales to load. All hope is lost", self);
      self._localesWarned = true;
    }
    return;
  }
  
  var localeData = self._locales[locale];
  switch (localeData.status) {
    case STATUS_NEW:
      self._loadLocale(locale, localeData);
      break;
    case STATUS_MISSING:
    case STATUS_ERROR:
      self._prepareLocales(locales); // locales is already shifted
      break;
  }
};

/**
 * @private
 * @param {Locale} locale
 * @param {object} localeData
 */
Namespace.prototype._loadLocale = function (locale, localeData) {
  var self = this;
  self._loading++;
  self._loadingDep.changed();
  localeData.status = STATUS_LOADING;
  var filename = self._filenameForLocale(locale);
  HTTP.get('/' + filename, function (error, data) {
    self._loading--;
    self._loadingDep.changed();
    localeData.status = STATUS_LOADED;
    
    if (error) {
      localeData.status = STATUS_ERROR;
      self._loadError(locale, filename, error);
      self._prepareLocale(locales); // prepare the next locale
    } else try {
      localeData.data = JSON.parse(data.content);
    } catch (e) {
      self._loadError(locale, filename, e);
    }
    
    localeData.dep.changed();
  });
};
  
/**
 * @param {string}    key
 * @param {!Language} language
 * @return {undefined|mixed}
 */
Namespace.prototype.get = function (key, language) {
  var self = this;
  self.prepare(language);
  
  if (! Deps.active) {
    console.warn(
      "translation of '" + key + "' reqested outside of an reactive pipe!"
      + " Cross your fingers that everything is loaded already"
    );
  }
  
  // check all locales of the language
  var locales = language.getLocales();
  var matchedLocale = _.find(locales, function (locale, index) {
    var localeData = self._locales[locale]; // must exist because we prepared the lang
    localeData.dep.depend(); // file could change if it is not loaded yet
    
    // because this implementation only loads the first locale the fallback is
    // never prepared. If it is needed to it now
    if (! localeData.loaded) {
      self._prepareLocales(locales.slice(index)); // this and all after this
      return true; // this is our current best match (none :D)
    }
    
    return localeData.data.hasOwnProperty(key);
  });
  
  return matchedLocale != null
    ? self._locales[matchedLocale].data[key]
    : undefined;
};
