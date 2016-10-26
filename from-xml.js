/**
 * The fromXML() method parses an XML string, constructing the JavaScript
 * value or object described by the string.
 *
 * @function fromXML
 * @param text {String} The string to parse as XML
 * @param [reviver] {Function} If a function, prescribes how the value
 * originally produced by parsing is transformed, before being returned.
 * @param [options] {Object} Options for future usages.
 * @returns {Object}
 */

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

  function _fromXML(text, reviver, options) {
    return parse(text, reviver, options);
  }

  function parse(text, reviver, options) {
    var list = String.prototype.split.call(text, /<([^!<>?](?:'.*?'|".*?"|[^'"<>])*|!(?:--.*?--|\[CDATA\[.*?]]|.*?)|\?.*?\?)>/);
    var length = list.length;

    // root element
    var root = {f: []};
    var elem = root;

    // dom tree stack
    var stack = [];

    for (var i = 0; i < length;) {
      // text node
      var str = list[i++];
      if (str) appendText(str);

      // child node
      var tag = list[i++];
      if (!tag) continue;

      var tagLength = tag.length;
      var firstChar = tag[0];
      if (firstChar === "/") {
        // close tag
        var closed = tag.replace(/^\/|[\s\/].*$/g, "");
        while (stack.length) {
          var match = (elem.n === closed);
          elem = stack.pop();
          if (match) break;
        }
      } else if (firstChar === "?") {
        // XML declaration
        appendChild({n: "?", r: tag.substr(1, tagLength - 2)});
      } else if (firstChar === "!") {
        if (tag.substr(1, 7) === "[CDATA[" && tag.substr(-2) === "]]") {
          // CDATA section
          appendText(tag.substr(8, tagLength - 10));
        } else {
          // comment
          appendChild({n: "!", r: tag.substr(1)});
        }
      } else if (tag[tagLength - 1] === "/") {
        // empty tag
        appendChild(openTag(tag.substr(0, tagLength - 1), 1, reviver));
      } else {
        // open tag
        stack.push(elem);
        var child = openTag(tag, 0, reviver);
        appendChild(child);
        elem = child;
      }
    }

    return toObject(root, reviver, options);

    function appendChild(child) {
      elem.f.push(child);
    }

    function appendText(str) {
      str = removeSpaces(str);
      if (str) appendChild(unescapeXML(str));
    }
  }

  function openTag(tag, closeTag, reviver) {
    var elem = {f: [], c: closeTag};
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
        addObject(attributes, "@" + str, null);
      } else {
        var key = "@" + str.substr(0, pos);
        var val = str.substr(pos + 1);
        if (val.search(/^(".*"|'.*')$/) > -1) {
          val = val.substr(1, val.length - 2);
        }
        val = unescapeXML(val);
        if (reviver) {
          val = reviver(key, val);
        }
        addObject(attributes, key, val);
      }
    }

    return elem;
  }

  function removeSpaces(str) {
    return str && str.replace(/^\s+|\s+$/g, "");
  }

  function unescapeXML(str) {
    return str.replace(/(&(?:lt|gt|amp|apos|quot|#x[0-9a-fA-F]+);)/g, function(str) {
      if (str[1] === "#") {
        var code = parseInt(str.substr(3), 16);
        if (code > -1) return String.fromCharCode(code);
      }
      return UNESCAPE[str] || str;
    });
  }

  function isString(str) {
    return ("string" === typeof str);
  }

  function getChildObject(elem, reviver, options) {
    var raw = elem.r;
    if (raw) return raw;

    var attributes = elem.a;
    var object = attributes || {};
    var nodeList = elem.f;
    var nodeLength = nodeList.length;

    if (attributes || nodeLength > 1) {
      nodeList.forEach(function(child) {
        if (isString(child)) {
          addObject(object, "", child);
        } else {
          addObject(object, child.n, getChildObject(child, reviver, options));
        }
      });
    } else if (nodeLength) {
      object = toObject(nodeList[0], reviver, options);
    } else {
      object = elem.c ? null : "";
    }

    if (reviver) {
      object = reviver(elem.n || "", object);
    }

    return object;
  }

  function addObject(object, key, val) {
    if ("undefined" === typeof val) return;
    var prev = object[key];
    if (prev instanceof Array) {
      prev.push(val);
    } else if (key in object) {
      object[key] = [prev, val];
    } else {
      object[key] = val;
    }
  }

  function toObject(elem, reviver, options) {
    if ("string" === typeof elem) return elem;

    var childNode = getChildObject(elem, reviver, options);

    // root element
    var tagName = elem.n;
    if (!tagName) return childNode;

    var object = {};
    object[tagName] = childNode;
    return object;
  }
})(typeof exports === 'object' && exports || {});
