var yaml = Npm.require('js-yaml');
var path = Npm.require('path');

/**
 * This general filter will outsource all pre compilation jobs!
 */
ResourceHandler = {
  /**
   * String filters are garanteed to get a string and must give a string.
   * These are ment to filter for words to replace or similar
   */
  stringFilter: new FilterList("stringFilter", _.isString),
  /**
   * This filter will do pre-compilation, meaning the result does not
   * have to be a string if it helps performing better. The result should
   * be handled in a Translator.objectFilter to create a string again!
   */
  objectFilter: new FilterList("objectFilter"),
  
  /**
   * shortcut to call both filters
   */
  filter: function (input, data) {
    input = this.stringFilter.filter(input, data);
    return this.objectFilter.filter(input, data);
  }
};

var RX_VALID_KEY = /^\w+$/; // only 0-9, a-z and _
var keyValid = function (key) {
  return RX_VALID_KEY.test(key);
}

/**
 * @param {string} baseKey
 * @param {mixed}  value
 * @param {Object.<string, *>} result
 * @param {Object.<string, *>} data
 */
var parseValue = function (baseKey, value, result, data) {
  if (_.isObject(value) && ! _.isArray(value)) {
    
    var allValid = _.every(_.keys(value), keyValid);
    if (allValid) {
      _.each(value, function (currentValue, key) {
        var newKey = baseKey + "." + key;
        parseValue(newKey, currentValue, result, data);
      });
    } else {
      // if a key does not only contain wordchars
      // it could be more logic involved so pass it though
      result[baseKey] = value;
    }
    
  } else {
    // pass the value though all filters and add it
    result[baseKey] = ResourceHandler.filter(value, data);
  }
}

/**
 * Compiles the yaml string into an object.
 * @param {*} doc
 * @param {Locale} locale
 * @return {object}
 */
var compile = function (doc, locale) {
  var compiledDoc = {
    $: {/* this key is for meta data */}
  };
  
  _.each(doc, function (value, key) {
    
    if (! keyValid(key)) {
      var msg = "Only wordchars and underscores are allowed ";
      msg += "in translation keys. Got '" + baseKey + "'";
      throw new Error(msg);
    }
    
    parseValue(key, value, compiledDoc, {
      locale: locale,
      meta: compiledDoc.$
    });
  });
  
  return compiledDoc;
};

// compiler for .lang.yml files
var RX_FILE_ENDING = /\.([^\.]*)\.lang\.(?:yml|json)$/i;
var handler = function (doc, compileStep, isLiterate) {
  var basePath = compileStep.inputPath;
  var locale = new Locale(basePath.match(RX_FILE_ENDING)[1]); // XXX array access
  
  var compiledDoc = compile(doc, locale);
  var jsonString = JSON.stringify(compiledDoc);
  
  var fullPath = path.join(compileStep.rootOutputPath, basePath);
  var namespace = path.relative('/', fullPath).replace(RX_FILE_ENDING, '');
  
  var js = 'Translator._data["' + locale + '"]=' + jsonString + ';\n';
  js += 'Translator._availableLocales["' + locale + '"]=new Translator.Locale("' + locale + '");';
  // FIXME merging
  
  // add it as a js file for the server
  compileStep.addJavaScript({
    path: basePath,
    data: js,
    sourcePath: basePath
  });
};

Plugin.registerSourceHandler(
  "lang.yml",
  {archMatching: 'os'},
  function (compileStep, isLiterate) {
  
    try {
      
      var source = compileStep.read().toString('utf8');
      var doc = yaml.safeLoad(source);
      handler(doc, compileStep, isLiterate);
      
    } catch (e) {
      
      compileStep.error({
        message: e.message,
        sourcePath: compileStep.inputPath
      });
      
    }
  }
);

Plugin.registerSourceHandler(
  "lang.json",
  {archMatching: 'os'},
  function (compileStep, isLiterate) {
  
    try {
      
      var source = compileStep.read().toString('utf8');
      var doc = JSON.parse(source);
      handler(doc, compileStep, isLiterate);
      
    } catch (e) {
      
      compileStep.error({
        message: e.message,
        sourcePath: compileStep.inputPath
      });
      
    }
  }
);
