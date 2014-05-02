var createMoment = function (value, data) {
  var locale = "translator-" + data.locale.toString(); // prefixed locale
  var before = moment.lang();
  moment.lang(locale, data.meta.postprocess);
  moment.lang(before); // don't screw with the global language
  return moment(value).lang(locale);
};

MessageFormatPostprocess.date = function (object, data) {
  var parameter = data.parameters[object.name];
  var moment = createMoment(parameter, data);
  return moment.format(object.format);
};
MessageFormatPostprocess.time = function (object, data) {
  var parameter = data.parameters[object.name];
  var moment = createMoment(parameter, data);
  return moment.format(object.format);
};
MessageFormatPostprocess.duration = function (object, data) {
  var parameter = data.parameters[object.name];
  //return moment(parameter).format(object.format);
};
