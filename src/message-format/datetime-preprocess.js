var cldr = Npm.require('cldr');

var convertCldrToMoment = function (dateString) {
  dateString = dateString.replace(/d/g, 'D'); // moment uses caps days
  dateString = dateString.replace(/y/g, 'Y'); // moment uses caps year
  dateString = dateString.replace(/(^|[^Y])Y($|[^Y])/g, '$1YYYY$2'); // one Y = YYYY
  dateString = dateString.replace(/E/g, 'd'); // E=d otherwise it's the same
  dateString = dateString.replace(/zzz/g, 'zz'); // FIXME deprecated by moment
  dateString = dateString.replace(/(^|[^G])G($|[^G])/g, '$1[AD]$1'); // FIXME moment does not support AD/BC
  return dateString;
};

var momentAddition = function (data) {
  // add cldr information
  var meta = data.meta;
  if (! meta.hasOwnProperty('moment')) {
    var locale = data.locale.toString();
    var months = cldr.extractMonthNames(locale, 'gregorian').format;
    var days = cldr.extractDayNames(locale, 'gregorian').format;
    meta['moment'] = {
      months: months.wide,
      monthsShort: months.abbreviated,
      weekdays: days.wide,
      weekdaysShort: days.abbreviated,
      weekdaysMin: days.short,
      /*longDateFormat: {
          LT: "HH:mm [Uhr]",
          L: "DD.MM.YYYY",
          LL: "D. MMMM YYYY",
          LLL: "D. MMMM YYYY LT",
          LLLL: "dddd, D. MMMM YYYY LT"
      },
      calendar: {
          sameDay: "[Heute um] LT",
          sameElse: "L",
          nextDay: '[Morgen um] LT',
          nextWeek: 'dddd [um] LT',
          lastDay: '[Gestern um] LT',
          lastWeek: '[letzten] dddd [um] LT'
      },
      relativeTime : {
          future: "in %s",
          past: "vor %s",
          s: "ein paar Sekunden",
          m: processRelativeTime,
          mm: "%d Minuten",
          h: processRelativeTime,
          hh: "%d Stunden",
          d: processRelativeTime,
          dd: processRelativeTime,
          M: processRelativeTime,
          MM: processRelativeTime,
          y: processRelativeTime,
          yy: processRelativeTime
      },
      ordinal: '%d.',
      week: {
          dow: 1, // Monday is the first day of the week.
          doy: 4  // The week that contains Jan 4th is the first week of the year.
      }*/
    };
  }
};

MessageFormatPreprocess.date = function (object, data) {
  momentAddition(data);
  var formats = cldr.extractDateFormats(data.locale.toString(), 'gregorian');
  var format = (object.args && formats[object.args[0]]) || formats.medium;
  return {
    name: object.name,
    method: object.method,
    format: convertCldrToMoment(format)
  };
};
MessageFormatPreprocess.time = function (object, data) {
  //momentAddition(data); // not needed for time
  var formats = cldr.extractTimeFormats(data.locale.toString(), 'gregorian');
  var format = (object.args && formats[object.args[0]]) || formats.short;
  return {
    name: object.name,
    method: object.method,
    format: convertCldrToMoment(format)
  };
};
MessageFormatPreprocess.duration = function (object, data) {
  momentAddition(data);
};
