var pluralFunctions = {/*
  "locale": function () {}
*/};

var getPlural = function (data, number) {
  if (! pluralFunctions.hasOwnProperty(data.locale)) {
    if (data.meta["plural"] != null) {
      "use strict"; // additional eval security
      // XX this should not be an eval
      pluralFunctions[data.locale] = eval('(' + data.meta["plural"] + ')');
    } else {
      throw new Error("Translation file did not include plural function");
    }
  }
  return pluralFunctions[data.locale](number);
}

MessageFormatPostprocess.plural = function (object, data) {
  var parameter = data.parameters[object.name];
  
  // if this is an array or array like use length
  if (_.isObject(parameter)) {
    parameter = parameter.length;
  }
  
  var value = object.hash[parameter + "="]; // equals variation
  if (value == null) {
    value = object.hash[getPlural(data, parameter)]; // one, few, many... etc
    if (value == null) {
      value = object.hash["other"]; // other (also as fallback)
    }
  }
  
  return Translator._messageFormatFilter(value, data); // recursion
};
