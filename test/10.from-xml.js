// #!/usr/bin/env mocha -R spec

/* jshint mocha:true */
/* jshint browser:true */

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
      {foo: {bar: "BAR", "": "FOO"}});
    assert.deepEqual(fromXML('<foo>FOO<bar>BAR</bar>BAZ</foo>'),
      {foo: {"": ["FOO", {bar: "BAR"}, "BAZ"]}});
  });

  it('attribute', function() {
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
      {foo: {"@bar": "BAR", "": "FOO"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ">FOO</foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "": "FOO"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux></foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "qux": "QUX"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux>QUUX</foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "qux": "QUX", "": "QUUX"}});
    assert.deepEqual(fromXML('<foo bar="BAR" baz="BAZ"><qux>QUX</qux><quux>QUUX</quux></foo>'),
      {foo: {"@bar": "BAR", "@baz": "BAZ", "qux": "QUX", "quux": "QUUX"}});
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

  it('cdata', function() {
    assert.deepEqual(fromXML('<foo><![CDATA[FOO]]></foo>'),
      {"foo": "FOO"});
    assert.deepEqual(fromXML('<foo bar="BAR"><![CDATA[FOOBAR]]></foo>'),
      {"foo": {"@bar": "BAR", "": "FOOBAR"}});
    assert.deepEqual(fromXML('<foo><![CDATA[L<G>A&Q"]]></foo>'),
      {"foo": 'L<G>A&Q"'});
  });

  it('escape', function() {
    assert.deepEqual(fromXML('L&lt;G&gt;A&amp;Q&quot;'), 'L<G>A&Q"');
    assert.deepEqual(fromXML('<foo>L&lt;G&gt;A&amp;Q&quot;</foo>'), {foo: 'L<G>A&Q"'});
    assert.deepEqual(fromXML('<foo bar="L&lt;G&gt;A&amp;Q&quot;"></foo>'), {foo: {"@bar": 'L<G>A&Q"'}});
    assert.deepEqual(fromXML("<alpha>'&#x27;&apos;</alpha>"), {alpha: "'''"});
    assert.deepEqual(fromXML("<apos>&#x3b1;</apos>"), {apos: "\u03B1"});

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
});
