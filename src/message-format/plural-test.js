var NAMESPACE = 'packages/local-test:nemo64:translator/test/namespace';
var englishTrans = new Translator();
englishTrans.setLanguage(['en_US']);
englishTrans.use(NAMESPACE);

testAsyncMulti("Translator - message-format - plural", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('friend_count', { friends: 0 });
      test.equal(result, "You have no friends!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('friend_count', { friends: 1 });
      test.equal(result, "You have a friend!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('friend_count', { friends: 5 });
      test.equal(result, "You have 5 friends!\n");
    }));
  }
]);

testAsyncMulti("Translator - message-format - plural using array", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('friend_count', { friends: [] });
      test.equal(result, "You have no friends!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('friend_count', { friends: [1] });
      test.equal(result, "You have a friend!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('friend_count', { friends: [1,2,3,4,5] });
      test.equal(result, "You have 5 friends!\n");
    }));
  }
]);
