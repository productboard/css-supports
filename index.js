var _cacheSupports = {};

function parse(propertyName, reg) {
  return propertyName.split(reg).slice(1, -1);
}

function cssSupports(propertyName, value) {
  var style = document.createElement('div').style;

  // 1 argument
  if (typeof value === 'undefined') {
    // The regex will do this '( a:b ) or ( c:d )' => [" a:b ", " c:d "]
    var arrOr = parse(propertyName, /(?:^\(|\)\s*or\s*\(|\)$)/gi);
    if (arrOr) {
      return arrOr.some(function(condition) { return supports.apply(null, condition.split(':')); });
    }
    var arrAnd = parse(propertyName, /(?:^\(|\)\s*and\s*\(|\)$)/gi);
    if (arrAnd) {
      return arrAnd.every(function(condition) { return supports.apply(null, condition.split(':')); });
    }

    style.cssText = propertyName;
  // 2 arguments
  } else {
    style.cssText = propertyName + ':' + value;
  }

  return !!style.length;
}

function supports(propertyName, value) {
  propertyName = typeof propertyName !== 'undefined' &&
    String.prototype.trim.call(propertyName);
  value = typeof value !== 'undefined' &&
    String.prototype.trim.call(value) || undefined;

  if (!propertyName || (arguments.length === 2 && !value)) return false;

  var key = [propertyName, value].toString();
  if (key in _cacheSupports) {
    return _cacheSupports[key];
  }

  return _cacheSupports[key] = cssSupports(propertyName, value);
}

function shim() {
  if (!('CSS' in window)) {
    window.CSS = {};
  }

  if (!('supports' in window.CSS)) {
    window.CSS.supports = supports;
  }
}

module.exports = supports;
module.exports.shim = shim;
