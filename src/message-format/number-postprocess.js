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
  
  //////////////
  // EXPONENT //
  //////////////
  
  if (object.isScientific) {
    var parts = parameter.toExponential().split(/e/i);
    var exponent = parseInt(parts[1], 10);
    parameter = parseFloat(parts[0]);
    var moveDigits = object.digits - 1 || 0;
    
    // engineering notation
    if (object.exponentMultiple != null) {
      var round = exponent % object.exponentMultiple;
      moveDigits += round;
      if (round < 0) {
        moveDigits += object.exponentMultiple;
      }
    }
    
    // if an amount of digits is required move numbers over
    if (parameter !== 0.0 && moveDigits !== 0) {
      parameter *= Math.pow(10, moveDigits);
      exponent -= moveDigits;
    }
    
    // add the exponent to the padding
    addition += latnSymbols.exponential;
    if (exponent < 0) {
      addition += latnSymbols.minusSign;
    } else if (object.exponentPlus) {
      addition += latnSymbols.plusSign;
    }
    var absString = Math.abs(exponent).toString();
    addition += pad(absString, object.exponent, '0');
  }
  
  ////////////////////////
  // SIGNIFICANT NUMBER //
  ////////////////////////
  
  if (object.isSignificant) {
    parameter = parseFloat(parameter.toPrecision(object.maxSignificant));
  }
  
  /////////////
  // DECIMAL //
  /////////////
  
  // round the number
  var maxPost = object.maxPost != null ? object.maxPost : 8;
  var divider = object.divider || (1 / Math.pow(10, maxPost || 0));
  parameter = Math.round(parameter / divider) * divider;
  
  // split the number into pre and post point parts
  var absString = Math.abs(parameter).toFixed(maxPost);
  var prePoint = absString.match(/^[^\.]*/)[0] || '0';
  var prePointPadded = pad(prePoint, object.digits, '0');
  var postPoint = absString.replace(/^[^\.]*\./, '');
  var postPointZeroless = postPoint.replace(/0+$/, '');
  
  // put prePost into groups
  var groups = object.groups || [];
  var groupResult = [];
  var position = prePointPadded.length;
  for (var i = 0; position > 0 ; (i + 1) < groups.length && ++i) {
    var groupLength = groups[i];
    position -= groupLength;
    if (position < 0) {
      groupLength += position;
      position = 0;
    }
    groupResult.unshift(prePointPadded.substr(position, groupLength));
  }
  var result = groupResult.join(latnSymbols.group);
  
  // build the postPoint number
  // calculate required additions of postPoint if significant digits are used
  var numSignificantDigits = prePoint.length + postPointZeroless.length;
  var numAddNeeded = (object.minSignificant - numSignificantDigits) || 0;
  var minPost = object.minPost || 0;
  var minPost = Math.max(minPost, numAddNeeded - postPointZeroless.length);
  
  // now build and join postPoint
  var requiresPostPoint = postPointZeroless.length > 0 && maxPost > 0;
  if (requiresPostPoint || minPost > 0) {
    if (postPointZeroless.length < minPost) {
      result += latnSymbols.decimal + postPoint.substr(0, minPost);
    } else {
      result += latnSymbols.decimal + postPointZeroless;
    }
  }
  return wrap(result);
};
