messageFormatPreprocess.number = function (object, data) {
  // add cldr information
  var meta = data.meta;
  if (! meta.hasOwnProperty('numeral')) {
    meta['numeral'] = null;
  }
  return object;
};
