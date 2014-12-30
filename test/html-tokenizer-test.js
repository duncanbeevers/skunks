'use strict';

var HTMLTokenizer = require('../src/html-tokenizer');
var writeTokenizationTest = require('./write-tokenization-test');

describe('HTMLTokenizer', function () {
  before(function () {
    this.tokenizer = new HTMLTokenizer();
  });

  writeTokenizationTest('<p>', [
    { type: 'tag open', value: 'p' }
  ]);

  writeTokenizationTest('<p _>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: '_' }
  ]);

  writeTokenizationTest('<p :>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: ':' }
  ]);

  writeTokenizationTest('<a href="#" disabled>Click</a><br/>', [
    { type: 'tag open', value: 'a' },
    { type: 'attribute name', value: 'href' },
    { type: 'attribute value', value: '#' },
    { type: 'attribute name', value: 'disabled' },
    { type: 'text', value: 'Click' },
    { type: 'tag close', value: 'a' },
    { type: 'tag', value: 'br' }
  ]);

  writeTokenizationTest('<p title="</p>">x</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: '</p>' },
    { type: 'text', value: 'x' },
    { type: 'tag close', value: 'p' }
  ]);

  writeTokenizationTest('<p title=" <!-- hello world --> ">x</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: ' <!-- hello world --> ' },
    { type: 'text', value: 'x' },
    { type: 'tag close', value: 'p' }
  ]);

  writeTokenizationTest('<p title=" <![CDATA[ \n\n foobar baz ]]> ">x</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: ' <![CDATA[ \n\n foobar baz ]]> ' },
    { type: 'text', value: 'x' },
    { type: 'tag close', value: 'p' }
  ]);

  writeTokenizationTest('<p foo-bar=baz>xxx</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'foo-bar' },
    { type: 'attribute value', value: 'baz' },
    { type: 'text', value: 'xxx' },
    { type: 'tag close', value: 'p' }
  ]);

  writeTokenizationTest('<p foo:bar=baz>xxx</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'foo:bar' },
    { type: 'attribute value', value: 'baz' },
    { type: 'text', value: 'xxx' },
    { type: 'tag close', value: 'p' }
  ]);

  writeTokenizationTest('<p foo.bar=baz>xxx</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'foo.bar' },
    { type: 'attribute value', value: 'baz' },
    { type: 'text', value: 'xxx' },
    { type: 'tag close', value: 'p' }
  ]);

  writeTokenizationTest('<div><div><div><div><div><div><div><div><div><div>' +
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

  writeTokenizationTest('<script>alert(\'<!--\')</script>', [
    { type: 'tag open', value: 'script' },
    { type: 'text', value: 'alert(\'<!--\')' },
    { type: 'tag close', value: 'script' }
  ]);

  writeTokenizationTest('<script>alert(\'<!-- foo -->\')<\/script>', [
    { type: 'tag open', value: 'script' },
    { type: 'text', value: 'alert(\'<!-- foo -->\')' },
    { type: 'tag close', value: 'script' }
  ]);


  writeTokenizationTest('<script>alert(\'-->\')<\/script>', [
    { type: 'tag open', value: 'script' },
    { type: 'text', value: 'alert(\'-->\')' },
    { type: 'tag close', value: 'script' }
  ]);

  writeTokenizationTest('<a title="x"href=" ">foo</a>', [
    { type: 'tag open', value: 'a' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: 'x' },
    { type: 'attribute name', value: 'href' },
    { type: 'attribute value', value: ' ' },
    { type: 'text', value: 'foo' },
    { type: 'tag close', value: 'a' }
  ]);

  writeTokenizationTest('<p id=""class=""title="">x', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'id' },
    { type: 'attribute value', value: '' },
    { type: 'attribute name', value: 'class' },
    { type: 'attribute value', value: '' },
    { type: 'attribute name', value: 'title' },
    { type: 'attribute value', value: '' },
    { type: 'text', value: 'x' }
  ]);

  writeTokenizationTest('<p x="x\'"">x</p>', [
    { type: 'tag open', value: 'p' },
    { type: 'attribute name', value: 'x' },
    { type: 'attribute value', value: 'x\'' },
    { type: 'text', value: 'x' },
    { type: 'tag close', value: 'p' }
  ]);

  writeTokenizationTest('<a href="#"><p>Click me</p></a>', [
    { type: 'tag open', value: 'a' },
    { type: 'attribute name', value: 'href' },
    { type: 'attribute value', value: '#' },
    { type: 'tag open', value: 'p' },
    { type: 'text', value: 'Click me' },
    { type: 'tag close', value: 'p' },
    { type: 'tag close', value: 'a' }
  ]);

  writeTokenizationTest('<span><button>Hit me</button></span>', [
    { type: 'tag open', value: 'span' },
    { type: 'tag open', value: 'button' },
    { type: 'text', value: 'Hit me' },
    { type: 'tag close', value: 'button' },
    { type: 'tag close', value: 'span' }
  ]);

  writeTokenizationTest('<object type="image/svg+xml" data="image.svg"><div>[fallback image]</div></object>', [
    { type: 'tag open', value: 'object' },
    { type: 'attribute name', value: 'type' },
    { type: 'attribute value', value: 'image/svg+xml' },
    { type: 'attribute name', value: 'data' },
    { type: 'attribute value', value: 'image.svg' },
    { type: 'tag open', value: 'div' },
    { type: 'text', value: '[fallback image]' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'object' }
  ]);

  writeTokenizationTest('<some-tag-1></some-tag-1><some-tag-2></some-tag-2>', [
    { type: 'tag open', value: 'some-tag-1' },
    { type: 'tag close', value: 'some-tag-1' },
    { type: 'tag open', value: 'some-tag-2' },
    { type: 'tag close', value: 'some-tag-2' }
  ]);


  writeTokenizationTest('[\']["]', [
    { type: 'text', value: '[\']["]' }
  ]);

  writeTokenizationTest('<a href="test.html"><div>hey</div></a>', [
    { type: 'tag open', value: 'a' },
    { type: 'attribute name', value: 'href' },
    { type: 'attribute value', value: 'test.html' },
    { type: 'tag open', value: 'div' },
    { type: 'text', value: 'hey' },
    { type: 'tag close', value: 'div' },
    { type: 'tag close', value: 'a' }
  ]);

  writeTokenizationTest(':) <a href="http://example.com">link</a>', [
    { type: 'text', value: ':) ' },
    { type: 'tag open', value: 'a' },
    { type: 'attribute name', value: 'href' },
    { type: 'attribute value', value: 'http://example.com' },
    { type: 'text', value: 'link' },
    { type: 'tag close', value: 'a' }
  ]);

});
