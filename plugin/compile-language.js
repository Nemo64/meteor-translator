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
    var jsonDoc = JSON.stringify(parsedDoc);
    var filename = compileStep.inputPath + ".json";
    
    if (compileStep.arch == "browser") {
      // save the file asset
      compileStep.addAsset({
        path: filename,
        data: new Buffer(jsonDoc)
      });
    }
    
    if (compileStep.arch == "os") {
      // XXX this entire part is a hack for accessing assets on the server
      filename = compileStep.rootOutputPath + "/" + filename;
      // add it as a js file for the server
      compileStep.addJavaScript({
        path: compileStep.inputPath,
        data: //"typeof _LANG == 'undefined' && (_LANG = {});\n"
          "Translator._files[" + JSON.stringify(filename) + "] = " + jsonDoc,
        sourcePath: compileStep.inputPath,
        bare: false
      });
    }
    
  } catch (e) {
    compileStep.error({
      message: e.message,
      sourcePath: compileStep.inputPath
    });
  }
};

Plugin.registerSourceHandler("lang.yml", handler);
