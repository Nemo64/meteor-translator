var createMoment = function (value, data) {
  var locale = "translator-" + data.locale.toString(); // prefixed locale
  var before = moment.locale();
  moment.locale(locale, data.meta.moment);
  moment.locale(before); // don't screw with the global language
  var instance = moment(value);
  return instance != null ? instance.locale(locale) : null;
};

messageFormatPostprocess.date = function (object, data) {
  var parameter = data.parameters[object.name];
  var moment = createMoment(parameter, data);
  return moment != null ? moment.format(object.format) : "Invalid date";
};
