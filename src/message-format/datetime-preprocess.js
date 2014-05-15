var cldr = Npm.require('cldr');

var convertCldrToMoment = function (dateString) {
  var replace = function (c, r) {
    var char = c.charAt(0);
    var rx = new RegExp('(^|[^' + char + '])' + c + '($|[^' + char + '])', 'g');
    dateString = dateString.replace(rx, '$1' + r + '$2');
  }
  //http://unicode.org/reports/tr35/tr35-6.html#Date_Format_Patterns
  // era (XXX missing support in moment)
  replace('G', '');
  // year
  replace('Y', 'GGGG'); // XXX no support for year without padding
  replace('YYY?', 'GG'); // XXX missing support for 3 digit year
  replace('YYYY', 'GGGG');
  replace('y', 'YYYY'); // XXX no support for year without padding
  replace('yyy?', 'YY'); // XXX missing support for 3 digit year
  replace('yyyy', 'YYYY');
  // quater
  //replace('Q', 'Q'); // native
  replace('QQ', '0Q');
  replace('QQQQ?', 'Q'); // XXX again missing support
  replace('q', 'Q');
  replace('qq', '0G');
  replace('qqqq?', 'Q'); // XXX again missing support
  // month
  // nearly native support, just misses the L variation
  dateString = dateString.replace(/L/g, 'M');
  // week
  // week of the year is equal
  // XXX week of the month is not supported
  // days
  replace('DD?', 'DDD'); // XXX
  replace('DDD', 'DDDD');
  replace('d', 'D');
  replace('dd', 'DD');
  // week day
  replace('EE?', 'dd');
  replace('EEE', 'ddd');
  replace('EEEE', 'dddd');
  replace('EEEEE', 'd'); // XXX
  // replace('e', 'e');
  replace('ee', '0e');
  replace('eee', 'ddd');
  replace('eeee', 'dddd');
  replace('eeeee', 'e'); // XXX
  replace('c', 'E');
  replace('cc', '0E');
  replace('ccc', 'ddd');
  replace('cccc', 'dddd');
  replace('ccccc', 'E'); // XXX
  // period
  // - compatible
  // hour
  replace('k', 'h'); // XXX
  replace('kk', 'hh'); // XXX
  replace('K', 'H'); // XXX
  replace('KK', 'HH'); // XXX
  // minutes
  // - compatible
  // secound
  replace('A+', ''); // XXX not supported
  // zone
  replace('z{1,3}', 'zz'); // FIXME deprecated in moment
  replace('Z{1,3}', 'ZZ');
  replace('ZZZZ', 'Z');
  replace('v{1,4}', ''); // XXX not supported
  
  // cldr uses another schema to escape literals
  dateString = dateString.replace(/'((?:[^']|'')+)'/g, function (a, content) {
    return '[' + content.replace("''", "'") + ']'; // moment uses [] for escaping
  });
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

var dateAndTime = function (object, data) {
  momentAddition(data);
  
  // either get the date or the time format
  var formats = object.method == 'date'
    ? cldr.extractDateFormats(data.locale.toString(), 'gregorian')
    : cldr.extractTimeFormats(data.locale.toString(), 'gregorian');
  var format = formats[object.rawArgs] || object.rawArgs || formats.medium;
  
  return {
    name: object.name,
    method: 'date', // there is just date at the client
    format: convertCldrToMoment(format)
  };
};

_.extend(messageFormatPreprocess, {
  date: dateAndTime,
  time: dateAndTime,
  // this method only exists on the server and will compile to date and time
  datetime: function (object, data) {
    var formats = cldr.extractDateTimePatterns(data.locale.toString(), 'gregorian');
    var format = formats[object.rawArgs] || (!object.rawArgs && formats.medium);
    
    // if the format is not found it is user-defined
    if (! _.isString(format)) {
      return dateAndTime(object, data);
    } else {
      var subFormats = object.args && object.rawArgs && (', ' + object.rawArgs) || '';
      format = format.replace(/\{1\}/g, '{' + object.name + ', date' + subFormats + '}');
      format = format.replace(/\{0\}/g, '{' + object.name + ', time' + subFormats + '}');
      return messageFormatPreprocess(format, data);
    }
  }
});
