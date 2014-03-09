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
Namespace = function (name) {
  var self = this;
  
  NamespaceAbstract.apply(self, arguments);
  self._locales = {}; // see loop in prepare
  self._loading = 0; // for telling if a request is running
};

_.extend(Namespace, NamespaceAbstract); // cheap extend
_.extend(Namespace.prototype, NamespaceAbstract.prototype);

/**
 * Tells if a reactive call could happen.
 * @return {bool}
 */
Namespace.prototype.isLoading = function () {
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
        loaded: false
      };
    }
  });
  
  self._prepareLocales(locales);
};
  
/**
 * @private
 * @param {Array.<string>} locale
 */
Namespace.prototype._prepareLocales = function (locales) {
  var self = this;
  var locale = locales.shift(); // only prepare the first locale
  
  var localeData = self._locales[locale];
  if (! localeData.loaded) {
    
    // start loading the file
    var filename = self._filenameForLocale(locale);
    self._loading++;
    HTTP.get(filename, function (error, data) {
      self._loading--;
      localeData.loaded = true;
      
      if (error) {
        self._loadError(locale, filename, error);
        if (locales.length > 0) {
          self._prepareLocale(locales); // prepare the next locale
        } else {
          console.error("No more locales to load. All hope is lost");
        }
        return;
      }
      
      try {
        localeData.data = JSON.parse(data.content);
        localeData.dep.changed();
      } catch (e) {
        self._loadError(locale, filename, e);
      }
      
    });
  }
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
  var locale = _.find(locales, function (locale, index) {
    var localeData = self._locales[locale]; // must exist because we prepared the lang
    localeData.dep.depend(); // file could change if it is not loaded yet
    
    // because this implementation only loads the first locale the fallback is
    // never prepared. If it is needed to it now
    if (! localeData.loaded) {
      self._prepareLocales(locales.slice(index)); // all locales left
      return true; // this is our current best match (none :D)
    }
    
    return localeData.data.hasOwnProperty(key);
  });
  
  return locale != null ? self._locales[locale].data[key] : undefined;
};
