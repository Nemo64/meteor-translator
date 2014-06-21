function pad(str, length, character) {
    while (str.length < length) {
        str = character + str;
    }
    return str;
}

messageFormatPostprocess.number = function (object, data) {
  var parameter = data.parameters[object.name];
  var latnSymbols = data.meta.latnSymbols;
  var addition = ""; // addition used for optional exponent
  
  if (! _.isNumber(parameter) || _.isNaN(parameter)) {
    return latnSymbols.nan;
  }
  
  // wraps a string with the correct signs from the pattern
  var wrap = function (string) {
    // this check ignores the fact that there is a negative 0
    var wrapper = object[parameter >= 0 ? '+' : '-'];
    return wrapper[0] + string + addition + wrapper[1];
  };
  
  if (! _.isFinite(parameter)) {
    return wrap(latnSymbols.infinity);
  }
  
  parameter *= object.multiplicator || 1;
  
  if (object.isScientific) {
    var minDigits = object.exponentMultiple + object.maxPost;
    console.log(parameter, minDigits);
    var string = parameter.toExponential(minDigits - 1);
    var parts = string.split(/e/i);
    var exponent = parseInt(parts[1], 10);
    parameter = parseFloat(parts[0]);
    
    // add the exponent to the padding
    addition += latnSymbols.exponential;
    if (exponent < 0) {
      addition += latnSymbols.minusSign;
    } else if (object.exponentPlus) {
      addition += latnSymbols.plusSign;
    }
    addition += Math.abs(exponent);
  }
  
  var divider = object.divider || (1 / Math.pow(10, object.maxPost || 0));
  parameter = Math.round(parameter / divider) * divider;
  var absString = Math.abs(parameter).toFixed(object.maxPost);
  var prePoint = pad(absString.match(/^[^\.]*/)[0] || '0', object.digits, '0');
  var postPoint = absString.replace(/^[^\.]*\./, '');
  var postPointZeroless = postPoint.replace(/0+$/, '');
  
  var groups = object.groups;
  var groupResult = [];
  var position = prePoint.length;
  for (var i = 0; position > 0 ; (i + 1) < groups.length && ++i) {
    var groupLength = groups[i];
    position -= groupLength;
    if (position < 0) {
      groupLength += position;
      position = 0;
    }
    groupResult.unshift(prePoint.substr(position, groupLength));
  }
  //console.log(parameter, prePoint, postPoint, groupResult);
  
  var result = groupResult.join(latnSymbols.group);
  if (postPointZeroless.length > 0 && object.maxPost > 0 || object.minPost) {
    if (postPointZeroless.length < object.minPost) {
      result += latnSymbols.decimal + postPoint.substr(0, object.minPost);
    } else {
      result += latnSymbols.decimal + postPointZeroless;
    }
  }
  return wrap(result);
};
