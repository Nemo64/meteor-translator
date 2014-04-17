var RX_PARAM = /\{\{\s*(\w+)\s*\}\}/g;

// this filter function will replace placeholders with there value
Translator._filterParameter = function (string, options) {
  var parameter = options.parameters || {};
  
  // replace placeholder with value
  return string.replace(RX_PARAM, function (original, key) {
    if (parameter.hasOwnProperty(key)) {
      var value = parameter[key];
      return value != null ? value.toString() : value;
    } else {
      return original;
    }
  });
};

Translator.stringFilter.append(Translator._filterParameter);
