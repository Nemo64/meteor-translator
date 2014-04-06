

Tinytest.add("Translator - get without namespace", function (test) {
  var translator = new Translator();
  test.equal(translator.get('a_key'), 'a_key');
});

Tinytest.add("Translator - get with none existing namespace", function (test) {
  var translator = new Translator();
  translator.use('some/namespace')
  test.equal(translator.get('a_key'), 'a_key');
});

testAsyncMulti("Translator - basic get request", [
  function (test, expect) {
    var translator = new Translator();
    translator.setLanguage(['en_US']);
    translator.use('packages/translator/tests/namespace');
    
    translator.ready(expect(function () {
      test.equal(translator.get('a_key'), "Hello test");
    }));
  }
]);

testAsyncMulti("Translator - ready callback without doing anything", [
  function (test, expect) {
    var translator = new Translator();
    
    translator.ready(expect(function () {
      test.isTrue(true);
    }));
  }
]);

testAsyncMulti("Translator - fill in parameter", [
  function (test, expect) {
    var translator = new Translator();
    translator.setLanguage(['en_US']);
    translator.use('packages/translator/tests/namespace');
    
    translator.ready(expect(function () {
      var result = translator.get('weather.message', { weather: "rainy" });
      test.equal(result, "It is rainy today!");
    }));
  }
]);

