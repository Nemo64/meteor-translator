

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

testAsyncMulti("Translator - set language later", [
  function (test, expect) {
    var translator = new Translator();
    translator.use('packages/translator/tests/namespace');
    translator.setLanguage(['en_US']);
    
    translator.ready(expect(function () {
      test.equal(translator.get('a_key'), "Hello test");
    }));
  }
]);

testAsyncMulti("Translator - change language later", [
  function (test, expect) {
    var translator = new Translator();
    translator.use('packages/translator/tests/namespace');
    translator.setLanguage(['de_DE']);
    
    var callback = expect(function () {
      test.equal(translator.get('a_key'), "Hello test");
    });
    Meteor.setTimeout(function () {
      translator.setLanguage(['en_US']);
      translator.ready(callback);
    }, 100);
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
