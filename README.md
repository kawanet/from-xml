# fromXML - Pure JavaScript XML Parser

[![Node.js CI](https://github.com/kawanet/from-xml/workflows/Node.js%20CI/badge.svg?branch=main)](https://github.com/kawanet/from-xml/actions/)
[![npm version](https://badge.fury.io/js/from-xml.svg)](https://www.npmjs.com/package/from-xml)
[![gzip size](https://img.badgesize.io/https://unpkg.com/from-xml/dist/from-xml.min.js?compression=gzip)](https://unpkg.com/from-xml/dist/from-xml.min.js)

**Live Demo: [https://kawanet.github.io/from-xml/](https://kawanet.github.io/from-xml/)**

## FEATURES

- Simple: single parser function `fromXML(xml)` which returns JavaScript Object.
- Small: 2KB minified, 1KB gzipped.
- Standalone: no external module dependency nor DOM needed.
- TypeScript definition: [from-xml.d.ts](https://github.com/kawanet/from-xml/blob/master/from-xml.d.ts)

## SYNOPSIS

Node.js:

```js
const fromXML = require("from-xml").fromXML;
```

Browser:

```html
<script src="https://cdn.jsdelivr.net/npm/from-xml/dist/from-xml.min.js"></script>
```

Run:

```js
const xml = '<xml foo="FOO"><bar><baz>BAZ</baz></bar></xml>';

const data = fromXML(xml);

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

## LINKS

- https://github.com/kawanet/from-xml
- https://www.npmjs.com/package/from-xml
- https://www.npmjs.com/package/to-xml
- https://www.npmjs.com/package/xml-objtree

## LICENSE

The MIT License (MIT)

Copyright (c) 2016-2023 Yusuke Kawasaki

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
