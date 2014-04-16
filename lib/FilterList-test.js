Tinytest.add("Translator - FilterList - do nothing", function (test) {
  var filterList = new Translator.FilterList();
  var result = filterList.filter("some string");
  test.equal(result, "some string");
});

Tinytest.add("Translator - FilterList - append a filter", function (test) {
  var filterList = new Translator.FilterList();
  filterList.append(function (data) {
    return data.replace(" ", "");
  });
  var result = filterList.filter("some string");
  test.equal(result, "somestring");
});

Tinytest.add("Translator - FilterList - prepend a filter", function (test) {
  var filterList = new Translator.FilterList();
  filterList.append(function (data) {
    return data.replace(" ", "");
  });
  filterList.prepend(function (data) {
    return data.replace(" ", "-");
  });
  var result = filterList.filter("some string");
  test.equal(result, "some-string");
});

Tinytest.add("Translator - FilterList - validation failing", function (test) {
  try {
    var filterList = new Translator.FilterList("filter", _.isString);
    var result = filterList.filter({});
    test.isTrue(false);
  } catch (e) {
    test.instanceOf(e, Error);
  }
});

Tinytest.add("Translator - FilterList - validation success", function (test) {
  var filterList = new Translator.FilterList("filter", _.isString);
  var result = filterList.filter("some string");
  test.equal(result, "some string");
});
