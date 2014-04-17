var operator = Translator._operator;
var condition = Translator._filterCondition;

Tinytest.add("Translator - FilterList - operator - basic types", function (test) {
  test.equal(operator('true'), true);
  test.equal(operator('32'), 32);
  test.equal(operator('"hi"'), "hi");
});

Tinytest.add("Translator - FilterList - operator - comparison", function (test) {
  test.equal(operator('5 == 2'), false);
  test.equal(operator('5 != 2'), true);
  test.equal(operator('5 == 5'), true);
  test.equal(operator('5 != 5'), false);
  test.equal(operator('5 == "5"'), true);
  test.equal(operator('5 != "5"'), false);
  test.equal(operator('true == false'), false);
  test.equal(operator('true != false'), true);
});

Tinytest.add("Translator - FilterList - operator - logical", function (test) {
  test.equal(operator('true && true'), true);
  test.equal(operator('true && false'), false);
  test.equal(operator('false && false'), false);
  test.equal(operator('false && false'), false);
  test.equal(operator('true || true'), true);
  test.equal(operator('true || false'), true);
  test.equal(operator('false || false'), false);
});

Tinytest.add("Translator - FilterList - operator - comparison + logical", function (test) {
  test.equal(operator('5 == 5 && 6 || 2'), 6);
  test.equal(operator('5 == 1 && 6 || 2'), false);
  test.equal(operator('5 == 5 || 2 && 4'), 4);
  test.equal(operator('5 == 1 || 2 && 4'), 4);
});

Tinytest.add("Translator - FilterList - operator - brackets", function (test) {
  test.equal(operator('(5 == 1 && 6) || 2'), 2);
  test.equal(operator('5 == 1 && (6 || 2)'), false);
  test.equal(operator('5 == 5 && (6 || 2)'), 6);
});

Tinytest.add("Translator - FilterList - operator - parameters", function (test) {
  test.equal(operator('value > 0', { value: 1 }), true);
  test.equal(operator('value > 0', { value: 0 }), false);
});

Tinytest.add("Translator - FilterList - condition - match", function (test) {
  var object = {
    'true': "true value",
    '!default': "default value"
  };
  var result = condition(object, {});
  test.equal(result, "true value");
});

Tinytest.add("Translator - FilterList - condition - default", function (test) {
  var object = {
    'false': "false value",
    '!default': "default value"
  };
  var result = condition(object, {});
  test.equal(result, "default value");
});

Tinytest.add("Translator - FilterList - condition - no match", function (test) {
  var object = {
    'false': "false value"
  };
  try {
    var result = condition(object, {});
    test.isTrue(false);
  } catch (e) {
    test.instanceOf(e, Error);
  }
});
