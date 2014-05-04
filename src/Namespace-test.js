var NAMESPACE = 'packages/translator/test/namespace';
var LANGUAGE_FOREIGN = new Translator.LanguageArray('de_DE');
var LANGUAGE_DEFAULT = new Translator.LanguageArray();

if (Meteor.isClient) {
  Tinytest.add("Translator - Namespace - correct path", function (test) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var filename = namespace._filenameForLocale('de_DE');
    var expect = NAMESPACE + '.de_DE.lang.yml.json';
    test.equal(filename, expect, "the language and format should be appended");
  });
}

testAsyncMulti("Translator - Namespace - check existence of an existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect(true);
    Deps.autorun(function (dep) {
      var result = namespace.has('a_key', LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        expect(result);
      }
    });
  }
]);

testAsyncMulti("Translator - Namespace - check existence of a none existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect(false);
    Deps.autorun(function (dep) {
      var result = namespace.has('not_a_key', LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        expect(result);
      }
    });
  }
]);

testAsyncMulti("Translator - Namespace - access existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect("Hallo Test");
    Deps.autorun(function (dep) {
      var result = namespace.get('a_key', LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        expect(result.value);
      }
    });
  }
]);

testAsyncMulti("Translator - Namespace - access none existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect(undefined);
    Deps.autorun(function (dep) {
      var result = namespace.get('not_a_key', LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        expect(result.value);
      }
    });
  }
]);

Tinytest.add("Translator - Namespace - none existing namespace", function (test) {
  try {
    var namespace = new Translator.Namespace("none existing namespace");
    test.isTrue(false);
  } catch (e) {
    test.instanceOf(e, Error);
  }
});
