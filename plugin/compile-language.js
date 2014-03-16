var yaml = Npm.require("js-yaml");

/**
 * @param {string} baseKey
 * @param {mixed}  value
 * @param {Object.<string, string>} result
 */
var parseValue = function (baseKey, value, result) {
  if (_.isObject(value) && ! _.isArray(value)) {
    _.each(value, function (value, key) {
      parseValue(baseKey + "." + key, value, result);
    });
  } else {
    result[baseKey] = value;
  }
}

var handler = function (compileStep, isLiterate) {
  var source = compileStep.read().toString("utf8");
  try {
    var doc = yaml.safeLoad(source);
    
    // parse the document
    var parsedDoc = {};
    _.each(doc, function (value, key) {
      parseValue(key, value, parsedDoc);
    });
    
    // save the file asset
    compileStep.addAsset({
      path: compileStep.inputPath + ".json",
      data: new Buffer(JSON.stringify(parsedDoc))
    });
    
  } catch (e) {
    compileStep.error({
      message: e.message,
      sourcePath: compileStep.inputPath
    });
  }
};

Plugin.registerSourceHandler("lang.yml", handler);
