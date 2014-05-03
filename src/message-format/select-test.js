var NAMESPACE = 'packages/translator/test/namespace';
var englishTrans = new Translator();
englishTrans.setLanguage(['en_US']);
englishTrans.use(NAMESPACE);

testAsyncMulti("Translator - message-format - select", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('gender', { gender: 'female' });
      test.equal(result, "female");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('gender', { gender: 'male' });
      test.equal(result, "male");
    }));
  }
]);
