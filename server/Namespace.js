/**
 * The namespace is actually a bounch of files but one file per locale. eg.:
 * myTool.en_US.lang.yml
 * myTool.de_DE.lang.yml
 *
 * This is the server implementation which means it blocks.
 *
 * @protected use Namespace.instance(name) instead
 * @constructor
 * @param {string} name
 */
Namespace = function (name) {
  var self = this;
  
  NamespaceAbstract.apply(self, arguments);
  self._files = {}; // { "locale": { data: JSON } }
};

_.extend(Namespace, NamespaceAbstract); // cheap extend
_.extend(Namespace.prototype, NamespaceAbstract.prototype);

/**
 * Tells if a reactive call could happen.
 *
 * @return {bool}
 */
Namespace.prototype.isLoading = function () {
  return false;
};

/**
 * Prepares the Namespace for a language.
 * It may download/interpret files for that.
 * 
 * @param {!Language} language
 */
Namespace.prototype.prepare = function (language) {
  var self = this;
  
  // other than the client implementation we prepare all locales
  _.each(language.getLocales(), function (locale) {
    var filename = self._filenameForLocale(locale);
    
    try {
      var text = Assets.getText(filename);
      self._files[locale] = {
        data: JSON.parse(text)
      };
    } catch (e) {
      self._loadError(locale, filename, e);
    }
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
  
  var file = _.find(self._files, function (file) {
    return file.data.hasOwnProperty(key);
  });
  return file != null ? file.data[key] : undefined;
};
