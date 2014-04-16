var LanguageArray = Translator.LanguageArray;
var detect = function (acceptLanugage) {
  var headers = {
    'accept-language': acceptLanugage
  };
  return Translator._createLangaugeArrayFromHeader(headers);
};
// normalize the testing envirement
Translator.setLanguage(null); // ignore automated sources
Translator.setDefaultLanguage('en_US');


// XXX all these accept-language header strings were created using firefox
// it might be required to get if from more browsers

Tinytest.add("Translator - accept-language - normal detection", function (test) {
  var language = detect('en-us,en;q=0.5');
  test.equal(language, new LanguageArray(['en_US', 'en']));
});

Tinytest.add("Translator - accept-language - detection + fallback", function (test) {
  var language = detect('de-de,de;q=0.5');
  test.equal(language, new LanguageArray(['de_DE', 'de', 'en_US']));
});

Tinytest.add("Translator - accept-language - a lot of languages", function (test) {
  var language = detect('en-zw,en-us;q=0.92,en-gb;q=0.85,en-tt;q=0.77,en-za;q=0.69,en-ph;q=0.62,en-nz;q=0.54,en-jm;q=0.46,en-ie;q=0.38,en;q=0.31,en-ca;q=0.23,en-bz;q=0.15,en-au;q=0.08');
  test.equal(language, new LanguageArray('en_ZW en_US en_GB en_TT en_ZA en_PH en_NZ en_JM en_IE en en_CA en_BZ en_AU'.split(' ')));
});

Tinytest.add("Translator - accept-language - wrong order", function (test) {
  var language = detect('en;q=0.5,en-us');
  test.equal(language, new LanguageArray(['en_US', 'en']));
});

Tinytest.add("Translator - accept-language - without the header", function (test) {
  var language = Translator._createLangaugeArrayFromHeader({});
  test.equal(language, new LanguageArray(['en_US']));
});
