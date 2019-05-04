# gradstop

<p>
  <a href="https://www.npmjs.com/package/gradstop">
    <img src="https://badge.fury.io/js/gradstop.svg" alt="NPM Version">
  </a>
  <a href="https://npmcharts.com/compare/gradstop">
    <img src="https://img.shields.io/npm/dm/gradstop.svg" alt="NPM Downloads">
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  </a>
  <a href="https://travis-ci.com/Siddharth11/gradstop">
    <img src="https://travis-ci.com/Siddharth11/gradstop.svg?branch=master" alt="Build Status">
  </a>
</p>

#### JavaScript micro library to generate gradient color stops

| [Demo](http://codepen.io/Siddharth11/full/RPvJmO)  | [UMD Bundle](https://cdn.jsdelivr.net/gh/Siddharth11/gradstop/gradstopUMD.js) |
|---|---|

### Usage:

```
npm install gradstop
```

``` javascript
import gradstop from 'gradstop';

const gradient = gradstop({
    stops: 5,
    inputFormat: 'hex',
    colorArray: ['#343838', '#00DFFC']
});

console.log(gradient);
// rgb(52,56,56), rgb(39,97,105), rgb(26,139,154), rgb(13,181,203), rgb(0,223,252)
```

<img src="gradient strip.png" alt="Gradient Strip" />

<br />

#### Default Parameters:
 * inputFormat: 'hex' (supports hex, rgb and hsl)
 * stops: 5
 * colorArray: ['#fff', '#000'] \(supports upto 4 values)

Both shorthand(#fff) and standard(#ffffff) format hex values are supported.
