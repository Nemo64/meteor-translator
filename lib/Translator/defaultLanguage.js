// the default language will be appended to the autodetected languages
// this is to always provide a language no matter
// if the language is implemented or not
Translator._defaultLanguage = new LanguageArray('en_US');
Translator.setDefaultLanguage = function (language) {
  language = LanguageArray.make(language); // throws error if wrong parameter
  this._defaultLanguage = language;
  // XXX the server implementation of the translator does not yet depend
  // on the autodetected language and therefor does not need to reactively
  // change if this value gets modified. That might change in the future
};
