var NAMESPACE = 'packages/translator/test/namespace';
var englishTrans = new Translator();
englishTrans.setLanguage(['en_US']);
englishTrans.use(NAMESPACE);

var germanTrans = new Translator();
germanTrans.setLanguage(['en_US']);
germanTrans.use(NAMESPACE);

testAsyncMulti("Translator - message-format - number", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      test.equal(englishTrans.get('subscribers', { num: 0 }), "You have 0 subscribers!");
      test.equal(englishTrans.get('subscribers', { num: 10 }), "You have 10 subscribers!");
      test.equal(englishTrans.get('subscribers', { num: 1000 }), "You have 1,000 subscribers!");
      test.equal(englishTrans.get('subscribers', { num: 0.25 }), "You have 0.25 subscribers!");
      test.equal(englishTrans.get('subscribers', { num: 2000.25 }), "You have 2.000,25 subscribers!");
      test.equal(englishTrans.get('subscribers', { num: -2000.25 }), "You have -2.000,25 subscribers!");
    }));
  },
  function (test, expect) {
    germanTrans.ready(expect(function () {
      test.equal(germanTrans.get('subscribers', { num: 0 }), "Du hast 0 subscriber!");
      test.equal(germanTrans.get('subscribers', { num: 10 }), "Du hast 10 subscriber!");
      test.equal(germanTrans.get('subscribers', { num: 1000 }), "Du hast 1.000 subscribers!");
      test.equal(germanTrans.get('subscribers', { num: 0.25 }), "Du hast 0,25 subscribers!");
      test.equal(germanTrans.get('subscribers', { num: 2000.25 }), "Du hast 2.000,25 subscribers!");
      test.equal(germanTrans.get('subscribers', { num: -2000.25 }), "Du hast -2.000,25 subscribers!");
    }));
  }
]);
