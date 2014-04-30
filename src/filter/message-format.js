MessageFormatPostprocess = {};

Translator._messageFormat = function (object, options) {
  if (! _.isArray(object)) {
    return object;
  }
  
  var result = [];
  _.each(object, function (part) {
    // normal strings
    if (_.isString(part)) {
      result.push(part);
    }
    
    // spezial meaning parts
    else if (_.isObject(part)) {
      if (options.parameters.hasOwnProperty(part.name)) {
        var param = options.parameters[part.name];
        if (part.method == null) {
          result.push(param);
        } else if (MessageFormatPostprocess.hasOwnProperty(part.method)) {
          result.push(MessageFormatPostprocess[part.method](part, options));
        }
      } else {
        result.push('{' + part.name + '}');
      }
    } else {
      throw new Error("Bad type in translation");
    }
  });
  return result.join("");
};

Translator.objectFilter.prepend(Translator._messageFormat);
