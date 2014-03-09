var DEFAULT_LOCALE = [new Translator.Locale("en_US")];

var NORMAL_LOCALES_STRING = ["de_DE", "en_US"];
var NORMAL_LOCALES_INSTANCE = [
  new Translator.Locale("de", "DE"),
  new Translator.Locale("en", "US")
];




Tinytest.add("LanguageArray - with string array", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_STRING);
  test.equal(language.getLocales(), NORMAL_LOCALES_INSTANCE);
  test.equal(language.getLocale(), NORMAL_LOCALES_INSTANCE[0]);
});




Tinytest.add("LanguageArray - with a string", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_STRING[0]);
  test.equal(language.getLocales(), [NORMAL_LOCALES_INSTANCE[0]]);
  test.equal(language.getLocale(), NORMAL_LOCALES_INSTANCE[0]);
});





Tinytest.add("LanguageArray - with Locale instances", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_INSTANCE);
  test.equal(language.getLocales(), NORMAL_LOCALES_INSTANCE);
  test.equal(language.getLocale(), NORMAL_LOCALES_INSTANCE[0]);
});





Tinytest.add("LanguageArray - without parameter", function (test) {
  var language = new Translator.LanguageArray();
  test.equal(language.getLocales(), DEFAULT_LOCALE);
  test.equal(language.getLocale(), DEFAULT_LOCALE[0]);
});




var wrongLocales = {
  "a number": 5,
  "an array of numbers": [1,2,3],
  //"an empty array": [],
  "an invalid locale string": ["james bond"],
  "null in array": [null]
};
_.each(wrongLocales, function (locales, name) {
  Tinytest.add("LanguageArray - wrong with " + name, function (test) {
    try {
      new Translator.LanguageArray(locales);
      test.fail();
    } catch (e) {
      test.instanceOf(e, Error);
    }
  });
});

