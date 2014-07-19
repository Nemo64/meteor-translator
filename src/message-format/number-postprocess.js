function pad(str, length, character) {
    while (str.length < length) {
        str = character + str;
    }
    return str;
}
  
// wraps a string with the correct signs from the pattern
function wrap(string, parameter, format, addition) {
  // this check ignores the fact that there is a negative 0
  var wrapper = format[parameter >= 0 ? '+' : '-'];
  return wrapper[0] + string + addition + wrapper[1];
}

function numberFormat (format, parameter, data) {
  var latnSymbols = data.meta.latnSymbols;
  var addition = ""; // addition used for optional exponent
  parameter *= format.multiplicator || 1;
  
  //////////////
  // EXPONENT //
  //////////////
  
  if (format.isScientific) {
    var parts = parameter.toExponential().split(/e/i);
    var exponent = parseInt(parts[1], 10);
    parameter = parseFloat(parts[0]);
    var moveDigits = format.digits - 1 || 0;
    
    // engineering notation
    if (format.exponentMultiple != null) {
      var round = exponent % format.exponentMultiple;
      moveDigits += round;
      if (round < 0) {
        moveDigits += format.exponentMultiple;
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
    } else if (format.exponentPlus) {
      addition += latnSymbols.plusSign;
    }
    var absString = Math.abs(exponent).toString();
    addition += pad(absString, format.exponent, '0');
  }
  
  ////////////////////////
  // SIGNIFICANT NUMBER //
  ////////////////////////
  
  if (format.isSignificant) {
    parameter = parseFloat(parameter.toPrecision(format.maxSignificant));
  }
  
  /////////////
  // DECIMAL //
  /////////////
  
  // round the number
  var maxPost = format.maxPost != null ? format.maxPost : 8;
  var divider = format.divider || (1 / Math.pow(10, maxPost || 0));
  parameter = Math.round(parameter / divider) * divider;
  
  // split the number into pre and post point parts
  var absString = Math.abs(parameter).toFixed(maxPost);
  var prePoint = absString.match(/^[^\.]*/)[0] || '0';
  var prePointPadded = pad(prePoint, format.digits, '0');
  var postPoint = absString.replace(/^[^\.]*\./, '');
  var postPointZeroless = postPoint.replace(/0+$/, '');
  
  // put prePost into groups
  var groups = format.groups || [];
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
  var numAddNeeded = (format.minSignificant - numSignificantDigits) || 0;
  var minPost = format.minPost || 0;
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
  return wrap(result, parameter, format, addition);
}





function isSpecialCase (p) {
  return ! _.isNumber(p) || _.isNaN(p) || !_.isFinite(p);
}

// covers special cases for numbers
function specialCase (parameter, format, latnSymbols) {  
  if (! _.isNumber(parameter) || _.isNaN(parameter)) {
    return latnSymbols.nan;
  }
  
  if (! _.isFinite(parameter)) {
    return wrap(latnSymbols.infinity, parameter, format, "");
  }
  
  return null; // no special case
}

messageFormatPostprocess.number = function (object, data) {
  var parameter = data.parameters[object.name];
  var format = data.meta.numberFormat[object.ref];
  
  if (isSpecialCase(parameter)) {
    return specialCase(parameter, format, data.meta.latnSymbols);
  }
  
  return numberFormat(format, parseFloat(parameter), data);
};

messageFormatPostprocess.number_switch = function (object, data) {
  var parameter = data.parameters[object.name];
  
  if (isSpecialCase(parameter)) {
    return messageFormatPostprocess.number({
      name: object.name,
      ref: 'default'
    }, data);
  }
  
  var formatLists = data.meta.numberFormat[object.ref];
  var absParameter = Math.abs(parameter);
  parameter = parseFloat(parameter);
  if (_.min(_.keys(formatLists), parseFloat) > absParameter) {
    return messageFormatPostprocess.number({
      name: object.name,
      ref: 'default'
    }, data);
  }
  
  // get the correct format list
  var formatList = _.max(formatLists, function (formatList, key) {
    return key <= absParameter ? key : -1;
  });
  
  // plural check
  var format = messageFormatPostprocess.plural({
    name: object.name,
    hash: formatList
  }, data);
  
  return numberFormat(format, parameter, data);
}
