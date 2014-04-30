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
  filter: function (input, options) {
    input = this.stringFilter.filter(input, options);
    return this.objectFilter.filter(input, options);
  }
};

var RX_VALID_KEY = /^\w+$/m; // only 0-9, a-z and _
var keyValid = function (key) {
  return RX_VALID_KEY.test(key);
}

/**
 * @param {string} baseKey
 * @param {mixed}  value
 * @param {Object.<string, *>} result
 * @param {Object.<string, *>} addition
 */
var parseValue = function (baseKey, value, result, options) {
  if (_.isObject(value) && ! _.isArray(value)) {
    var allValid = _.every(_.keys(value), keyValid);
    if (allValid) {
      _.each(value, function (currentValue, key) {
        var newKey = baseKey + "." + key;
        parseValue(newKey, currentValue, result, options);
      });
    } else {
      // if a key does not only contain wordchars
      // it could be more logic involved so pass it though
      result[baseKey] = value;
    }
  } else {
    // pass the value though all filters and add it
    result[baseKey] = ResourceHandler.filter(value, options);
  }
}

/**
 * Compiles the yaml string into an object.
 * @param {string} source
 * @param {string} locale
 * @return {object}
 */
var compileYaml = function (source, locale) {
  var doc = yaml.safeLoad(source);
  var parsedDoc = { $: {/* addition */} };
  _.each(doc, function (value, key) {
    if (! keyValid(key)) {
      var msg = "Only wordchars and underscores are allowed ";
      msg += "in translation keys. Got '" + baseKey + "'";
      throw new Error(msg);
    }
    parseValue(key, value, parsedDoc, {
      locale: locale,
      additions: parsedDoc.$
    });
  });
  return parsedDoc;
};

// compiler for .lang.yml files
var RX_FILE_ENDING = /\.([^\.]*)\.lang\.yml$/i;
var handler = function (compileStep, isLiterate) {
  try {
    var basePath = compileStep.inputPath;
    var locale = new Locale(basePath.match(RX_FILE_ENDING)[1]); // XXX array access
    var parsedDoc = compileYaml(compileStep.read().toString('utf8'), locale);
    var jsonString = JSON.stringify(parsedDoc);
    
    // add the files depending on client/server
    switch (compileStep.arch) {
      
      case 'browser':
        // save the file asset
        compileStep.addAsset({
          path: basePath + '.json', // XXX
          data: new Buffer(jsonString)
        });
        break;
        
      case 'os':
        // XXX this entire part is a hack for accessing assets on the server
        var fullPath = path.join(compileStep.rootOutputPath, basePath);
        var namespace = path.relative('/', fullPath).replace(RX_FILE_ENDING, '');
        
        var jsVar = 'Translator._namespaces[' + JSON.stringify(namespace) + ']';
        var js = '(' + jsVar + '||(' + jsVar + '={}))'; // obj for namespace
        js += '["' + locale.toString() + '"]=' + jsonString; // add value
        // add it as a js file for the server
        compileStep.addJavaScript({
          path: basePath,
          data: js,
          sourcePath: basePath,
          bare: false
        });
        break;
    }
    
  } catch (e) {
    compileStep.error({
      message: e.message,
      sourcePath: compileStep.inputPath
    });
  }
};

Plugin.registerSourceHandler("lang.yml", handler);
