// this will to give all file paths to the client.
// that way it won't come to unneeded requests!
Inject.obj('translator-namespaces', function (req) {
  var result = {};
  _.each(Translator._namespaces, function (locales, namespace) {
    _.each(locales, function (_, locale) {
      result[namespace + '.' + locale + '.lang.yml.json'] = 1;
    });
  });
  return result;
});
