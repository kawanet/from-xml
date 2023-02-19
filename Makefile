#!/usr/bin/env bash -c make

SRC=./from-xml.js
TESTS=./test/*.js
HINTS=$(SRC) $(TESTS)
DIST=./dist
JSDEST=./dist/from-xml.min.js
JSGZIP=./dist/from-xml.min.js.gz
ESM=./dist/from-xml.mjs

all: $(ESM) $(JSDEST) $(JSGZIP)

clean:
	rm -fr $(DIST)

$(JSDEST): $(SRC)
	@mkdir -p dist
	./node_modules/.bin/terser -c -m -o $@ -- $<

$(JSGZIP): $(JSDEST)
	gzip -9 < $< > $@
	ls -l $< $@

$(ESM): $(SRC)
	@mkdir -p dist
	cp -p $< $@
	perl -i -pe 's#^var (fromXML =)#export const $$1#' $@
	perl -i -pe 's#typeof exports[^)]+#{}#' $@

test: all jshint mocha
	node -e 'import("./dist/from-xml.mjs").then(x => console.log(x.fromXML("<ok/>")))'
	node -e 'console.log(require("./dist/from-xml.min.js").fromXML("<ok/>"))'

mocha:
	./node_modules/.bin/mocha -R spec $(TESTS)

jshint:
	./node_modules/.bin/jshint $(HINTS)

.PHONY: all clean test jshint mocha
