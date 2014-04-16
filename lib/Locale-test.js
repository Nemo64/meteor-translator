var LOCALE = "en_US";
var LOCALE_LANG = "en";
var LOCALE_COUN = "US";





Tinytest.add("Translator - Locale - without value", function (test) {
  try {
    var locale = new Translator.Locale();
    test.isTrue(false);// XXX test.fail() does not work on client
  } catch (e) {
    test.instanceOf(e, Error);
  }
});





Tinytest.add("Translator - Locale - with string", function (test) {
  var locale = new Translator.Locale(LOCALE);
  test.equal(locale.getLanguage(), LOCALE_LANG);
  test.equal(locale.getTerritory(), LOCALE_COUN);
  test.equal(locale.toString(), LOCALE);
});





Tinytest.add("Translator - Locale - with language and country", function (test) {
  var locale = new Translator.Locale(LOCALE_LANG, LOCALE_COUN);
  test.equal(locale.getLanguage(), LOCALE_LANG);
  test.equal(locale.getTerritory(), LOCALE_COUN);
  test.equal(locale.toString(), LOCALE);
});





Tinytest.add("Translator - Locale - only with language", function (test) {
  var locale = new Translator.Locale(LOCALE_LANG);
  test.equal(locale.getLanguage(), LOCALE_LANG);
  test.equal(locale.getTerritory(), null);
  test.equal(locale.toString(), LOCALE_LANG);
});





Tinytest.add("Translator - Locale - give locale and country", function (test) {
  try {
    var locale = new Translator.Locale(LOCALE, LOCALE_COUN);
    test.fail();
  } catch (e) {
    test.instanceOf(e, Error);
  }
});





var wrongValues = {
  "a number": 5,
  "a wrong string": "bla",
  "an array": []
};
_.each(wrongValues, function (value1, name1) {
  Tinytest.add("Translator - Locale - give " + name1 + " as a language/locale", function (test) {
    try {
      new Translator.Locale(value1);
      test.isTrue(false);// XXX test.fail() does not work on client
    } catch (e) {
      test.instanceOf(e, Error);
    }
  });
  
  _.each(wrongValues, function (value2, name2) {
    Tinytest.add("Translator - Locale - give " + name1 + " and " + name2, function (test) {
      try {
        new Translator.Locale(value1, value2);
        test.isTrue(false);// XXX test.fail() does not work on client
      } catch (e) {
        test.instanceOf(e, Error);
      }
    });
  });
});





Tinytest.add("Translator - Locale - equals", function (test) {
  var locale1 = new Translator.Locale(LOCALE_LANG, LOCALE_COUN);
  var locale2 = new Translator.Locale(LOCALE_LANG, LOCALE_COUN);
  test.isTrue(locale1.equals(locale2));
});
