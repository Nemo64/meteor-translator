var NAMESPACE = 'packages/local-test:nemo64:translator/test/namespace';
var englishTrans = new Translator();
englishTrans.setLanguage(['en_US']);
englishTrans.use(NAMESPACE);

var germanTrans = new Translator();
germanTrans.setLanguage(['de_DE']);
germanTrans.use(NAMESPACE);

testAsyncMulti("Translator - message-format - number - language default", [
  function (test, expect) {
    var key = 'subscribers';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "You have 0 subscribers!");
      test.equal(trans.get(key, { num: 10 }), "You have 10 subscribers!");
      test.equal(trans.get(key, { num: 1000 }), "You have 1,000 subscribers!");
      test.equal(trans.get(key, { num: 0.25 }), "You have 0.25 subscribers!");
      test.equal(trans.get(key, { num: 2000.25 }), "You have 2,000.25 subscribers!");
      test.equal(trans.get(key, { num: -2000.25 }), "You have -2,000.25 subscribers!");
    }));
  },
  function (test, expect) {
    var key = 'subscribers';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "Du hast 0 subscriber!");
      test.equal(trans.get(key, { num: 10 }), "Du hast 10 subscriber!");
      test.equal(trans.get(key, { num: 1000 }), "Du hast 1.000 subscriber!");
      test.equal(trans.get(key, { num: 0.25 }), "Du hast 0,25 subscriber!");
      test.equal(trans.get(key, { num: 2000.25 }), "Du hast 2.000,25 subscriber!");
      test.equal(trans.get(key, { num: -2000.25 }), "Du hast -2.000,25 subscriber!");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - force digits after point", [
  function (test, expect) {
    var key = 'normal_number';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0.00");
      test.equal(trans.get(key, { num: 10 }), "10.00");
      test.equal(trans.get(key, { num: 1000 }), "1,000.00");
      test.equal(trans.get(key, { num: 0.25 }), "0.25");
      test.equal(trans.get(key, { num: 2000.25 }), "2,000.25");
      test.equal(trans.get(key, { num: -2000.25 }), "-2,000.25");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'normal_number';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0,00");
      test.equal(trans.get(key, { num: 10 }), "10,00");
      test.equal(trans.get(key, { num: 1000 }), "1.000,00");
      test.equal(trans.get(key, { num: 0.25 }), "0,25");
      test.equal(trans.get(key, { num: 2000.25 }), "2.000,25");
      test.equal(trans.get(key, { num: -2000.25 }), "-2.000,25");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - optional 1 digit after point", [
  function (test, expect) {
    var key = 'more_point_number';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1,000");
      test.equal(trans.get(key, { num: 0.25 }), "0.3");
      test.equal(trans.get(key, { num: 2000.25 }), "2,000.3");
      test.equal(trans.get(key, { num: -2000.25 }), "-2,000.2");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'more_point_number';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1.000");
      test.equal(trans.get(key, { num: 0.25 }), "0,3");
      test.equal(trans.get(key, { num: 2000.25 }), "2.000,3");
      test.equal(trans.get(key, { num: -2000.25 }), "-2.000,2");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - force min 4 digits before point", [
  function (test, expect) {
    var key = 'more_digit_number';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0,000");
      test.equal(trans.get(key, { num: 10 }), "0,010");
      test.equal(trans.get(key, { num: 1000 }), "1,000");
      test.equal(trans.get(key, { num: 0.25 }), "0,000.25");
      test.equal(trans.get(key, { num: 2000.25 }), "2,000.25");
      test.equal(trans.get(key, { num: -2000.25 }), "-2,000.25");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'more_digit_number';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0.000");
      test.equal(trans.get(key, { num: 10 }), "0.010");
      test.equal(trans.get(key, { num: 1000 }), "1.000");
      test.equal(trans.get(key, { num: 0.25 }), "0.000,25");
      test.equal(trans.get(key, { num: 2000.25 }), "2.000,25");
      test.equal(trans.get(key, { num: -2000.25 }), "-2.000,25");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - positive plus sign", [
  function (test, expect) {
    var key = 'plus_number';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "+0");
      test.equal(trans.get(key, { num: 10 }), "+10");
      test.equal(trans.get(key, { num: 1000 }), "+1,000");
      test.equal(trans.get(key, { num: 0.25 }), "+0.25");
      test.equal(trans.get(key, { num: 2000.25 }), "+2,000.25");
      test.equal(trans.get(key, { num: -2000.25 }), "-2,000.25");
      test.equal(trans.get(key, { num: Infinity }), "+∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'plus_number';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "+0");
      test.equal(trans.get(key, { num: 10 }), "+10");
      test.equal(trans.get(key, { num: 1000 }), "+1.000");
      test.equal(trans.get(key, { num: 0.25 }), "+0,25");
      test.equal(trans.get(key, { num: 2000.25 }), "+2.000,25");
      test.equal(trans.get(key, { num: -2000.25 }), "-2.000,25");
      test.equal(trans.get(key, { num: Infinity }), "+∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - round to 0.05", [
  function (test, expect) {
    var key = 'rounded_number';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0.00");
      test.equal(trans.get(key, { num: 10 }), "10.00");
      test.equal(trans.get(key, { num: 1000 }), "1,000.00");
      test.equal(trans.get(key, { num: 0.23 }), "0.25");
      test.equal(trans.get(key, { num: 2000.23 }), "2,000.25");
      test.equal(trans.get(key, { num: -2000.23 }), "-2,000.25");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'rounded_number';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0,00");
      test.equal(trans.get(key, { num: 10 }), "10,00");
      test.equal(trans.get(key, { num: 1000 }), "1.000,00");
      test.equal(trans.get(key, { num: 0.23 }), "0,25");
      test.equal(trans.get(key, { num: 2000.23 }), "2.000,25");
      test.equal(trans.get(key, { num: -2000.23 }), "-2.000,25");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - exponent", [
  function (test, expect) {
    var key = 'exponential_number';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "1E1");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "2.3E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1.23E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1.23E-3");
    }));
  },
  function (test, expect) {
    var key = 'exponential_number';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "1E1");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "2,3E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1,23E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1,23E-3");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - exponent locale default", [
  function (test, expect) {
    var key = 'exponential_number_default';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "1E1");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "2E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1E-3");
    }));
  },
  function (test, expect) {
    var key = 'exponential_number_default';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "1E1");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "2E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1E-3");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - exponent plus", [
  function (test, expect) {
    var key = 'exponential_number_plus';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E+0");
      test.equal(trans.get(key, { num: 10 }), "1E+1");
      test.equal(trans.get(key, { num: 1000 }), "1E+3");
      test.equal(trans.get(key, { num: 0.23 }), "2.3E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E+3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E+3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1.23E+3");
      test.equal(trans.get(key, { num: 0.00123 }), "1.23E-3");
    }));
  },
  function (test, expect) {
    var key = 'exponential_number_plus';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E+0");
      test.equal(trans.get(key, { num: 10 }), "1E+1");
      test.equal(trans.get(key, { num: 1000 }), "1E+3");
      test.equal(trans.get(key, { num: 0.23 }), "2,3E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E+3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E+3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1,23E+3");
      test.equal(trans.get(key, { num: 0.00123 }), "1,23E-3");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - exponent with 2 digits", [
  function (test, expect) {
    var key = 'exponential_number_minimum';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "00E0");
      test.equal(trans.get(key, { num: 10 }), "10E0");
      test.equal(trans.get(key, { num: 1000 }), "10E2");
      test.equal(trans.get(key, { num: 0.23 }), "23E-2");
      test.equal(trans.get(key, { num: 2000.23 }), "20E2");
      test.equal(trans.get(key, { num: -2000.23 }), "-20E2");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "12.34E2");
      test.equal(trans.get(key, { num: 0.00123 }), "12.3E-4");
    }));
  },
  function (test, expect) {
    var key = 'exponential_number_minimum';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "00E0");
      test.equal(trans.get(key, { num: 10 }), "10E0");
      test.equal(trans.get(key, { num: 1000 }), "10E2");
      test.equal(trans.get(key, { num: 0.23 }), "23E-2");
      test.equal(trans.get(key, { num: 2000.23 }), "20E2");
      test.equal(trans.get(key, { num: -2000.23 }), "-20E2");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "12,34E2");
      test.equal(trans.get(key, { num: 0.00123 }), "12,3E-4");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - exponent exponent 3", [
  function (test, expect) {
    var key = 'exponential_number_multiple';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "10E0");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "230E-3");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1.23E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1.23E-3");
    }));
  },
  function (test, expect) {
    var key = 'exponential_number_multiple';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "10E0");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "230E-3");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 1234 }), "1,23E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1,23E-3");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - significant 1-3", [
  function (test, expect) {
    var key = 'significant_number_one';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1,000");
      test.equal(trans.get(key, { num: 0.25 }), "0.25");
      test.equal(trans.get(key, { num: 2000.25 }), "2,000");
      test.equal(trans.get(key, { num: -2000.25 }), "-2,000");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2.25 }), "2.25");
      test.equal(trans.get(key, { num: 0.001234 }), "0.00123");
      test.equal(trans.get(key, { num: 12345 }), "12,300");
    }));
  },
  function (test, expect) {
    var key = 'significant_number_one';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1.000");
      test.equal(trans.get(key, { num: 0.25 }), "0,25");
      test.equal(trans.get(key, { num: 2000.25 }), "2.000");
      test.equal(trans.get(key, { num: -2000.25 }), "-2.000");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2.25 }), "2,25");
      test.equal(trans.get(key, { num: 0.001234 }), "0,00123");
      test.equal(trans.get(key, { num: 12345 }), "12.300");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - significant 2-3", [
  function (test, expect) {
    var key = 'significant_number_two';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0.0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1,000");
      test.equal(trans.get(key, { num: 0.25 }), "0.25");
      test.equal(trans.get(key, { num: 2000.25 }), "2,000");
      test.equal(trans.get(key, { num: -2000.25 }), "-2,000");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2.25 }), "2.25");
      test.equal(trans.get(key, { num: 0.001234 }), "0.00123");
      test.equal(trans.get(key, { num: 12345 }), "12,300");
    }));
  },
  function (test, expect) {
    var key = 'significant_number_two';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0,0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1.000");
      test.equal(trans.get(key, { num: 0.25 }), "0,25");
      test.equal(trans.get(key, { num: 2000.25 }), "2.000");
      test.equal(trans.get(key, { num: -2000.25 }), "-2.000");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2.25 }), "2,25");
      test.equal(trans.get(key, { num: 0.001234 }), "0,00123");
      test.equal(trans.get(key, { num: 12345 }), "12.300");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - exponential significant", [
  function (test, expect) {
    var key = 'exponential_significant_number';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "1E1");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "2.3E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      
      test.equal(trans.get(key, { num: 2.25 }), "2.25E0");
      test.equal(trans.get(key, { num: 0.001234 }), "1.23E-3");
      test.equal(trans.get(key, { num: 12345 }), "1.23E4");
      test.equal(trans.get(key, { num: 1234 }), "1.23E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1.23E-3");
    }));
  },
  function (test, expect) {
    var key = 'exponential_significant_number';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0E0");
      test.equal(trans.get(key, { num: 10 }), "1E1");
      test.equal(trans.get(key, { num: 1000 }), "1E3");
      test.equal(trans.get(key, { num: 0.23 }), "2,3E-1");
      test.equal(trans.get(key, { num: 2000.23 }), "2E3");
      test.equal(trans.get(key, { num: -2000.23 }), "-2E3");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      
      test.equal(trans.get(key, { num: 2.25 }), "2,25E0");
      test.equal(trans.get(key, { num: 0.001234 }), "1,23E-3");
      test.equal(trans.get(key, { num: 12345 }), "1,23E4");
      test.equal(trans.get(key, { num: 1234 }), "1,23E3");
      test.equal(trans.get(key, { num: 0.00123 }), "1,23E-3");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - percent", [
  function (test, expect) {
    var key = 'percent';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "00%");
      test.equal(trans.get(key, { num: 10 }), "1,000%");
      test.equal(trans.get(key, { num: 1000 }), "100,000%");
      test.equal(trans.get(key, { num: 0.25 }), "25%");
      test.equal(trans.get(key, { num: 2000.25 }), "200,025%");
      test.equal(trans.get(key, { num: -2000.25 }), "-200,025%");
      test.equal(trans.get(key, { num: Infinity }), "∞%");
      test.equal(trans.get(key, { num: -Infinity }), "-∞%");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'percent';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "00%");
      test.equal(trans.get(key, { num: 10 }), "1.000%");
      test.equal(trans.get(key, { num: 1000 }), "100.000%");
      test.equal(trans.get(key, { num: 0.25 }), "25%");
      test.equal(trans.get(key, { num: 2000.25 }), "200.025%");
      test.equal(trans.get(key, { num: -2000.25 }), "-200.025%");
      test.equal(trans.get(key, { num: Infinity }), "∞%");
      test.equal(trans.get(key, { num: -Infinity }), "-∞%");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - percent locale default", [
  function (test, expect) {
    var key = 'percent_default';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0%");
      test.equal(trans.get(key, { num: 10 }), "1,000%");
      test.equal(trans.get(key, { num: 1000 }), "100,000%");
      test.equal(trans.get(key, { num: 0.25 }), "25%");
      test.equal(trans.get(key, { num: 2000.25 }), "200,025%");
      test.equal(trans.get(key, { num: -2000.25 }), "-200,025%");
      test.equal(trans.get(key, { num: Infinity }), "∞%");
      test.equal(trans.get(key, { num: -Infinity }), "-∞%");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'percent_default';
    var trans = germanTrans;
    trans.ready(expect(function () {
      // CAUTION: those are none breaking spaces between unit and number
      test.equal(trans.get(key, { num: 0 }), "0 %");
      test.equal(trans.get(key, { num: 10 }), "1.000 %");
      test.equal(trans.get(key, { num: 1000 }), "100.000 %");
      test.equal(trans.get(key, { num: 0.25 }), "25 %");
      test.equal(trans.get(key, { num: 2000.25 }), "200.025 %");
      test.equal(trans.get(key, { num: -2000.25 }), "-200.025 %");
      test.equal(trans.get(key, { num: Infinity }), "∞ %");
      test.equal(trans.get(key, { num: -Infinity }), "-∞ %");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - permille", [
  function (test, expect) {
    var key = 'permille';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "000‰");
      test.equal(trans.get(key, { num: 10 }), "10,000‰");
      test.equal(trans.get(key, { num: 1000 }), "1,000,000‰");
      test.equal(trans.get(key, { num: 0.25 }), "250‰");
      test.equal(trans.get(key, { num: 2000.25 }), "2,000,250‰");
      test.equal(trans.get(key, { num: -2000.25 }), "-2,000,250‰");
      test.equal(trans.get(key, { num: Infinity }), "∞‰");
      test.equal(trans.get(key, { num: -Infinity }), "-∞‰");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  },
  function (test, expect) {
    var key = 'permille';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "000‰");
      test.equal(trans.get(key, { num: 10 }), "10.000‰");
      test.equal(trans.get(key, { num: 1000 }), "1.000.000‰");
      test.equal(trans.get(key, { num: 0.25 }), "250‰");
      test.equal(trans.get(key, { num: 2000.25 }), "2.000.250‰");
      test.equal(trans.get(key, { num: -2000.25 }), "-2.000.250‰");
      test.equal(trans.get(key, { num: Infinity }), "∞‰");
      test.equal(trans.get(key, { num: -Infinity }), "-∞‰");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - readable short", [
  function (test, expect) {
    var key = 'readable_number_short';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1K");
      test.equal(trans.get(key, { num: 0.25 }), "0.25");
      test.equal(trans.get(key, { num: 2000.25 }), "2K");
      test.equal(trans.get(key, { num: -2000.25 }), "-2K");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2000000 }), "2M");
      test.equal(trans.get(key, { num: 2000000000 }), "2B");
      test.equal(trans.get(key, { num: 2000000000000 }), "2T");
      test.equal(trans.get(key, { num: 2000000000000000 }), "2000T");
    }));
  },
  function (test, expect) {
    var key = 'readable_number_short';
    var trans = germanTrans;
    trans.ready(expect(function () {
      // CAUTION: those are none breaking spaces between unit and number
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1 Tsd");
      test.equal(trans.get(key, { num: 0.25 }), "0,25");
      test.equal(trans.get(key, { num: 2000.25 }), "2 Tsd");
      test.equal(trans.get(key, { num: -2000.25 }), "-2 Tsd");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2000000 }), "2 Mio");
      test.equal(trans.get(key, { num: 2000000000 }), "2 Mrd");
      test.equal(trans.get(key, { num: 2000000000000 }), "2 Bio");
      test.equal(trans.get(key, { num: 2000000000000000 }), "2000 Bio");
    }));
  }
]);

testAsyncMulti("Translator - message-format - number - readable long", [
  function (test, expect) {
    var key = 'readable_number_long';
    var trans = englishTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1 thousand");
      test.equal(trans.get(key, { num: 0.25 }), "0.25");
      test.equal(trans.get(key, { num: 2000.25 }), "2 thousand");
      test.equal(trans.get(key, { num: -2000.25 }), "-2 thousand");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2000000 }), "2 million");
      test.equal(trans.get(key, { num: 2000000000 }), "2 billion");
      test.equal(trans.get(key, { num: 2000000000000 }), "2 trillion");
      test.equal(trans.get(key, { num: 2000000000000000 }), "2000 trillion");
    }));
  },
  function (test, expect) {
    var key = 'readable_number_long';
    var trans = germanTrans;
    trans.ready(expect(function () {
      test.equal(trans.get(key, { num: 0 }), "0");
      test.equal(trans.get(key, { num: 10 }), "10");
      test.equal(trans.get(key, { num: 1000 }), "1 Tausend");
      test.equal(trans.get(key, { num: 0.25 }), "0,25");
      test.equal(trans.get(key, { num: 2000.25 }), "2 Tausend");
      test.equal(trans.get(key, { num: -2000.25 }), "-2 Tausend");
      test.equal(trans.get(key, { num: Infinity }), "∞");
      test.equal(trans.get(key, { num: -Infinity }), "-∞");
      test.equal(trans.get(key, { num: "hello" }), "NaN");
      
      test.equal(trans.get(key, { num: 2000000 }), "2 Millionen");
      test.equal(trans.get(key, { num: 2000000000 }), "2 Milliarden");
      test.equal(trans.get(key, { num: 2000000000000 }), "2 Billionen");
      test.equal(trans.get(key, { num: 2000000000000000 }), "2000 Billionen");
    }));
  }
]);
