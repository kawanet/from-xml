# fromXML - Pure JavaScript XML Parser

[![npm version](https://badge.fury.io/js/from-xml.svg)](http://badge.fury.io/js/from-xml) [![Build Status](https://travis-ci.org/kawanet/from-xml.svg?branch=master)](https://travis-ci.org/kawanet/from-xml)

**Live Demo: [https://kawanet.github.io/from-xml/](https://kawanet.github.io/from-xml/)**

## FEATURES

- Simple: single parser function `fromXML(xml)` which returns JavaScript Object.
- Small: 2KB minified, 1KB gzipped.
- Standalone: no external module dependency nor DOM needed.

## SYNOPSIS

Node.js:

```js
var fromXML = require("from-xml").fromXML;
```

Browser:

```html
<script src="https://rawgit.com/kawanet/from-xml/master/dist/from-xml.min.js"></script>
```

Run:

```js
var xml = '<xml foo="FOO"><bar><baz>BAZ</baz></bar></xml>';

var data = fromXML(xml);

console.warn(data.xml.bar.baz); // => "BAZ"

console.warn(data.xml["@foo"]); // => "FOO"
```

## EXAMPLES

XML:

```xml
<xml foo="FOO">
  <bar>
    <baz>BAZ</baz>
  </bar>
</xml>
```

JavaScript:

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

### Empty Element

XML:

```xml
<xml>
  <foo/>
  <bar></bar>
  <qux quux="QUUX"/>
</xml>
```

JavaScript:

```json
{
  "xml": {
    "foo": null,
    "bar": "",
    "qux": {
      "@quux": "QUUX"
    }
  }
}
```

### Empty Attribute

XML:

```xml
<xml>
  <foo bar="" baz/>
</xml>
```

JavaScript:

```json
{
  "xml": {
    "foo": {
      "@bar": "",
      "@baz": null
    }
  }
}
```

### Multiple Child Nodes

XML:

```xml
<xml>
  <foo>BAR</foo>
  <foo>BAZ</foo>
  <foo>QUX</foo>
</xml>
```

JavaScript:

```json
{
  "xml": {
    "foo": ["BAR", "BAZ", "QUX"]
  }
}
```

### Text Node with Attribute

XML:

```xml
<xml>
  <foo bar="BAR">
    BAZ
  </foo>
</xml>
```

JavaScript:

```json
{
  "xml": {
    "foo": {
      "@bar": "BAR",
      "#": "BAZ"
    }
  }
}
```

## Force array to provide uniform structer

Useful when have to handle elements with array of items that sometimes have one element inside.

XML:

```xml
<xml>
  <foo bar="BAR">
    BAZ
  </foo>
</xml>
```

Code:

```js
fromXml(xml, {forceArray:true});
```

JavaScript:

```json
{
  "xml": [
    {
      "foo": [
        {
          "@bar": "BAR",
          "#": "BAZ"
        }
      ]
    }
  ]
}
```

## CLI

```sh
$ echo '<foo bar="BAR"><buz>BUZ</buz></foo>' | ./node_modules/.bin/xml2json -2
{
  "foo": {
    "@bar": "BAR",
    "buz": "BUZ"
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

### Tests

- [https://kawanet.github.io/from-xml/](https://kawanet.github.io/from-xml/)
- [https://travis-ci.org/kawanet/from-xml](https://travis-ci.org/kawanet/from-xml)
- [https://rawgit.com/kawanet/from-xml/master/test/test.html](https://rawgit.com/kawanet/from-xml/master/test/test.html)

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
