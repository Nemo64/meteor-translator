var yaml = Npm.require("js-yaml");

var handler = function (compileStep, isLiterate) {
  var source = compileStep.read().toString("utf8");
  try {
  
    // parse the language file
    var doc = yaml.safeLoad(source);
    compileStep.addAsset({
      path: compileStep.inputPath + ".json",
      data: new Buffer(JSON.stringify(doc))
    });
    
  } catch (e) {
    compileStep.error({
      message: e.message,
      sourcePath: compileStep.inputPath
    });
  }
};

Plugin.registerSourceHandler("lang.yml", handler);
