// this pre compiler will parse message-format strings
// and add cldr information if that is nessesary.
//
// modified messages will be arrays which will be joined later

MessageFormatPreprocess = {/*
  "plural": function () {},
  "select": function () {}
*/};

var preProcessObject = function (object, data) {
  if (object.method == null) {
    return object;
  }
  if (MessageFormatPreprocess.hasOwnProperty(object.method)) {
    return MessageFormatPreprocess[object.method](object, data);
  } else {
    throw new Error("There is no message-format method " + object.method);
  }
};

/**
 * Creates a special push function that has the array bound to it.
 * Also 2 strings will be joined automatically and strings will be escaped.
 */
var createPush = function (array) {
  return function (obj) {
    if (_.isString(obj)) {
      if (obj === "") {
        return;
      }
      obj = obj.replace("''", "'");
      // 2 strings can be simply merged
      if (_.isString(array[array.length-1])) {
        obj = array.pop() + obj;
      }
    }
    if (_.isArray(obj)) {
      array.push.apply(array, obj);
    } else {
      array.push(obj);
    }
  }
};

/**
 * A simple trim function
 */
var trim = function (string) {
  return string.match(/^\s*(.*?)\s*$/m)[1];
};

/**
 * This is the initial parser for the string.
 * Every time a text is expected this is the parser for it.
 *
 * @param {string} string the string to parse
 * @param {function(*)} push a push function from #createPush
 * @param {Object.<string, *>} data
 * @param {string} parentVarName
 * @return {string} everything after an unescapoed "}"
 */
var parseLiteral = function (string, push, data, parentVarName) {
  for (var i = 0; i < 1000; ++i) {
    var tokenPosition = string.search(/'[^']|[{}#]/); // search ', {, } and #
    var char = string.charAt(tokenPosition);
    var before = string.substr(0, tokenPosition);
    string = string.substr(tokenPosition + 1);
    switch (char) {
      
      case "'":
        push(before);
        var endPosition = string.search(/'(?!')/); // search the end quote
        push(string.substr(0, endPosition));
        string = string.substr(endPosition + 1); // cut the end quote off
        break;
      case "{":
        push(before);
        string = parsePattern(string, push, data);
        break;
      case "#":
        push(before);
        push(parentVarName ? { name: parentVarName } : "#");
        break;
      
      case "":
        push(string);
        return "";
      default:
        push(before);
        return string; // could be the end of a pattern parameter
    }
  }
  throw new SyntaxError("literal parsing error: " + string);
};

/**
 * This parser is for the message-format patterns.
 * This implementation is limited to 3 variants.
 * - {variable}
 * - {variable, method, [...]}
 * - {variable, method, [...], p1{literal} p2{literal}}
 * 
 * @param {string} string the string to parse
 * @param {function(*)} push a push function from #createPush
 * @param {Object.<string, *>} data
 * @return {string} everything after the closing "}"
 */
var parsePattern = function (string, push, data) {
  string = string.replace(/^\{\s*/); // remove first {
  var object = {/*
    name: null, // name of the variable
    method: null, // method to use
    args: [], // additional arguments
    hash: {} // all strings with key
  */};
  
  for (var i = 0; i < 1000; ++i) {
    var tokenPosition = string.search(/[,{}]/); // search ', { and }
    var before = string.substr(0, tokenPosition);
    var char = string.charAt(tokenPosition);
    string = string.substr(tokenPosition + 1);
    switch (char) {
    
      case "}":
        // after the third parameter part it ends here
        if (/^\s*$/m.test(before)) {
          push(preProcessObject(object, data));
          return string;
        }
        // NO BREAK
      case ",":
        if (object.name == null) {
          object.name = trim(before);
        } else if (object.method == null) {
          object.method = trim(before);
        } else {
          if (object.args == null) object.args = [];
          object.args.push(trim(before));
        }
        if (char == "}") {
          push(preProcessObject(object, data));
          return string; // end with less than 3 parts
        }
        break;
        
      case "{":
        // it this is the third part
        if (object.name != null && object.method != null) {
          object.hash = {};
          string = parsePatternHash(before + "{" + string, object, data);
        } else {
          throw new SyntaxError("pattern parts are in the wrong order");
        }
    }
  }
  throw new SyntaxError("pattern parsing error: " + string);
}

/**
 * Parses the third part of a message-format pattern.
 *
 * @param {string} string the string to parse
 * @param {Object.<string, *>} object The object that'll later be in the json
 * @param {Object.<string, *>} data
 * @return {string} everything after the closing "}"
 */
var parsePatternHash = function (string, object, data) {
if (object == null) throw new Error("wat?");
  for (var i = 0; i < 1000; ++i) {
    var tokenPosition = string.search(/[{}]/);
    var name = trim(string.substr(0, tokenPosition));
    var char = string.charAt(tokenPosition);
    string = string.substr(tokenPosition + 1); // always strip that char
    switch (char) {
      case "{":
        var result = [];
        string = parseLiteral(string, createPush(result), data, object.name);
        object.hash[name] = optimizeResult(result);
        break;
      default:
        return "}" + string;
    }
  }
  throw new SyntaxError("pattern hash parsing error: " + string);
}

var optimizeResult = function (result) {
  return (result.length === 1 && _.isString(result[0])) ? result[0] : result;
}

messageFormatPreprocess = function (input, data) {
  if (! _.isString(input)) {
    return input;
  }

  var result = [];
  var leftOver = parseLiteral(input, createPush(result), data);
  if (leftOver.length > 0) {
    throw new SyntaxError("Invalid patterns in '" + input + "':" + leftOver);
  }
  
  // only use the modification if it changed something
  return optimizeResult(result);
};

ResourceHandler.objectFilter.append(messageFormatPreprocess);
