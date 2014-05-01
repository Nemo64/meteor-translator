MessageFormatPostprocess = {};

var filter = function (object, data) {
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
      if (data.parameters.hasOwnProperty(part.name)) {
        var param = data.parameters[part.name];
        if (part.method == null) {
          result.push(param);
        } else if (MessageFormatPostprocess.hasOwnProperty(part.method)) {
          result.push(MessageFormatPostprocess[part.method](part, data));
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

Translator.objectFilter.prepend(filter);
Translator._messageFormatFilter = filter;
