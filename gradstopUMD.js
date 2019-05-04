(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gradstop = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("./utils");

const defaultOptions = {
  // input color options: hex, rgb or hsl
  inputFormat: 'hex',
  // number of color stops (cannot be less than colorArray.length)
  stops: 5,
  // input color array
  colorArray: ['#fff', '#000']
};

var _default = options => {
  options = { ...defaultOptions,
    ...options
  };
  (0, _utils.handleErrors)(options);
  const stops = (0, _utils.getStops)(options);
  return stops;
};

exports.default = _default;
},{"./utils":2}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStops = exports.getHSLString = exports.getRGBString = exports.extractHSL = exports.extractRGB = exports.extractHEX = exports.standardizeHexValues = exports.hexToRgb = exports.handleErrors = void 0;

const handleErrors = options => {
  const {
    inputFormat,
    stops,
    colorArray
  } = options;

  if (typeof inputFormat !== 'string') {
    throw 'inputFormat should be a string';
  }

  const supportedFormats = ['hex', 'rgb', 'hsl'];
  const isValidFormat = supportedFormats.indexOf(inputFormat.toLowerCase()) !== -1;

  if (!isValidFormat) {
    throw 'Invalid inputFormat value, supported: hex, rgb and hsl';
  }

  if (!Number.isInteger(stops)) {
    throw 'stops should be an integer';
  }

  if (!Array.isArray(colorArray) || !colorArray.every(item => typeof item === 'string')) {
    throw 'colorArray should be an array of color strings';
  }

  if (stops < colorArray.length) {
    throw 'Number of stops cannot be less than colorArray.length';
  }
};

exports.handleErrors = handleErrors;

const hexToRgb = hex => {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  let [, r, g, b] = result.map(val => parseInt(val, 16));
  return result ? {
    r,
    g,
    b
  } : null;
}; // if hex and defined as #fff then convert it to standard 7 letter format #ffffff


exports.hexToRgb = hexToRgb;

const standardizeHexValues = arrayOfHexStrings => arrayOfHexStrings.map(str => {
  if (str.length === 4) {
    return `#${str[1] + str[1] + str[2] + str[2] + str[3] + str[3]}`;
  } else if (str.length === 7) {
    return str;
  }
});

exports.standardizeHexValues = standardizeHexValues;

const extractHEX = arrayOfHexStrings => standardizeHexValues(arrayOfHexStrings).map(str => hexToRgb(str));

exports.extractHEX = extractHEX;

const extractRGB = arrayOfRGBStrings => arrayOfRGBStrings.map(str => {
  const [r, g, b] = str.match(/\d+/g);
  return {
    r: Number(r),
    g: Number(g),
    b: Number(b)
  };
});

exports.extractRGB = extractRGB;

const extractHSL = arrayOfHSLStrings => arrayOfHSLStrings.map(str => {
  const [h, s, l] = str.match(/\d+/g);
  return {
    h: Number(h),
    s: Number(s),
    l: Number(l)
  };
});

exports.extractHSL = extractHSL;

const getRGBString = ({
  r,
  g,
  b
}) => `rgb(${r}, ${g}, ${b})`;

exports.getRGBString = getRGBString;

const getHSLString = ({
  h,
  s,
  l
}) => `hsl(${h}, ${s}%, ${l}%)`; // get r,g,b,h,s and l with Bezier interpolation
// https://www.cl.cam.ac.uk/teaching/2000/AGraphHCI/SMEG/node3.html
// Check issue #3 for more info


exports.getHSLString = getHSLString;

const bezierInterpolation = colorTypeChars => (colArr, x) => {
  let y = 1 - x;
  let v;
  return colorTypeChars.reduce((colorObject, char) => {
    if (colArr.length === 2) {
      v = y * colArr[0][char] + x * colArr[1][char];
    } else if (colArr.length === 3) {
      v = y ** 2 * colArr[0][char] + 2 * y * x * colArr[1][char] + x ** 2 * colArr[2][char];
    } else if (colArr.length === 4) {
      v = y ** 3 * colArr[0][char] + 3 * y ** 2 * x * colArr[1][char] + 3 * y * x ** 2 * colArr[2][char] + x ** 3 * colArr[3][char];
    }

    colorObject[char] = Math.trunc(v);
    return colorObject;
  }, {});
};

const rgbBezierInterpolation = bezierInterpolation(['r', 'g', 'b']);
const hslBezierInterpolation = bezierInterpolation(['h', 's', 'l']);

const transformColorStringsToObjects = options => {
  switch (options.inputFormat) {
    case 'hex':
      return extractHEX(options.colorArray);

    case 'rgb':
      return extractRGB(options.colorArray);

    case 'hsl':
      return extractHSL(options.colorArray);
  }
};

const stopsGenerator = options => {
  const outputArray = [];
  const increment = 1.0 / (options.stops - 1);

  for (let i = 0; i < options.stops; i++) {
    if (options.inputFormat === 'hex' || options.inputFormat === 'rgb') {
      let rgbObject = rgbBezierInterpolation(options.colorArray, increment * i);
      outputArray.push(getRGBString(rgbObject));
    } else if (options.inputFormat === 'hsl') {
      let hslObject = hslBezierInterpolation(options.colorArray, increment * i);
      outputArray.push(getHSLString(hslObject));
    }
  }

  return outputArray;
};

const getStops = options => {
  const colorArray = transformColorStringsToObjects(options);
  const optionsWithFormattedColorsValues = { ...options,
    colorArray
  };
  return stopsGenerator(optionsWithFormattedColorsValues);
};

exports.getStops = getStops;
},{}],3:[function(require,module,exports){
module.exports = require('./dist');
},{"./dist":1}]},{},[3])(3)
});
