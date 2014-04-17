var keywords = {
  "true": true,
  "false": false,
  "yes": true,
  "no": false,
  "on": true,
  "off": false,
  "Infinity": Infinity,
  "+Infinity": Infinity,
  "-Infinity": -Infinity,
  "NaN": NaN
};
var operators = [
  { // grouping
    rx: /^(.*)\(([^\(\)]+)\)(.*)$/,
    func: function (all, before, group, after, params) {
      return operator(before + operator(group, params) + after, params);
    }
  },

  // logical
  { // AND
    rx: /^(.+)\&\&(.+)$/,
    func: function (all, left, right, params) {
      return operator(left, params) && operator(right, params);
    }
  },
  { // OR
    rx: /^(.+)\|\|(.+)$/,
    func: function (all, left, right, params) {
      return operator(left, params) || operator(right, params);
    }
  },
  
  // compare
  { // AND, OR
    rx: /^(.+)([!=]=)(.+)$/,
    func: function (all, left, comperator, right, params) {
      switch (comperator) {
        case '==': return operator(left, params) == operator(right, params);
        case '!=': return operator(left, params) != operator(right, params);
      }
    }
  },
  { // GT, GTE, LT, LTE
    rx: /^(.+)([<>]=?)(.+)$/,
    func: function (all, left, comperator, right, params) {
      switch (comperator) {
        case '>=': return operator(left, params) >= operator(right, params);
        case '<=': return operator(left, params) <= operator(right, params);
        case '<':  return operator(left, params) <  operator(right, params);
        case '>':  return operator(left, params) >  operator(right, params);
      }
    }
  },
  
  // values
  { // parameter and keywords
    rx: /^\s*([a-z_]\w*)\s*$/i,
    func: function (all, key, params) {
      if (keywords.hasOwnProperty(key)) {
        return keywords[key];
      } else if (params.hasOwnProperty(key)) {
        return params[key];
      } else {
        throw new Error("Undefined parameter '" + key + "'");
      }
    }
  },
  { // literal
    rx: /^.*$/,
    func: function (string) {
      return JSON.parse(string);
    }
  }
];
var operator = Translator._operator = function (string, params) {
  for (var i = 0; i < operators.length; ++i) {
    var operator = operators[i];
    var matches = string.match(operator.rx);
    if (_.isArray(matches)) {
      matches.push(params); // add the params to the arguments
      return operator.func.apply(operator, matches);
    }
  }
  // this normally can not happen
  throw new Error("no operator matched '" + string + "'!");
}

// this filter function will replace placeholders with there value
Translator._filterCondition = function (object, options) {
  if (_.isObject(object)) {
    var parameters = options.parameters || {};
    var result = undefined;
    try {
      // because the order of objects in javascript is not spezified
      // only 1 condition must be true in any circumstance!
      // if 2 conditions are true warn
      for (var condition in object) {
        var isSpezial = condition.charAt(0) == '!';
        if (! isSpezial && operator(condition, parameters) == true) {
          if (result === undefined) {
            result = object[condition];
          } else {
            console.warn("Multiple conditions match for '" + options.key + "'");
          }
        }
      }
    } catch (e) {
      throw new Error(e.message + " (translation key '" + options.key + "')");
    }
    
    if (result === undefined) {
      if (object.hasOwnProperty('!default')) {
        result = object['!default'];
      } else {
        throw new Error("No condition matches for '" + options.key + "'");
      }
    }
    
    return result;
  } else {
    return object;
  }
};

Translator.objectFilter.prepend(Translator._filterCondition);
