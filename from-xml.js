// from-xml.js

var fromXML;

(function(exports) {
  var reTag = new RegExp("(<[^\'\"\<\>]*?(?:\\s+(?:[^=\<\>]*?(?:=(?:\'.*?\'|\".*?\"|[^\'\">=<]*))?\\s*)*)?>)");
  var reSep = new RegExp("[\s\=\"\'\>]");
  var PROTO = Element.prototype;

  var UNESCAPE = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&apos;": "'",
    "&quot;": '"'
  };

  exports.fromXML = fromXML = _fromXML;

  function _fromXML(src) {
    if ("string" !== typeof src) src += "";
    var list = src.split(reTag);
    var last = list.length;
    var cur = new Element(); // root element
    var stack = []; // dom tree stack
    var idx = 0;
    while (idx < last) {
      // text node
      var text = list[idx++];
      if (text) addTextNode(cur, text);

      // child node
      var tag = list[idx++];
      if (!tag) continue;

      // close tag
      if (tag[1] === "/") {
        var parent = stack.pop();
        parent.fragment.push(toObject(cur));
        cur = parent;
        continue;
      }

      // open tag
      var sp = tag.search(reSep);
      var name = tag.substr(1, sp - 1);
      var child = new Element(name);
      stack.push(cur);
      cur = child;
    }

    return toObject(cur);
  }

  function Element(name) {
    this.name = name;
    this.fragment = [];
  }

  function addTextNode(elem, str) {
    str = str && str.replace(/^[\s\t\r\n]+/, "").replace(/[\s\t\r\n]+$/, "");
    if (str) elem.fragment.push(entityUnescape(str));
  }

  function entityUnescape(str) {
    return str.replace(/(&(?:lt|gt|amp|apos|quot);)/g, function(str) {
      return UNESCAPE[str];
    });
  }

  function toObject(elem) {
    var name = elem.name;
    var fragment = elem.fragment;
    var child, obj;

    if (fragment.length < 2) {
      child = fragment[0];
    } else {
      child = {"": fragment};
    }

    // root element
    if (!name) return child;

    obj = {};
    obj[name] = child;
    return obj;
  }
})(typeof exports === 'object' && exports || {});
