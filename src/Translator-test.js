var NAMESPACE = 'packages/translator/test/namespace';
// normalize the testing envirement
Translator.setLanguage(null); // ignore automated sources

Tinytest.add("Translator - get without namespace", function (test) {
  var translator = new Translator();
  test.equal(translator.get('a_key'), 'a_key');
});

Tinytest.add("Translator - get with none existing namespace", function (test) {
  try {
    var translator = new Translator();
    translator.use('some/namespace');
    test.isTrue(false);
  } catch (e) {
    test.instanceOf(e, Error);
  }
});

testAsyncMulti("Translator - basic get request", [
  function (test, expect) {
    var translator = new Translator();
    translator.setLanguage(['en_US']);
    translator.use(NAMESPACE);
    
    translator.ready(expect(function () {
      test.equal(translator.get('a_key'), "Hello test");
    }));
  }
]);

testAsyncMulti("Translator - get without language", [
  function (test, expect) {
    var translator = new Translator();
    translator.use(NAMESPACE);
    
    translator.ready(expect(function () {
      test.equal(translator.get('a_key'), "a_key");
    }));
  }
]);

testAsyncMulti("Translator - set language later", [
  function (test, expect) {
    var translator = new Translator();
    translator.use(NAMESPACE);
    translator.setLanguage(['en_US']);
    
    translator.ready(expect(function () {
      test.equal(translator.get('a_key'), "Hello test");
    }));
  }
]);

testAsyncMulti("Translator - change language later", [
  function (test, expect) {
    var translator = new Translator();
    translator.use(NAMESPACE);
    translator.setLanguage(['en_US']);
    
    var callback = expect(function () {
      test.equal(translator.get('a_key'), "Hallo Test");
    });
    Meteor.setTimeout(function () {
      translator.setLanguage(['de_DE']);
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

var englishTrans = new Translator();
englishTrans.setLanguage(['en_US']);
englishTrans.use(NAMESPACE);

var germanTrans = new Translator();
germanTrans.setLanguage(['de_DE']);
germanTrans.use(NAMESPACE);

testAsyncMulti("Translator - message-format - fill in parameter", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('weather.message', { weather: "rainy" });
      test.equal(result, "It is rainy today!");
    }));
  }
]);

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

testAsyncMulti("Translator - message-format - combine plural and select", [
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('item_add', { count: 1, gender: 'female' });
      test.equal(result, "She added one item!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('item_add', { count: 5, gender: 'female' });
      test.equal(result, "She added 5 items!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('item_add', { count: 1, gender: 'male' });
      test.equal(result, "He added one item!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('item_add', { count: 5, gender: 'male' });
      test.equal(result, "He added 5 items!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('item_add', { count: 1, gender: null });
      test.equal(result, "They added one item!\n");
    }));
  },
  function (test, expect) {
    englishTrans.ready(expect(function () {
      var result = englishTrans.get('item_add', { count: 5, gender: null });
      test.equal(result, "They added 5 items!\n");
    }));
  }
]);

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
