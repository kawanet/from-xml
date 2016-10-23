// #!/usr/bin/env mocha -R spec

var hasRequire = ('undefined' !== typeof require);
var Global = ('undefined' !== typeof window) && window || this;
var fromXML = hasRequire ? require('../').fromXML : Global.fromXML;
var chai = hasRequire ? require('chai') : Global.chai;
var assert = chai && chai.assert;

var UNDEFINED;

describe('fromXML', function() {
  it('string', function() {
    assert.deepEqual(fromXML('foo'), 'foo');
  });

  it('xml', function() {
    assert.deepEqual(fromXML('<foo>FOO</foo>'), {foo: "FOO"});
    assert.deepEqual(fromXML('<foo><bar>BAR</bar></foo>'), {foo: {bar: "BAR"}});
  });

  it('escape', function() {
    assert.deepEqual(fromXML('L&lt;G&gt;A&amp;Q&quot;'), 'L<G>A&Q"');
    assert.deepEqual(fromXML('<foo>L&lt;G&gt;A&amp;Q&quot;</foo>'), {foo: 'L<G>A&Q"'});
  });
});
