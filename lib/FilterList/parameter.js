var RX_PARAM = /\{\{\s*(\w+)\s*\}\}/g;

// this filter function will replace placeholders with there value
Translator._filterParameter = function (string, options) {
  var parameter = options.parameters != null ? _.clone(options.parameters) : {};
  var unfilledParameters = [];
  
  // replace placeholder with value
  var result = string.replace(RX_PARAM, function (original, key) {
    if (parameter.hasOwnProperty(key)) {
      var value = parameter[key];
      delete parameter[key]; // from copy for the later warning
      return value != null ? value.toString() : value;
    } else {
      unfilledParameters.push(key);
      return original;
    }
  });
  
  // create a message if not all parameters were used
  if (! _.isEmpty(parameter)) {
    var msg = "'" + options.key + " has too few parameters";
    msg += " in language " + options.language;
    console.warn(msg, string, parameter);
  }
  
  // create a message if more parameters were required from the string
  if (unfilledParameters.length > 0) {
      var msg = "'" + options.key + " requires more parameters";
      msg += " in language " + options.language
      console.warn(msg, string, unfilledParameters);
  }
  
  return result;
};

Translator.stringFilter.append(Translator._filterParameter);
