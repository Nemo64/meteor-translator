var LOCALE = "en_US";
var LOCALE_LANG = "en";
var LOCALE_COUN = "US";
var values = {
  "en_US":       ["en", null  , "US", null   , "en_US"],
  "en-us":       ["en", null  , "US", null   , "en_US"],
  "en":          ["en", null  , null, null   , "en"],
  "kk_Cyrl_KZ":  ["kk", "Cyrl", "KZ", null   , "kk_Cyrl_KZ"],
  "ewo_CM":      ["ewo",null  , "CM", null   , "ewo_CM"],
  "en_US_POSIX": ["en", null  , "US", "POSIX", "en_US_POSIX"],
  "eo_001":      ["eo", null  , null, "001"  , "eo_001"] // XXX is that right?
};




_.each(values, function (parts, locale) {
  Tinytest.add("Translator - Locale - with string '" + locale + "'", function (test) {
    var instance = new Translator.Locale(locale);
    test.equal(instance.getLanguage(), parts[0]);
    test.equal(instance.getScript(), parts[1]);
    test.equal(instance.getTerritory(), parts[2]);
    test.equal(instance.getVariant(), parts[3]);
    test.equal(instance.toString(), parts[4]);
  });
});




_.each(values, function (parts, locale) {
  Tinytest.add("Translator - Locale - with language and terretory for '" + locale + "'", function (test) {
    var instance = new Translator.Locale(parts[0], parts[2]);
    test.equal(instance.getLanguage(), parts[0]);
    test.equal(instance.getScript(), null);
    test.equal(instance.getTerritory(), parts[2]);
    test.equal(instance.getVariant(), null);
  });
});




_.each(values, function (parts, locale) {
  Tinytest.add("Translator - Locale - only with language for '" + locale + "'", function (test) {
    var instance = new Translator.Locale(parts[0], null);
    test.equal(instance.getLanguage(), parts[0]);
    test.equal(instance.getScript(), null);
    test.equal(instance.getTerritory(), null);
    test.equal(instance.getVariant(), null);
  });
});





Tinytest.add("Translator - Locale - fail - without value", function (test) {
  try {
    var locale = new Translator.Locale();
    test.isTrue(false);// XXX test.fail() does not work on client
  } catch (e) {
    test.instanceOf(e, Error);
  }
});





Tinytest.add("Translator - Locale - fail - give locale and country", function (test) {
  try {
    var locale = new Translator.Locale("en_US", "US");
    test.isTrue(false);// XXX test.fail() does not work on client
  } catch (e) {
    test.instanceOf(e, Error);
  }
});





var wrongValues = {
  "a number": 5,
  "a wrong string": "four",
  "an array": [],
  "null": null
};
_.each(wrongValues, function (value1, name1) {
  Tinytest.add("Translator - Locale - fail - with " + name1, function (test) {
    try {
      new Translator.Locale(value1);
      test.isTrue(false);// XXX test.fail() does not work on client
    } catch (e) {
      test.instanceOf(e, Error);
    }
  });
  
  _.each(wrongValues, function (value2, name2) {
    Tinytest.add("Translator - Locale - fail - with " + name1 + " and " + name2, function (test) {
      try {
        new Translator.Locale(value1, value2);
        test.isTrue(false);// XXX test.fail() does not work on client
      } catch (e) {
        test.instanceOf(e, Error);
      }
    });
  });
});



_.each(values, function (parts, locale) {
  Tinytest.add("Translator - Locale - equals '" + locale + "'", function (test) {
    var instance1 = new Translator.Locale(parts[0], null);
    var instance2 = new Translator.Locale(parts[0], null);
    test.isTrue(instance1.equals(instance2));
  });
});
