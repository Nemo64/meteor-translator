var cldr = Npm.require('cldr');

MessageFormatPreprocess.plural = function (object, data) {
  // add cldr information
  var meta = data.meta;
  if (! meta.hasOwnProperty('plural')) {
    var locale = data.locale.toString();
    var pluralFunction = cldr.extractPluralRuleFunction(locale);
    meta['plural'] = pluralFunction.toString();
  }
  return object;
};
