var cldr = Npm.require('cldr');

MessageFormatPreprocess.plural = function (params, options) {
  // add cldr information
  var additions = options.additions;
  if (! additions.hasOwnProperty('cldrPlural')) {
    var locale = options.locale.toString();
    var pluralFunction = cldr.extractPluralRuleFunction(locale);
    additions['cldrPlural'] = pluralFunction.toString();
  }
  
};
