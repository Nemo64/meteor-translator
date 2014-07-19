var cldr = Npm.require('cldr');

var keywords = ['zero', 'one', 'two', 'few', 'many', 'other'];
_pluralFilter = function (hash) {
  var result = {};
  _.each(hash, function (value, key) {
    if (_.contains(keywords, key)) {
    } else if (/^=\d*$/.test(key)) {
      // make =01 the same as =1
      key = key.replace(/^=0*(\d+)$/, '=$1');
    } else return;
    result[key] = value;
  });
  return result;
};

messageFormatPreprocess.plural = function (object, data) {
  // add cldr information
  var meta = data.meta;
  if (! meta.hasOwnProperty('plural')) {
    var locale = data.locale.toString();
    var pluralFunction = cldr.extractPluralRuleFunction(locale);
    meta['plural'] = pluralFunction.toString();
  }
  return {
    name: object.name,
    method: object.method,
    hash: _pluralFilter(object.hash)
  };
};
