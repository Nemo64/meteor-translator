var NAMESPACE = "packages/translator/tests/namespace";
var LANGUAGE_FOREIGN = new Translator.LanguageArray("de_DE");
var LANGUAGE_DEFAULT = new Translator.LanguageArray();


Tinytest.add("Namespace - correct path", function (test) {
  var namespace = new Translator.Namespace(NAMESPACE);
  var filename = namespace._filenameForLocale("de_DE");
  test.equal(filename, "/" + NAMESPACE + ".de_DE.lang.yml.json");
});

testAsyncMulti("Namespace - check existence of an existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect(true);
    Deps.autorun(function (dep) {
      var result = namespace.has("a_key", LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        test.isTrue(result);
        expect(true);
      }
    });
  }
]);

testAsyncMulti("Namespace - check existence of a none existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect(true);
    Deps.autorun(function (dep) {
      var result = namespace.has("a_key", LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        test.isFalse(result);
        expect(true);
      }
    });
  }
]);

testAsyncMulti("Namespace - access existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect(true);
    Deps.autorun(function (dep) {
      var result = namespace.has("a_key", LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        test.equal(result, "Hallo Test");
        expect(true);
      }
    });
  }
]);

testAsyncMulti("Namespace - access none existing key", [
  function (test, expect) {
    var namespace = new Translator.Namespace(NAMESPACE);
    var expect = expect(true);
    Deps.autorun(function (dep) {
      var result = namespace.has("a_key", LANGUAGE_FOREIGN);
      if (! namespace.isLoading()) {
        test.equal(result, undefined);
        expect(true);
      }
    });
  }
]);
