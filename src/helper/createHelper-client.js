Translator.prototype.createHelper = function () {
  var self = this;
  return function (key, kw) {
    return self.get(key, _.isObject(kw) ? kw.hash : {});
  }
};
