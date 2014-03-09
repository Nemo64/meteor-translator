Tinytest.add("startup", function (test) {
  var language = new Translator.Language(["de_DE", "en_US"]);
  var translator = new Translator(language);
  translator.use("namespace");
  console.dir(test);
});

Tinytest.add("get normal key", function (test) {
  var language = new Translator.Language(["de_DE", "en_US"]);
  var translator = new Translator(language);
  translator.use("namespace");
  
  var string = translator.get("a_key");
  test.equal(string, "Hallo Test");
});
