var filter = Translator._filterParameter;

Tinytest.add("Translator - FilterList - parameter - no change", function (test) {
  var result = filter("a string", {});
  test.equal(result, "a string");
});

Tinytest.add("Translator - FilterList - parameter - no change without parameter", function (test) {
  var result = filter("a string with {{parameter}}", {});
  test.equal(result, "a string with {{parameter}}");
});

Tinytest.add("Translator - FilterList - parameter - insert parameter", function (test) {
  var parameters = { parameter: "value" };
  var result = filter("a string with {{parameter}}", { parameters: parameters });
  test.equal(result, "a string with value");
});

Tinytest.add("Translator - FilterList - parameter - insert number", function (test) {
  var parameters = { parameter: 30 };
  var result = filter("a string with {{parameter}}", { parameters: parameters });
  test.equal(result, "a string with 30");
});

Tinytest.add("Translator - FilterList - parameter - insert null", function (test) {
  var parameters = { parameter: null };
  var result = filter("a string with {{parameter}}", { parameters: parameters });
  test.equal(result, "a string with null");
});

Tinytest.add("Translator - FilterList - parameter - insert object", function (test) {
  var parameters = { parameter: { toString: function () { return "value" } } };
  var result = filter("a string with {{parameter}}", { parameters: parameters });
  test.equal(result, "a string with value");
});
