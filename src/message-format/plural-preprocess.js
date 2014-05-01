var cldr = Npm.require('cldr');

MessageFormatPreprocess.plural = function (object, data) {
  // add cldr information
  var meta = data.meta;
  if (! meta.hasOwnProperty('cldrPlural')) {
    var locale = data.locale.toString();
    var pluralFunction = cldr.extractPluralRuleFunction(locale);
    meta['cldrPlural'] = pluralFunction.toString();
  }
  return object;
};
