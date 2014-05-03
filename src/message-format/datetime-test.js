var NAMESPACE = 'packages/translator/test/namespace';
var englishTrans = new Translator();
englishTrans.setLanguage(['en_US']);
englishTrans.use(NAMESPACE);

var germanTrans = new Translator();
germanTrans.setLanguage(['de_DE']);
germanTrans.use(NAMESPACE);

testAsyncMulti("Translator - message-format - date and time", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var date = new Date(2014, 5, 2, 18, 13, 54);
      var result = englishTrans.get('published_on', { published_at: date });
      test.equal(result, "published on Jun 2, 2014 at 6:13 pm");
    }));
  },
  function (test, expect) {
    germanTrans.ready(expect(function () {
      var date = new Date(2014, 5, 2, 18, 13, 54);
      var result = germanTrans.get('published_on', { published_at: date });
      test.equal(result, "veröffentlicht am 02.06.2014 um 18:13");
    }));
  }
]);

testAsyncMulti("Translator - message-format - date and time without time object", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var date = null;
      var result = englishTrans.get('published_on', { published_at: date });
      test.equal(result, "published on Invalid date at Invalid date");
    }));
  }
]);
