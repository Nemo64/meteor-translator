Tinytest.add("FilterList - do nothing", function (test) {
  var filterList = new Translator.FilterList();
  var result = filterList.filter("some string");
  test.equal(result, "some string");
});

Tinytest.add("FilterList - append a filter", function (test) {
  var filterList = new Translator.FilterList();
  filterList.append(function (data) {
    return data.replace(" ", "");
  });
  var result = filterList.filter("some string");
  test.equal(result, "somestring");
});

Tinytest.add("FilterList - prepend a filter", function (test) {
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

Tinytest.add("FilterList - validation failing", function (test) {
  try {
    var filterList = new Translator.FilterList("filter", _.isString);
    var result = filterList.filter({});
    test.isTrue(false);
  } catch (e) {
    test.instanceOf(e, Error);
  }
});

Tinytest.add("FilterList - validation success", function (test) {
  var filterList = new Translator.FilterList("filter", _.isString);
  var result = filterList.filter("some string");
  test.equal(result, "some-string");
});
