// #!/usr/bin/env mocha -R spec

/* jshint mocha:true */
/* jshint browser:true */
/* globals JSON */

var hasRequire = ('undefined' !== typeof require);
var Global = ('undefined' !== typeof window) && window || this;
var fromXML = hasRequire ? require('../').fromXML : Global.fromXML;
var chai = hasRequire ? require('chai') : Global.chai;
var assert = chai && chai.assert;

describe('fromXML', function() {
  it('string', function() {
    assert.deepEqual(fromXML('foo'), 'foo');
  });

  it('element', function() {
    assert.deepEqual(fromXML('<foo>FOO</foo>'),
      {foo: "FOO"});
    assert.deepEqual(fromXML('<foo></foo>'),
      {foo: ""});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar></foo>'),
      {foo: {bar: "BAR"}});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar><baz>BAZ</baz></foo>'),
      {foo: {bar: "BAR", baz: "BAZ"}});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar><bar>QUX</bar></foo>'),
      {foo: {bar: ["BAR", "QUX"]}});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar><baz>BAZ</baz><baz>QUX</baz></foo>'),
      {foo: {bar: "BAR", baz: ["BAZ", "QUX"]}});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar>FOO</foo>'),
      {foo: {bar: "BAR", "#": "FOO"}});

    // empty property name only accepts text nodes but not child nodes since version 0.1.1
    assert.deepEqual(fromXML('<foo>FOO<bar>BAR</bar>BAZ</foo>'),
      {foo: {"#": ["FOO", "BAZ"], bar: "BAR"}});
  });

  it('attribute', function() {
    assert.deepEqual(fromXML('<foo bar="BAR"/>'),
      {foo: {"@bar": "BAR"}});
    assert.deepEqual(fromXML('<foo bar="BAR"></foo>'),
      {foo: {"@bar": "BAR"}});
    assert.deepEqual(fromXML("<foo bar='BAR'></foo>"),
      {foo: {"@bar": "BAR"}});
    assert.deepEqual(fromXML('<foo bar=BAR></foo>'),
      {foo: {"@bar": "BAR"}});
    assert.deepEqual(fromXML('<foo bar=""></foo>'),
      {foo: {"@bar": ""}});
    assert.deepEqual(fromXML("<foo bar=''></foo>"),
      {foo: {"@bar": ""}});
    assert.deepEqual(fromXML('<foo bar=></foo>'),
      {foo: {"@bar": ""}});
    assert.deepEqual(fromXML('<foo bar></foo>'),
      {foo: {"@bar": null}});
  });

  it('multiple attributes', function() {
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"/>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"></foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ"}});
    assert.deepEqual(fromXML('<foo bar baz></foo>'),
      {foo: {"@bar": null, "@baz": null}});
    assert.deepEqual(fromXML('<foo bar="BAR" bar="BAZ"></foo>'),
      {foo: {"@bar": ["BAR", "BAZ"]}});
    assert.deepEqual(fromXML('<foo bar bar></foo>'),
      {foo: {"@bar": [null, null]}});
  });

  it('attributes and child elements', function() {
    assert.deepEqual(fromXML('<foo bar="BAR">FOO</foo>'),
      {foo: {"@bar": "BAR", "#": "FOO"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ">FOO</foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "#": "FOO"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux></foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "qux": "QUX"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux>QUUX</foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "qux": "QUX", "#": "QUUX"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux><quux>QUUX</quux></foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "qux": "QUX", "quux": "QUUX"}});
  });

  it('space near attribute', function() {
    assert.deepEqual(fromXML('<foo bar ="BAR" baz qux ="QUX"></foo>'),
      {foo: {"@bar": "BAR", "@baz": null, "@qux": "QUX"}});
    assert.deepEqual(fromXML('<foo bar= "BAR" baz qux= "QUX"></foo>'),
      {foo: {"@bar": "BAR", "@baz": null, "@qux": "QUX"}});
    assert.deepEqual(fromXML('<foo bar = "BAR" baz qux = "QUX"></foo>'),
      {foo: {"@bar": "BAR", "@baz": null, "@qux": "QUX"}});
    assert.deepEqual(fromXML('<foo bar = BAR baz qux = QUX></foo>'),
      {foo: {"@bar": "BAR", "@baz": null, "@qux": "QUX"}});
  });

  it('empty element', function() {
    assert.deepEqual(fromXML('<foo/>'),
      {foo: null});
    assert.deepEqual(fromXML('<foo bar="BAR"/>'),
      {foo: {"@bar": "BAR"}});
    assert.deepEqual(fromXML('<foo><bar/></foo>'),
      {foo: {"bar": null}});
    assert.deepEqual(fromXML('<foo><bar/><baz/></foo>'),
      {foo: {"bar": null, "baz": null}});
    assert.deepEqual(fromXML('<foo><bar baz="BAZ"/></foo>'),
      {foo: {"bar": {"@baz": "BAZ"}}});
    assert.deepEqual(fromXML('<foo><bar baz/></foo>'),
      {foo: {"bar": {"@baz": null}}});
  });

  it('comment', function() {
    assert.deepEqual(fromXML('<foo><!bar></foo>'),
      {foo: {"!": "bar"}});
    assert.deepEqual(fromXML('<foo><!--bar--></foo>'),
      {foo: {"!": "--bar--"}});
    assert.deepEqual(fromXML('<foo><!bar><!baz></foo>'),
      {foo: {"!": ["bar", "baz"]}});
    assert.deepEqual(fromXML('<foo><!--bar--><!--baz--></foo>'),
      {foo: {"!": ["--bar--", "--baz--"]}});
    assert.deepEqual(fromXML('<foo><!bar><!--baz--></foo>'),
      {foo: {"!": ["bar", "--baz--"]}});
    assert.deepEqual(fromXML('<foo><!--L<G>A&Q"--></foo>'),
      {foo: {"!": '--L<G>A&Q"--'}});
  });

  it('xml declaration', function() {
    assert.deepEqual(fromXML('<?xml version="1.1"?>'),
      {"?": 'xml version="1.1"'});
    assert.deepEqual(fromXML(
      '<?xml version="1.0"?>\n' +
      '<!DOCTYPE foo SYSTEM "foo.dtd">\n' +
      '<foo>FOO</foo>\n'), {
      "?": 'xml version="1.0"',
      "!": 'DOCTYPE foo SYSTEM "foo.dtd"',
      "foo": "FOO"
    });
  });

  it('doctype and entity', function() {
    // https://www.w3.org/TR/2006/REC-xml11-20060816/REC-xml11-20060816.xml

    var magicents = '<code>amp</code>,\n' +
      '    <code>lt</code>,\n' +
      '    <code>gt</code>,\n' +
      '    <code>apos</code>,\n' +
      '    <code>quot</code>';

    // Entity Declaration with multi-line Entity Value
    var entity = '  <!ENTITY magicents "' + magicents + '">\n' +
      '  <!ENTITY may "<phrase diff=\'chg\'>may</phrase>">\n' +
      '  <!ENTITY MAY "<rfc2119>MAY</rfc2119>">\n';

    // Document Type Definition with multi-line Internal Subset
    var xml = '<!DOCTYPE spec SYSTEM "xmlspec.dtd" [ \n' + entity + '\n]>';

    var doctype = xml.substr(2, xml.length - 3);
    assert.equal(doctype[0], "D");
    assert.equal(doctype[doctype.length - 1], "]");
    assert.deepEqual(fromXML(xml), {"!": doctype});

    assert.deepEqual(fromXML(entity), {
      '!': [
        'ENTITY magicents "' + magicents + '"',
        'ENTITY may "<phrase diff=\'chg\'>may</phrase>"',
        'ENTITY MAY "<rfc2119>MAY</rfc2119>"'
      ]
    });
  });

  it('cdata', function() {
    assert.deepEqual(fromXML('<foo><![CDATA[FOO]]></foo>'),
      {"foo": "FOO"});
    assert.deepEqual(fromXML('<foo bar="BAR"><![CDATA[FOOBAR]]></foo>'),
      {"foo": {"@bar": "BAR", "#": "FOOBAR"}});
    assert.deepEqual(fromXML('<foo><![CDATA[L<G>A&Q"]]></foo>'),
      {"foo": 'L<G>A&Q"'});
  });

  it('conditional sections', function() {
    // https://www.w3.org/TR/2006/REC-xml11-20060816/#sec-condition-sect
    var xml = "<!ENTITY % draft 'INCLUDE' >\n" +
      "<![%draft;[\n" +
      "<!ELEMENT book (comments*, title, body, supplements?)>\n" +
      "]]>";

    assert.deepEqual(fromXML(xml), {
      "!": [
        "ENTITY % draft 'INCLUDE' ",
        "[%draft;[\n<!ELEMENT book (comments*, title, body, supplements?)>\n]]"
      ]
    });
  });

  it('escape', function() {
    // 4.1 Character and Entity References
    assert.deepEqual(fromXML('L&lt;G&gt;A&amp;Q&quot;'), 'L<G>A&Q"');
    assert.deepEqual(fromXML('<foo>L&lt;G&gt;A&amp;Q&quot;</foo>'), {foo: 'L<G>A&Q"'});
    assert.deepEqual(fromXML('<foo bar="L&lt;G&gt;A&amp;Q&quot;"></foo>'), {foo: {"@bar": 'L<G>A&Q"'}});
    assert.deepEqual(fromXML("<apos>\x27&#39;&#x27;&apos;</apos>"), {apos: "''''"});
    assert.deepEqual(fromXML("<alpha>\u03B1&#945;&#x3b1;</alpha>"), {alpha: "\u03B1\u03B1\u03B1"});
    assert.deepEqual(fromXML("<asia>\u4e9c&#20124;&#x4e9c;</asia>"), {asia: "\u4e9c\u4e9c\u4e9c"});

    // tag name should not be unescaped
    assert.deepEqual(fromXML("<&amp;>&amp;</&amp;>"), {"&amp;": "&"});

    // attribute name should not be unescaped
    assert.deepEqual(fromXML('<foo &amp;="&amp;"/>'), {"foo": {"@&amp;": "&"}});
  });

  it("whitespace", function() {
    assert.deepEqual(fromXML('<xml>&#x20;F O O&#x20;</xml>'), {xml: " F O O "});
    assert.deepEqual(fromXML('<xml>&#x09;F\tO\tO&#x09;</xml>'), {xml: "\tF\tO\tO\t"});
    assert.deepEqual(fromXML('<xml>&#x0d;F\nO\rO&#x0a;</xml>'), {xml: "\rF\nO\rO\n"});
  });

  it("syntax error", function() {
    // close tag </bar> appears without its open tag <bar>
    assert.deepEqual(fromXML('<xml><foo>FOO</foo></bar><baz>BAZ</baz></xml>'),
      {xml: {foo: 'FOO'}, baz: 'BAZ'});

    // open tag <bar> appears without its close tag </bar>
    assert.deepEqual(fromXML('<xml><foo><bar>BAR</foo><baz>BAZ</baz></xml>'),
      {xml: {foo: {bar: 'BAR'}, baz: 'BAZ'}});

    // root element is not closed
    assert.deepEqual(fromXML('<xml><foo><bar>BAR</bar>'),
      {xml: {foo: {bar: 'BAR'}}});
  });

  it("reviver", function() {
    // reviver which may return modified string
    assert.deepEqual(JSON.parse('{"foo":{"bar":"BAR","baz":"BAZ"}}', bazLower),
      {"foo": {"bar": "BAR", "baz": "baz"}});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar><baz>BAZ</baz></foo>', bazLower),
      {"foo": {"bar": "BAR", "baz": "baz"}});
    assert.deepEqual(fromXML('<foo><baz>BAZ-1</baz><baz>BAZ-2</baz></foo>', bazLower),
      {"foo": {"baz": ["baz-1", "baz-2"]}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"/>', bazLower),
      {"foo": {"@bar": "BAR", "@baz": "baz"}});
    assert.deepEqual(fromXML('<foo baz="BAZ-1" baz="BAZ-2"/>', bazLower),
      {"foo": {"@baz": ["baz-1", "baz-2"]}});

    function bazLower(key, val) {
      if (key && key.indexOf("baz") > -1) {
        return String.prototype.toLowerCase.call(val);
      }
      return val;
    }

    // reviver which may return undefined
    assert.deepEqual(JSON.parse('{"foo":{"bar":"BAR","baz":"BAZ"}}', barIgnore),
      {"foo": {"baz": "BAZ"}});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar><baz>BAZ</baz></foo>', barIgnore),
      {"foo": {"baz": "BAZ"}});
    assert.deepEqual(fromXML('<foo><bar>BAR-1</bar><bar>BAR-2</bar><baz>BAZ</baz></foo>', barIgnore),
      {"foo": {"baz": "BAZ"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"/>', barIgnore),
      {"foo": {"@baz": "BAZ"}});
    assert.deepEqual(fromXML('<foo bar="BAR-1" bar="BAR-2" baz="BAZ"/>', barIgnore),
      {"foo": {"@baz": "BAZ"}});

    function barIgnore(key, val) {
      if (key && key.indexOf("bar") > -1) return; // undefined
      return val;
    }

    // reviver should work after unescaped
    assert.deepEqual(fromXML('<foo><baz>l&lt;g&gt;a&amp;q&quot;</baz></foo>', bazUpper),
      {"foo": {"baz": 'L<G>A&Q"'}});
    assert.deepEqual(fromXML('<foo baz="l&lt;g&gt;a&amp;q&quot;"/>', bazUpper),
      {"foo": {"@baz": 'L<G>A&Q"'}});

    function bazUpper(key, val) {
      if (key && key.indexOf("baz") > -1) {
        return String.prototype.toUpperCase.call(val);
      }
      return val;
    }

    // reviver which decode Date object
    if (Date.prototype.toJSON) {
      var dtJSON = (new Date(2016, 9, 26, 21, 28, 0)).toJSON();
      var date = new Date(dtJSON) - 0; // 1477484880000
      assert.equal(JSON.parse('{"date":"' + dtJSON + '"}', dateReplacer).date - 0, date);
      assert.equal(fromXML('<foo><date>' + dtJSON + '</date></foo>', dateReplacer).foo.date - 0, date);
      assert.equal(fromXML('<foo date="' + dtJSON + '"/>', dateReplacer).foo["@date"] - 0, date);
    }

    function dateReplacer(key, val) {
      if (key && key.indexOf("date") > -1) {
        return new Date(val);
      }
      return val;
    }
  });

  it("reviver order", function() {
    var order;

    JSON.parse('{"a": "A", "b": {"@c": "C", "d": "D"}}', add.bind(order = []));
    assert.equal(order.join(","), "a=string,@c=string,d=string,b=object,=object");

    fromXML('<a>A</a><b c="C"><d>D</d></b>', add.bind(order = []));
    assert.equal(order.join(","), "a=string,@c=string,d=string,b=object,=object");

    JSON.parse('{"a": {"@b": ["B", "B"], "c": ["C", "C"]}}', add.bind(order = []));
    assert.equal(order.join(","), "0=string,1=string,@b=object,0=string,1=string,c=object,a=object,=object");

    fromXML('<a b="B" b="B"><c>C</c><c>C</c></a>', add.bind(order = []));
    assert.equal(order.join(","), "@b=string,@b=string,c=string,c=string,a=object,=object");

    fromXML('<a>B<c>C</c>D</a>', add.bind(order = []));
    assert.equal(order.join(","), "c=string,a=object,=object");

    function add(key, val) {
      Array.prototype.push.call(this, key + "=" + typeof val);
      return val;
    }
  });

  it("new line", function() {
    // new line in tag
    assert.deepEqual(fromXML('<foo\r\nbar="BAR"><baz>BAZ</baz></foo>'),
      {"foo": {"@bar": "BAR", "baz": "BAZ"}});

    // new line in attribute
    assert.deepEqual(fromXML('<foo bar="BAR\r\nBAR"><baz>BAZ</baz></foo>'),
      {"foo": {"@bar": "BAR\r\nBAR", "baz": "BAZ"}});
    assert.deepEqual(fromXML("<foo bar='BAR\r\nBAR'><baz>BAZ</baz></foo>"),
      {"foo": {"@bar": "BAR\r\nBAR", "baz": "BAZ"}});

    // new line in long style comment
    assert.deepEqual(fromXML('<foo><!--bar\r\nbaz--><!--bar\r\nbaz--></foo>'),
      {"foo": {"!": ["--bar\r\nbaz--", "--bar\r\nbaz--"]}});

    // new line in short style comment
    assert.deepEqual(fromXML('<foo><!bar\r\nbaz><!bar\r\nbaz></foo>'),
      {"foo": {"!": ["bar\r\nbaz", "bar\r\nbaz"]}});

    // new line in CDATA
    assert.deepEqual(fromXML('<foo><![CDATA[bar\r\nbaz]]><![CDATA[bar\r\nbaz]]></foo>'),
      {"foo": {"#": ["bar\r\nbaz", "bar\r\nbaz"]}});

    // new line in PI
    assert.deepEqual(fromXML('<?foo bar\r\nbaz?>'),
      {"?": "foo bar\r\nbaz"});
  });

  it("case insensitive", function() {
    assert.deepEqual(fromXML('<foo><bar>BAR</BAR><baz>BAZ</BAZ></FOO>'),
      {"foo": {"bar": "BAR", "baz": "BAZ"}});
  });

  describe('with forceArray flag', function() {
    it('multiple attributes', function () {
      assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"/>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "@baz": "BAZ"}]});
      assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"></foo>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "@baz": "BAZ"}]});
      assert.deepEqual(fromXML('<foo bar baz></foo>', {forceArray:true}),
        {foo: [{"@bar": null, "@baz": null}]});
      assert.deepEqual(fromXML('<foo bar="BAR" bar="BAZ"></foo>', {forceArray:true}),
        {foo: [{"@bar": ["BAR", "BAZ"]}]});
      assert.deepEqual(fromXML('<foo bar bar></foo>', {forceArray:true}),
        {foo: [{"@bar": [null, null]}]});
    });

    it('attributes and child elements', function () {
      assert.deepEqual(fromXML('<foo bar="BAR">FOO</foo>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "#": "FOO"}]});
      assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ">FOO</foo>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "@baz": "BAZ", "#": "FOO"}]});
      assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux></foo>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "@baz": "BAZ", "qux": ["QUX"]}]});
      assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux>QUUX</foo>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "@baz": "BAZ", "qux": ["QUX"], "#": "QUUX"}]});
      assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux><quux>QUUX</quux></foo>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "@baz": "BAZ", "qux": ["QUX"], "quux": ["QUUX"]}]});
      assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux><qux>QUX2</qux><quux>QUUX</quux></foo>', {forceArray:true}),
        {foo: [{"@bar": "BAR", "@baz": "BAZ", "qux": ["QUX", "QUX2"], "quux": ["QUUX"]}]});
    });
    })
});
