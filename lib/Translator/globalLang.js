
/**
 * This is the global language used by every translator
 * that has not other specified language.
 *
 * @var {!LanguageArray}
 */
Translator._globalLang = new LanguageArray();
Translator._globalLangDep = new Deps.Dependency();

Translator.setLanguage = function (language) {
  var self = this; // we know our context, but still
  
  self._globalLang = LanguageArray.make(language);
  self._globalLangDep.changed();
}

Translator.getLanguage = function () {
  return this._globalLang;
}
