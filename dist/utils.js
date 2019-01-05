'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var mathTrunc = function () {
  if (Math.trunc) {
    return Math.trunc;
  }
  return function (x) {
    return x === 0 ? x : x < 0 ? Math.ceil(x) : Math.floor(x);
  };
}();

var handleErrors = exports.handleErrors = function handleErrors(options) {
  var inputFormat = options.inputFormat,
      stops = options.stops,
      colorArray = options.colorArray;


  if (typeof inputFormat !== 'string') {
    throw 'inputFormat should be a string';
  }

  var supportedFormats = ['hex', 'rgb', 'hsl'];
  var isValidFormat = supportedFormats.indexOf(inputFormat.toLowerCase()) !== -1;
  if (!isValidFormat) {
    throw 'Invalid inputFormat value, supported: hex, rgb and hsl';
  }

  if (!Number.isInteger(stops)) {
    throw 'stops should be an integer';
  }

  if (!Array.isArray(colorArray) || !colorArray.every(function (item) {
    return typeof item === 'string';
  })) {
    throw 'colorArray should be an array of color strings';
  }

  if (stops < colorArray.length) {
    throw 'Number of stops cannot be less than colorArray.length';
  }
};

var hexToRgb = exports.hexToRgb = function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var _result$map = result.map(function (val) {
    return parseInt(val, 16);
  }),
      _result$map2 = _slicedToArray(_result$map, 4),
      r = _result$map2[1],
      g = _result$map2[2],
      b = _result$map2[3];

  return result ? { r: r, g: g, b: b } : null;
};

// if hex and defined as #fff then convert it to standard 7 letter format #ffffff
var standardizeHexValues = exports.standardizeHexValues = function standardizeHexValues(arrayOfHexStrings) {
  return arrayOfHexStrings.map(function (str) {
    if (str.length === 4) {
      return '#' + (str[1] + str[1] + str[2] + str[2] + str[3] + str[3]);
    } else if (str.length === 7) {
      return str;
    }
  });
};

var extractHEX = exports.extractHEX = function extractHEX(arrayOfHexStrings) {
  return standardizeHexValues(arrayOfHexStrings).map(function (str) {
    return hexToRgb(str);
  });
};

var extractRGB = exports.extractRGB = function extractRGB(arrayOfRGBStrings) {
  return arrayOfRGBStrings.map(function (str) {
    var _str$match = str.match(/\d+/g),
        _str$match2 = _slicedToArray(_str$match, 3),
        r = _str$match2[0],
        g = _str$match2[1],
        b = _str$match2[2];

    return { r: Number(r), g: Number(g), b: Number(b) };
  });
};

var extractHSL = exports.extractHSL = function extractHSL(arrayOfHSLStrings) {
  return arrayOfHSLStrings.map(function (str) {
    var _str$match3 = str.match(/\d+/g),
        _str$match4 = _slicedToArray(_str$match3, 3),
        h = _str$match4[0],
        s = _str$match4[1],
        l = _str$match4[2];

    return { h: Number(h), s: Number(s), l: Number(l) };
  });
};

var getRGBString = exports.getRGBString = function getRGBString(_ref) {
  var r = _ref.r,
      g = _ref.g,
      b = _ref.b;
  return 'rgb(' + r + ', ' + g + ', ' + b + ')';
};
var getHSLString = exports.getHSLString = function getHSLString(_ref2) {
  var h = _ref2.h,
      s = _ref2.s,
      l = _ref2.l;
  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
};

// get r,g,b,h,s and l with Bezier interpolation
// https://www.cl.cam.ac.uk/teaching/2000/AGraphHCI/SMEG/node3.html
// Check issue #3 for more info
var bezierInterpolation = exports.bezierInterpolation = function bezierInterpolation(colorTypeChars) {
  return function (colArr, x) {
    var y = 1 - x;
    var v = void 0;
    return colorTypeChars.map(function (c) {
      if (colArr.length === 2) {
        v = y * colArr[0][c] + x * colArr[1][c];
      } else if (colArr.length === 3) {
        v = Math.pow(y, 2) * colArr[0][c] + 2 * y * x * colArr[1][c] + Math.pow(x, 2) * colArr[2][c];
      } else if (colArr.length === 4) {
        v = Math.pow(y, 3) * colArr[0][c] + 3 * Math.pow(y, 2) * x * colArr[1][c] + 3 * y * Math.pow(x, 2) * colArr[2][c] + Math.pow(x, 3) * colArr[3][c];
      }
      return mathTrunc(v);
    });
  };
};

var rgbBezierInterpolation = bezierInterpolation(['r', 'g', 'b']);
var hslBezierInterpolation = bezierInterpolation(['h', 's', 'l']);

var transformColorStringsToObjects = exports.transformColorStringsToObjects = function transformColorStringsToObjects(options) {
  switch (options.inputFormat) {
    case 'hex':
      return extractHEX(options.colorArray);
    case 'rgb':
      return extractRGB(options.colorArray);
    case 'hsl':
      return extractHSL(options.colorArray);
  }
};

var stopsGenerator = exports.stopsGenerator = function stopsGenerator(options) {
  var outputArray = [];
  var increment = 1.0 / (options.stops - 1);

  for (var i = 0; i < options.stops; i++) {
    if (options.inputFormat === 'hex' || options.inputFormat === 'rgb') {
      var _rgbBezierInterpolati = rgbBezierInterpolation(options.colorArray, increment * i),
          _rgbBezierInterpolati2 = _slicedToArray(_rgbBezierInterpolati, 3),
          r = _rgbBezierInterpolati2[0],
          g = _rgbBezierInterpolati2[1],
          b = _rgbBezierInterpolati2[2];

      outputArray.push(getRGBString({ r: r, g: g, b: b }));
    } else if (options.inputFormat === 'hsl') {
      var _hslBezierInterpolati = hslBezierInterpolation(options.colorArray, increment * i),
          _hslBezierInterpolati2 = _slicedToArray(_hslBezierInterpolati, 3),
          h = _hslBezierInterpolati2[0],
          s = _hslBezierInterpolati2[1],
          l = _hslBezierInterpolati2[2];

      outputArray.push(getHSLString({ h: h, s: s, l: l }));
    }
  }

  return outputArray;
};

var getStops = exports.getStops = function getStops(options) {
  var colorArray = transformColorStringsToObjects(options);
  var optionsWithFormattedColorsValues = _extends({}, options, { colorArray: colorArray });
  return stopsGenerator(optionsWithFormattedColorsValues);
};