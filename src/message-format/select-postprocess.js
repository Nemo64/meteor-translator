messageFormatPostprocess.select = function (object, data) {
  var parameter = data.parameters[object.name];
  
  var value = object.hash[parameter];
  if (value == null) {
    value = object.hash["other"]; // other also as fallback
  }
  
  return messageFormatPostprocess(value, data); // recursion
};
