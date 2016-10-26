/**
 * The fromXML() method parses an XML string, constructing the JavaScript
 * value or object described by the string.
 *
 * @function fromXML
 * @param text {String} The string to parse as XML
 * @param [reviver] {Function} If a function, prescribes how the value
 * originally produced by parsing is transformed, before being returned.
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

  function _fromXML(text, reviver) {
    return parse(text, reviver);
  }

  function parse(text, reviver) {
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
      if (str) addTextNode(elem, str);

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
        elem.f.push({n: "?", r: tag.substr(1, tagLength - 2)});
      } else if (firstChar === "!") {
        if (tag.substr(1, 7) === "[CDATA[" && tag.substr(-2) === "]]") {
          // CDATA section
          addTextNode(elem, tag.substr(8, tagLength - 10));
        } else {
          // comment
          elem.f.push({n: "!", r: tag.substr(1)});
        }
      } else if (tag[tagLength - 1] === "/") {
        // empty tag
        elem.f.push(openTag(tag.substr(0, tagLength - 1), 1));
      } else {
        // open tag
        stack.push(elem);
        var child = openTag(tag);
        elem.f.push(child);
        elem = child;
      }
    }

    return toObject(root);
  }

  function openTag(tag, closeTag) {
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
        attributes["@" + str] = null;
      } else {
        var key = "@" + unescapeXML(str.substr(0, pos));
        var val = str.substr(pos + 1);
        if (val.search(/^(".*"|'.*')$/) > -1) {
          val = val.substr(1, val.length - 2);
        }
        attributes[key] = unescapeXML(val);
      }
    }

    return elem;
  }

  function removeSpaces(str) {
    return str && str.replace(/^\s+|\s+$/g, "");
  }

  function addTextNode(elem, str) {
    str = removeSpaces(str);
    if (str) elem.f.push(unescapeXML(str));
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

  function getChildObject(elem) {
    var raw = elem.r;
    if (raw) return raw;

    var attributes = elem.a;
    var object = attributes || {};
    var nodeList = elem.f;
    var nodeLength = nodeList.length;
    var stringCount = nodeList.filter(isString).length;

    if (stringCount > 1) {
      object[""] = nodeList.map(toObject);
    } else if (nodeLength === 1 && !attributes) {
      object = toObject(nodeList[0]);
    } else if (!nodeLength && !attributes) {
      object = elem.c ? null : "";
    } else {
      nodeList.forEach(function(child) {
        var key = "";
        if (!isString(child)) {
          key = child.n;
          child = getChildObject(child);
        }
        var prev = object[key];
        if (prev instanceof Array) {
          prev.push(child);
        } else if (key in object) {
          object[key] = [prev, child];
        } else {
          object[key] = child;
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
