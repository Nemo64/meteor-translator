var NAMESPACE = "packages/translator/tests/namespace";
var LANGUAGE_FOREIGN = new Translator.LanguageArray("de_DE");
var LANGUAGE_DEFAULT = new Translator.LanguageArray();

Tinytest.add("Namespace - correct path", function (test) {
  var namespace = new Translator.Namespace(NAMESPACE);
  var filename = namespace._filenameForLocale("de_DE");
  test.equal(filename, "/" + NAMESPACE + ".de_DE.lang.yml.json");
});

Tinytest.add("Namespace - check existence of an existing key", function (test) {
  var namespace = new Translator.Namespace(NAMESPACE);
  Deps.autorun(function (dep) {
    var result = namespace.has("a_key", LANGUAGE_FOREIGN);
    if (! namespace.isLoading()) {
      test.equal(result, true);
    }
  });
});

Tinytest.add("Namespace - check existence of a none existing key", function (test) {
  var namespace = new Translator.Namespace(NAMESPACE);
  Deps.autorun(function (dep) {
    var result = namespace.has("something", LANGUAGE_FOREIGN);
    if (! namespace.isLoading()) {
      test.equal(result, false);
    }
  });
});

Tinytest.add("Namespace - access existing key", function (test) {
  var namespace = new Translator.Namespace(NAMESPACE);
  Deps.autorun(function (dep) {
    var result = namespace.get("a_key", LANGUAGE_FOREIGN);
    if (! namespace.isLoading()) {
      test.equal(result, "Hallo Test");
    }
  });
});

Tinytest.add("Namespace - access none existing key", function (test) {
  var namespace = new Translator.Namespace(NAMESPACE);
  Deps.autorun(function (dep) {
    var result = namespace.get("something", LANGUAGE_FOREIGN);
    if (! namespace.isLoading()) {
      test.equal(result, undefined);
    }
  });
});
