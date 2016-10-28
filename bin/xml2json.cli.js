#!/usr/bin/env node

var fs = require("fs");
var fromXML = require("../").fromXML;

CLI(Array.prototype.slice.call(process.argv, 2));

function CLI(args) {
  var indent = (args[0] < 0) && -args.shift();
  var input = args[0];
  var output = args[1];

  input = (input && input !== "-") ? fs.createReadStream(input) : process.stdin;

  readFromStream(input, function(err, data) {
    if (err) return fatal(err);

    try {
      data = fromXML(data);
      data = JSON.stringify(data, null, indent);
    } catch (e) {
      return fatal(e);
    }

    output = (output && output !== "-") ? fs.createWriteStream(output) : process.stdout;

    output.write(data);
  });
}

function fatal(reason) {
  process.stderr.write(reason);
  process.exit(1);
}

/**
 * Read all data from stream
 *
 * @param stream {Stream}
 * @param callback {Function} function(err, str) {...}
 * @license MIT
 * @see https://gist.github.com/kawanet/c6c998b00500fe05eb8dfd0ee80deacf
 */

function readFromStream(stream, callback) {
  var buf = [];
  stream.on("data", onData);
  stream.on("end", onEnd);
  stream.on("error", onError);

  function onData(data) {
    buf.push(data);
  }

  function onEnd() {
    if (callback) callback(null, buf.join(""));
    callback = null;
  }

  function onError(err) {
    if (callback) callback(err);
    callback = null;
  }
}
