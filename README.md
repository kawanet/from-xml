# fromXML - JavaScript Object (JSON) from XML

[![npm version](https://badge.fury.io/js/from-xml.svg)](http://badge.fury.io/js/from-xml) [![Build Status](https://travis-ci.org/kawanet/from-xml.svg?branch=master)](https://travis-ci.org/kawanet/from-xml)

## Features

- Simple: single parser function `fromXML(xml)` returns JavaScript Object.
- Small: XKB minified. less than 1KB gziped.
- Pure JavaScript: no dependency nor DOM needed.

## Usage

Node.js:

```js
var fromXML = require("from-xml").fromXML;
```

Browser:

```html
<script src="https://rawgit.com/kawanet/from-xml/master/dist/from-xml.min.js"></script>
```

```js
var xml = '<xml foo="FOO"><bar><baz>BAZ</baz></bar></xml>';
var data = fromXML(xml);
```

```json
{
  "xml": {
    "@foo": "FOO",
    "bar": {
      "baz": "BAZ"
    }
  }
}
```

## SEE ALSO

### NPM

- [https://www.npmjs.com/package/from-xml](https://www.npmjs.com/package/from-xml) - XML Parser
- [https://www.npmjs.com/package/to-xml](https://www.npmjs.com/package/to-xml) - XML Writer
- [https://www.npmjs.com/package/xml-objtree](https://www.npmjs.com/package/xml-objtree)

### GitHub

- [https://github.com/kawanet/from-xml](https://github.com/kawanet/from-xml)

## LICENSE

The MIT License (MIT)

Copyright (c) 2016 Yusuke Kawasaki

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
