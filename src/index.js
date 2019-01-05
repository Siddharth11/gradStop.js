import {
  getStops,
  handleErrors,
} from './utils';

const defaultOptions = {
    // input color options: hex, rgb or hsl
    inputFormat: 'hex',
    // number of color stops (cannot be less than colorArray.length)
    stops: 5,
    // input color array
    colorArray: ['#fff', '#000']
}

function gradstop(options) {
  options = { ...defaultOptions, ...options };
  handleErrors(options);
  const stops =  getStops(options);
  return stops;
}

module.exports = gradstop;
