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