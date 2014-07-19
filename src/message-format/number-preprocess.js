var cldr = Npm.require('cldr');

/**
 * The resulting expression will only match if the content is not inside quotes
 */
var unescapedExpr = function (s, m) {
  return new RegExp(s + '(?=(?:[^\']|\'[^\']*\')*$)', m);
};

//                             (   num   )(point + number )(     exp.     )
var RX_NUMBER = unescapedExpr('([\\d#@,]+)(?:\\.([\\d#]+))?(?:E(\\+?\\d+))?');
var RX_SPLIT_PATTERNS = unescapedExpr(';');
var RX_IS_SIGNIFICANT = unescapedExpr('@');
var RX_IS_SCIENTIFIC  = unescapedExpr('E');
var RX_PERCENT  = unescapedExpr('%', 'g');
var RX_PERMILLE = unescapedExpr('‰', 'g');
var RX_PLUS  = unescapedExpr('\\+', 'g');
var RX_MINUS = unescapedExpr('\\-', 'g');
var RX_PADDING = unescapedExpr('\\*(.)');

var replaceStaticChars = function (string, locale) {
  var latnSymbols = cldr.extractNumberSymbols(locale.toString(), 'latn');
  string = string.replace(RX_PERCENT, latnSymbols.percentSign);
  string = string.replace(RX_PERMILLE, latnSymbols.perMille);
  string = string.replace(RX_PLUS, latnSymbols.plusSign);
  string = string.replace(RX_MINUS, latnSymbols.minusSign);
  return string;
};

var parseNumberFormat = function (string, data) {
  var numberFormat = {
    isSignificant: RX_IS_SIGNIFICANT.test(string) || void 0,
    isScientific: RX_IS_SCIENTIFIC.test(string) || void 0,
    
    multiplicator: string.match(RX_PERCENT) !== null ? 100
                 : string.match(RX_PERMILLE) !== null ? 1000
                 : void 0,
    
    groups: [] // where groups have to be, eg. [3] = every 3 digits
    // there are cases eg in Hindi where patterns like #,##,##0 [3,2] are needed
    // the last number will be repeated.
    // UTS only requires a primary and secondary group
    
    //'+': ['', ''] // prefix and suffix for a positive number
    //'-': ['', ''] // prefix and suffix for a negative number 
  };
  
  
  // pre and suffix for this number
  var patterns = string.replace(RX_PADDING, ''); // for now remove padding
  patterns = patterns.split(RX_SPLIT_PATTERNS, 2); // split both patterns
  _.each(['+', '-'], function (variant, index) {
    var pattern = patterns[index];
    var hash;
    // it this is the minus pattern and there is no specific for -
    if (pattern == null/* the plus pattern is always defined */) {
      pattern = patterns[0];
      hash = pattern.split(RX_NUMBER, 5);
      
      // the minus needs to be inserted into the generated pattern
      // if the plus pattern did contain a + it needs to be replaced
      // otherwise we place a minus before the number
      var hasPlus = (hash[0] + hash[4]).match(RX_PLUS) !== null;
      if (hasPlus) {
        // plus can be before and after the actual number
        _.each([0, 4], function (index) {
          hash[index] = hash[index].replace(RX_PLUS, '-');
        });
      } else {
          hash[0] = hash[0] + '-';
      }
    } else {
      hash = pattern.split(RX_NUMBER, 5);
    }
    numberFormat[variant] = [
      replaceStaticChars(hash[0] || '', data.locale),
      replaceStaticChars(hash[4] || '', data.locale)
    ];
  });
  
  var pattern = patterns[0].match(RX_NUMBER); // only look at the first
  var prePoint = pattern[1] || '';
  var postPoint = pattern[2] || '';
  var exponent = pattern[3] || '';
  
  // handle groups (and remove "," from the prePoint variable
  prePoint = prePoint.replace(/,([\d#@]+)/g, function (s, numbers) {
    numberFormat.groups.unshift(numbers.length);
    return numbers;
  });
  numberFormat.groups = numberFormat.groups.slice(0, 2); // only 2
  
  /////////////////////////////////////
  // SIGNIFICANT VS NORMAL FORMATING //
  /////////////////////////////////////
  
  // parse the main part of the number
  if (numberFormat.isSignificant) {
    if (/\d/.test(prePoint) || postPoint != '') {
      throw new Error("significant number patterns may not contain"
        + " a decimal separator, nor the '0' pattern character."
        + " Patterns such as \"@00\" or \"@.###\" are disallowed.");
    }
    _.extend(numberFormat, { // <=
      minSignificant: prePoint.match(/@+/)[0].length,
      maxSignificant: prePoint.match(/@[@#]*/)[0].length
    })
  } else {
    var padding = string.match(RX_PADDING);
    _.extend(numberFormat, { // <=
      digits: prePoint.replace(/\D/g, '').length,
      minPost: postPoint.match(/^\d*/)[0].length,
      maxPost: postPoint.match(/^[\d#]*/)[0].length,
      divider: parseFloat(pattern[0].replace(/[#@]/g, '0').replace(/,/g, '')) || void 0,
      padNum: padding != null ? prePoint.match(/[\d#]*$/)[0].length : void 0,
      padding: padding != null ? padding : void 0
      
      // TODO the number of digits post has to be overwritten by the currency
      // XXX the scientific case is not well displayed here
    });
  }
  
  /////////////////////////
  // SCIENTIFIC NOTATION //
  /////////////////////////
  
  // parse the sientific part of the number
  if (numberFormat.isScientific) {
    if (numberFormat.groups.length > 0) {
      throw new Error("Exponential patterns may not contain grouping separators.");
    }
    _.extend(numberFormat, { // <=
      // If there is a maximum, then the minimum number of integer digits is fixed at one.
      digits: prePoint.length > numberFormat.digits ? 1 : numberFormat.digits,
      exponentPlus: exponent.charAt(0) === '+' || void 0,
      exponent: exponent.replace(/\D/g, '').length,
      exponentMultiple: prePoint.length > Math.max(numberFormat.digits, 1) ? prePoint.length : void 0,
      groups: void 0 // exponential numbers never have groups
    });
  }
  
  return numberFormat;
};

messageFormatPreprocess.number = function (object, data) {
  var locale = data.locale.toString();
  // add cldr information
  var meta = data.meta;
  if (! meta.hasOwnProperty('latnSymbols')) {
    var latnSymbols = cldr.extractNumberSymbols(locale, 'latn');
    meta['latnSymbols'] = _.pick(latnSymbols,
      'decimal',
      'group',
      'plusSign', // only required for exponent
      'minusSign', // only required for exponent
      'exponential',
      'infinity',
      'nan'
    );
  }
  // add object to store numberFormat description in
  if (! meta.hasOwnProperty('numberFormat')) {
    meta.numberFormat = {};
  }
  
  // type of number to print
  var type = (object.args && object.args[0]) || 'decimal';
  var formats = cldr.extractNumberFormats(locale, 'latn');
  var format = formats[type];
  
  // custom format
  if (format == null) {
    var key = object.rawArgs;
    meta.numberFormat[key] = parseNumberFormat(object.rawArgs, data);
    format = { ref: key };
  
  // localized format
  } else {
      // look at node-cldr documentation to get a roough feeling for whats happening
      // https://github.com/papandreou/node-cldr#cldrextractnumberformatslocaleidroot-numbersystemidlatn
      var length = (object.args && object.args[1]) || 'default';
      if (! format.hasOwnProperty(length)) {
        throw new Error("The number length '" + length
          + "' is unknown for a '" + type + "'");
      }
      
      var formatVariation = format[length];
      // the thousand etc are objects
      if (_.isObject(formatVariation)) {
        var key = type + ':' + length;
        meta.numberFormat[key] = {};
        meta.numberFormat.default = parseNumberFormat(format.default, data);
        
        // 1000 => one => format
        _.each(formatVariation, function (formats, startingNumber) {
          var formatList = meta.numberFormat[key][startingNumber] = {};
          _.each(_pluralFilter(formats), function (format, pluralForm) {
            format = parseNumberFormat(format, data);
            var divider = startingNumber / Math.pow(10, format.digits - 1);
            format.multiplicator = (format.multiplicator || 1) / divider;
            formatList[pluralForm] = format;
          });
        });
        
        format = { ref: key, method: 'number_switch' };
        messageFormatPreprocess.plural({}, data); // XXX trigger meta data
      
      // the normal basic numbers
      } else {
        var key = formatVariation;
        meta.numberFormat[key] = parseNumberFormat(formatVariation, data);
        format = { ref: key };
      }
  }
  
  return _.defaults(format, {
    name: object.name,
    method: object.method
  });
};
