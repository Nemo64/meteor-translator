var DEFAULT_LOCALE = [new Translator.Locale("en_US")];

var NORMAL_LOCALES_STRING = ["de_DE", "en_US"];
var NORMAL_LOCALES_INSTANCE = [
  new Translator.Locale("de", "DE"),
  new Translator.Locale("en", "US")
];




Tinytest.add("Translator - LanguageArray - with string array", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_STRING);
  test.equal(language.getLocales(), NORMAL_LOCALES_INSTANCE);
  test.equal(language.getLocale(), NORMAL_LOCALES_INSTANCE[0]);
});




Tinytest.add("Translator - LanguageArray - with a string", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_STRING[0]);
  test.equal(language.getLocales(), [NORMAL_LOCALES_INSTANCE[0]]);
  test.equal(language.getLocale(), NORMAL_LOCALES_INSTANCE[0]);
});





Tinytest.add("Translator - LanguageArray - with Locale instances", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_INSTANCE);
  test.equal(language.getLocales(), NORMAL_LOCALES_INSTANCE);
  test.equal(language.getLocale(), NORMAL_LOCALES_INSTANCE[0]);
});





Tinytest.add("Translator - LanguageArray - without parameter", function (test) {
  var language = new Translator.LanguageArray();
  test.equal(language.getLocales(), []);
  test.equal(language.getLocale(), undefined);
});





Tinytest.add("Translator - LanguageArray - merge", function (test) {
  var language1 = new Translator.LanguageArray('de_DE');
  var language2 = new Translator.LanguageArray(['de_DE', 'en_US']);
  var result = language1.merge(language2);
  var expect = new Translator.LanguageArray(['de_DE', 'en_US']);
  test.equal(result, expect);
});





Tinytest.add("Translator - LanguageArray - equals", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_INSTANCE);
  var other = new Translator.LanguageArray(NORMAL_LOCALES_INSTANCE);
  test.isTrue(language.equals(other));
});




var wrongLocales = {
  "a number": 5,
  "an array of numbers": [1,2,3],
  //"an empty array": [],
  "an invalid locale string": ["james bond"],
  "null in array": [null]
};
_.each(wrongLocales, function (locales, name) {
  Tinytest.add("Translator - LanguageArray - type fail - with " + name, function (test) {
    try {
      new Translator.LanguageArray(locales);
      test.fail();
    } catch (e) {
      test.instanceOf(e, Error);
    }
  });
});




Tinytest.add("Translator - LanguageArray - ejson normal", function (test) {
  var language = new Translator.LanguageArray(NORMAL_LOCALES_INSTANCE);
  var string = EJSON.stringify(language);
  var parsed = EJSON.parse(string);
  test.equal(language, parsed);
});




Tinytest.add("Translator - LanguageArray - ejson empty", function (test) {
  var language = new Translator.LanguageArray();
  var string = EJSON.stringify(language);
  var parsed = EJSON.parse(string);
  test.equal(language, parsed);
});
