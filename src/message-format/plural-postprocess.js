var pluralFunctions = {/*
  "locale": function () {}
*/};

var getPlural = function (data, number) {
  if (! pluralFunctions.hasOwnProperty(data.locale)) {
    if (data.meta.cldrPlural != null) {
      "use strict"; // additional eval security
      // XX this should not be an eval
      pluralFunctions[data.locale] = eval('(' + data.meta.cldrPlural + ')');
    } else {
      throw new Error("Translation file did not include plural function");
    }
  }
  return pluralFunctions[data.locale](number);
}

MessageFormatPostprocess.plural = function (object, data) {
  var parameter = data.parameters[object.name];
  
  var value = object.hash[parameter + "="]; // equals variation
  if (value == null) {
    value = object.hash[getPlural(data, parameter)]; // one, many, many... etc
    if (value == null) {
      value = object.hash["other"]; // other also as fallback
    }
  }
  
  return Translator._messageFormatFilter(value, data); // recursion
};
