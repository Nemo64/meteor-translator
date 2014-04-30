// this pre compiler will parse message-format strings
// and add cldr information if that is nessesary.
//
// modified messages will be arrays which will be joined later

MessageFormatPreprocess = {/*
  "plural": function () {},
  "select": function () {}
*/};

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
    array.push(obj);
  }
};

/**
 * This is the initial parser for the string.
 * Every time a text is expected this is the parser for it.
 *
 * @param {string} string the string to parse
 * @param {function(*)} push a push function from #createPush
 * @return {string} everything after an unescapoed "}"
 */
var parseLiteral = function (string, push) {
  for (var i = 0; i < 1000; ++i) {
    var tokenPosition = string.search(/'[^']|[{}]/); // search ', { and }
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
        string = parsePattern(string, push);
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
 * - {variable, method}
 * - {variable, method, p1{literal} p2{literal}}
 * 
 * @param {string} string the string to parse
 * @param {function(*)} push a push function from #createPush
 * @return {string} everything after the closing "}"
 */
var parsePattern = function (string, push) {
  string = string.replace(/^\{\s*/); // remove first {
  var object = {/*
    name: null,
    method: null,
    hash: {}
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
          push(object);
          return string;
        }
        // NO BREAK
      case ",":
        if (object.name == null) {
          object.name = before;
        } else if (object.method == null) {
          object.method = before;
        } else {
          throw new SyntaxError("too many parts in pattern, found " + before);
        }
        if (char == "}") {
          push(object);
          return string; // end with less than 3 parts
        }
        break;
        
      case "{":
        // it this is the third part
        if (object.name != null && object.method != null) {
          object.hash = {};
          string = parsePatternHash(before + "{" + string, object);
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
 * @return {string} everything after the closing "}"
 */
var parsePatternHash = function (string, object) {
        console.log(string);
  for (var i = 0; i < 1000; ++i) {
    var tokenPosition = string.search(/[{}]/);
    var name = string.substr(0, tokenPosition);
    var char = string.charAt(tokenPosition).match(/^\s*(.*?)\s*$/m)[1];
    string = string.substr(tokenPosition + 1); // always strip that char
    switch (char) {
      case "{":
        var result = [];
        string = parseLiteral(string, createPush(result));
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

var handler = function (input, options) {
  if (! _.isString(input)) {
    return input;
  }

  var result = [];
  var leftOver = parseLiteral(input, createPush(result));
  if (leftOver.length > 0) {
    throw new SyntaxError("Invalid patterns in '" + input + "':" + leftOver);
  }
  
  // only use the modification if it changed something
  return optimizeResult(result);
};

ResourceHandler.objectFilter.append(handler);
