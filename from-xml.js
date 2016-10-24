// from-xml.js

var fromXML;

(function(exports) {
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
    var list = src.split(/<([^'"<>]*?(?:\s+(?:[^=<>]*?(?:=(?:'.*?'|".*?"|[^'"<>]*))?\s*)*)?)>/);
    var length = list.length;

    // root element
    var elem = {f: []}; // new Element()

    // dom tree stack
    var stack = [];

    for (var i = 0; i < length;) {
      // text node
      var text = list[i++];
      if (text) addTextNode(elem, text);

      // child node
      var tag = list[i++];
      if (!tag) continue;

      var tagLast = tag.length - 1;
      if (tag[0] === "/") {
        // close tag
        var parent = stack.pop();
        parent.f.push(elem);
        elem = parent;
      } else if (tag[tagLast] === "/") {
        // empty tag
        var child = openTag(tag.substr(0, tagLast));
        child.c = 1;
        elem.f.push(child);
      } else {
        // open tag
        stack.push(elem);
        elem = openTag(tag);
      }
    }

    return toObject(elem);
  }

  function openTag(tag) {
    var elem = {f: []};
    var list = tag.split(/([^\s=]+(?:=(?:'.*?'|".*?"|[^\s'"]*))?)/);

    // tagName
    elem.n = list[1];

    // attributes
    var length = list.length;
    var attributes;
    for (var i = 2; i < length; i++) {
      var str = removeSpaces(list[i]);
      if (!str) continue;
      var pos = str.indexOf("=");
      if (!attributes) attributes = elem.a = {};
      if (pos < 0) {
        attributes["@" + str] = null;
      } else {
        var key = "@" + unescapeRef(str.substr(0, pos));
        var val = str.substr(pos + 1);
        if (val.search(/^(".*"|'.*')$/) > -1) {
          val = val.substr(1, val.length - 2);
        }
        attributes[key] = unescapeRef(val);
      }
    }

    return elem;
  }

  function removeSpaces(str) {
    return str && str.replace(/^[\s\t\r\n]+/, "").replace(/[\s\t\r\n]+$/, "");
  }

  function addTextNode(elem, str) {
    str = removeSpaces(str);
    if (str) elem.f.push(unescapeRef(str));
  }

  function unescapeRef(str) {
    return str.replace(/(&(?:lt|gt|amp|apos|quot);)/g, function(str) {
      return UNESCAPE[str];
    });
  }

  function isString(str) {
    return ("string" === typeof str);
  }

  function getChildObject(elem) {
    var nodeList = elem.f;
    var attributes = elem.a;
    var nodeLength = nodeList.length;
    var stringCount = nodeList.filter(isString).length;
    var object = attributes || {};

    if (stringCount > 1) {
      object[""] = nodeList.map(toObject);
    } else if (nodeLength === 1 && !attributes) {
      object = toObject(nodeList[0]);
    } else if (!nodeLength && !attributes) {
      object = elem.c ? null : "";
    } else {
      nodeList.forEach(function(child) {
        if (isString(child)) {
          object[""] = child;
        } else {
          object[child.n] = getChildObject(child);
        }
      });
    }

    return object;
  }

  function toObject(elem) {
    if ("string" === typeof elem) return elem;

    var tagName = elem.n;
    var childNode = getChildObject(elem);

    // root element
    if (!tagName) return childNode;

    var object = {};
    object[tagName] = childNode;
    return object;
  }

})(typeof exports === 'object' && exports || {});
