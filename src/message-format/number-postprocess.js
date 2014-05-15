messageFormatPostprocess.number = function (object, data) {
  var parameter = data.parameters[object.name];
  var latnSymbols = data.meta.latnSymbols;
  
  var wrap = function (string) {
    var wrapper = object[parameter >= 0 ? '+' : '-'];
    return wrapper[0] + string + wrapper[1];
  };
  
  if (! _.isNumber(parameter) || _.isNaN(parameter)) {
    return latnSymbols.nan;
  }
  
  if (! _.isFinite(parameter)) {
    return wrap(latnSymbols.infinity);
  }
  
  parameter *= object.multiplicator || 1;
  
  if (! object.isScientific) {
    //var divider = (object.divider || 1) * Math.pow(10, object.maxPost || 0);
    //parameter = Math.round(parameter / divider) * divider;
    var absString = Math.abs(parameter).toFixed(object.maxPost);
    var number = absString.match(/^[^\.]*/)[0] || '0';
    var point = absString.replace(/^[^\.]*\./, '').replace(/0+$/, '');
    
    var groups = object.groups;
    var groupResult = [];
    var position = number.length;
    for (var i = 0; position > 0 ; (i + 1) < groups.length && ++i) {
      var groupLength = groups[i];
      position -= groupLength;
      if (position < 0) {
        groupLength += position;
        position = 0;
      }
      groupResult.unshift(number.substr(position, groupLength));
    }
    console.log(parameter, number, point, groupResult);
    
    var result = groupResult.join(latnSymbols.group);
    if (point.length > 0 && object.maxPost > 0) {
      result += latnSymbols.decimal + point.substr(0, object.maxPost);
    }
    return wrap(result);
  }
};
