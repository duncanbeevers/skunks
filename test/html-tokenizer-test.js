'use strict';

var HTMLTokenizer = require('../src/html-tokenizer');
var _ = require('lodash');
var expect = require('expect.js');


function writeParseTest (markup, expectedTokens) {
  describe('processing ' + JSON.stringify(markup), (function (markup, expectedTokens) {
    return function () {
      before(function () {
        var tokenizer = new HTMLTokenizer();
        var tokens = tokenizer.process(markup);
        this.tokens = tokens;
      });

      it('should produce ' + expectedTokens.length + ' tokens', function () {
        expect(this.tokens.length).to.equal(expectedTokens.length);
      });

      _.each(expectedTokens, function (expectedToken, i) {
        it('should produce token ' + i + ' ' + JSON.stringify(expectedToken), (function () {
          return function () {
            var expectedToken = expectedTokens[i];
            var token = this.tokens[i];

            expect(token.type).to.equal(expectedToken.type);
            expect(token.value).to.equal(expectedToken.value);
          };
        }(i)));
      });
    };
  }(markup, expectedTokens)));
}

describe('HTMLTokenizer', function () {
  writeParseTest('<a href="#" disabled>Click</a><br/>', [
    { type: 'tag open', value: 'a' },
    { type: 'attribute name', value: 'href' },
    { type: 'attribute value', value: '#' },
    { type: 'attribute name', value: 'disabled' },
    { type: 'text', value: 'Click' },
    { type: 'tag close', value: 'a' },
    { type: 'tag', value: 'br' }
  ]);

  writeParseTest('<p title="</p>">x</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: '</p>' },
    { type: 'text', value: 'x' },
    { type: 'tag close', value: 'p' }
  ]);

  writeParseTest('<p title=" <!-- hello world --> ">x</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: ' <!-- hello world --> ' },
    { type: 'text', value: 'x' },
    { type: 'tag close', value: 'p' }
  ]);

  writeParseTest('<p title=" <![CDATA[ \n\n foobar baz ]]> ">x</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: ' <![CDATA[ \n\n foobar baz ]]> ' },
    { type: 'text', value: 'x' },
    { type: 'tag close', value: 'p' }
  ]);

  writeParseTest('<p foo-bar=baz>xxx</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'foo-bar' },
    { type: 'attribute value', value: 'baz' },
    { type: 'text', value: 'xxx' },
    { type: 'tag close', value: 'p' }
  ]);

  writeParseTest('<p foo:bar=baz>xxx</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'foo:bar' },
    { type: 'attribute value', value: 'baz' },
    { type: 'text', value: 'xxx' },
    { type: 'tag close', value: 'p' }
  ]);

  writeParseTest('<p foo.bar=baz>xxx</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'foo.bar' },
    { type: 'attribute value', value: 'baz' },
    { type: 'text', value: 'xxx' },
    { type: 'tag close', value: 'p' }
  ]);

  writeParseTest('<div><div><div><div><div><div><div><div><div><div>' +
    'i\'m 10 levels deep' +
    '</div></div></div></div></div></div></div></div></div></div>', [
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'tag open', value: 'div' },
    { type: 'text', value: 'i\'m 10 levels deep' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'div' }
  ]);

  writeParseTest('<script>alert(\'<!--\')</script>', [
    { type: 'tag open', value: 'script' },
    { type: 'text', value: 'alert(\'<!--\')' },
    { type: 'tag close', value: 'script' }
  ]);

  writeParseTest('<script>alert(\'<!-- foo -->\')<\/script>', [
    { type: 'tag open', value: 'script' },
    { type: 'text', value: 'alert(\'<!-- foo -->\')' },
    { type: 'tag close', value: 'script' }
  ]);


  writeParseTest('<script>alert(\'-->\')<\/script>', [
    { type: 'tag open', value: 'script' },
    { type: 'text', value: 'alert(\'-->\')' },
    { type: 'tag close', value: 'script' }
  ]);

  writeParseTest('<a title="x"href=" ">foo</a>', [
    { type: 'tag open', value: 'a' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: 'x' },
    { type: 'attribute name', value: 'href' },
    { type: 'attribute value', value: ' ' },
    { type: 'text', value: 'foo' },
    { type: 'tag close', value: 'a' }
  ]);

  writeParseTest('<p id=""class=""title="">x', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'id' },
    { type: 'attribute value', value: '' },
    { type: 'attribute name', value: 'class' },
    { type: 'attribute value', value: '' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: '' },
    { type: 'text', value: 'x' }
  ]);

});
