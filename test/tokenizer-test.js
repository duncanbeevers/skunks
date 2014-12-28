'use strict';

var _ = require('lodash');
var expect = require('expect.js');

var Tokenizer = require('../src/tokenizer');

describe('Tokenizer', function () {
  before(function () {
    this.tokenizer = new Tokenizer();
  });

  describe('initial', function () {
    it('should be in `none` state', function () {
      expect(this.tokenizer.state).to.equal('none');
    });
  });

  describe('when adding transitions', function () {
    it('should require a transition', function () {
      expect(_.bind(function () {
        this.tokenizer.addTransition('none');
      }, this)).to.throwException(/Transition must be an object/);
    });

    it('should require a `value`', function () {
      expect(_.bind(function () {
        this.tokenizer.addTransition('none', { state: 'state1' });
      }, this)).to.throwException(/Transition must provide a `value` regular expression/);
    });

    it('should require a `value` anchored at beginning of line', function () {
      expect(_.bind(function () {
        this.tokenizer.addTransition('none', { state: 'state2', value: /.?/ });
      }, this)).to.throwException(/beginning with a start-of-line anchor `\^`/);
    });

    it('should require a `state`', function () {
      expect(_.bind(function () {
        this.tokenizer.addTransition('none', { value: /^/ });
      }, this)).to.throwException(/Transition must provide a `state` string/);
    });
  });

  describe('when processing', function () {
    before(function () {
      this.tokenizer.addTransition('none', {
        value: /^<(bar)>/,
        state: 'barOpen'
      });
      this.tokenizer.addTransition('barOpen', {
        value: /^<\/(bar)>/,
        state: 'barClose'
      });
    });

    it('should throw when unable to transition', function () {
      expect(_.bind(function () {
        this.tokenizer.process('foo');
      }, this)).to.throwException(/No transition found/);
    });

    it('should recognize transition to valid state', function () {
      var tokens = this.tokenizer.process('<bar>');
      expect(tokens.length).to.equal(1);
      var token = tokens[0];
      expect(token.value).to.equal('bar');
      expect(token.type).to.equal('barOpen');
    });

    it('should recognize subsequent transition to valid state', function () {
      var tokens = this.tokenizer.process('<bar></bar>');
      expect(tokens.length).to.equal(2);
      var token = tokens[1];
      expect(token.value).to.equal('bar');
      expect(token.type).to.equal('barClose');
    });
  });
});
