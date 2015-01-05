# Skunks - HTML tokenizer

## What it is

Skunks is a programmable tokenizer. Out of the box, it includes pieces for tokenizing (some) HTML. It also includes examples demonstrating extension of the tokenizer to recognize non-standard HTML, such as that used in templating dialects like Angular.

## How it works

The tokenizer operates as a state machine. First, the machine is programmed with a set of transitions. Processing strings through the programmed machine generates an array of recognized tokens, or throws an error in the case of unrecognized input.

To program the machine, specify the states *from* and *to* which the machine will transition, and a regular expression used to recognize, capture, and discard substrings from the input string.

## Example

For this example, we will program a simple machine to recognize a trivial subset of HTML.

We will use this snippet as an input.

```html
<p>The quick brown fox</p>
```

The expected output is an array of tokens representing the snippet.

```javascript
[
  { type: 'tag open', value: 'p' },
  { type: 'text', value: 'The quick brown fox' },
  { type: 'tag close', value: 'p' }
]
```

To begin, a bare tokenizer instance is created.

```javascript
var Tokenizer = require('./src/tokenzier');
var tokenizer = new Tokenizer();
```

Before processing, the machine begins in the `none` state.

Attempting to run the machine before any transition rules have been added results in an error message.

```javascript
tokenizer.processSync('<p>The quick brown fox</p>');
// Error: No transition found from `none` for "<p>The quick brown fox</p>"
```

To remedy this, a transition from `none` to `tag open` is added to the machine, and processing is attempted again.

```javascript
tokenizer.addTransition('none', {
  state: 'tag open',
  value: /^<([^>]+)>/
});

tokenizer.processSync('<p>The quick brown fox</p>');
// Error: No transition found from `tag open` for "The quick brown fox</p>"
```

The opening tag has been consumed and its husk discarded leaving the machine in the `tag open` state, ready to process the next token.

```javascript
tokenizer.addTransition('tag open', {
  state: 'text',
  value: /^([^<]+)/
});

tokenizer.processSync('<p>The quick brown fox</p>');
// Error: No transition found from `text` for "</p>"

tokenizer.addTransition('text', {
  state: 'tag close',
  value: /^<\/([^>]+)>/
});

tokenizer.processSync('<p>The quick brown fox</p>');
// [ { type: 'tag open', value: 'p' },
//   { type: 'text',
//     value: 'The quick brown fox' },
//   { type: 'tag close', value: 'p' } ]
```

## Asynchronous operation

The tokenizer can be used in an asynchronous fashion, although it is still a stateful instance and so care must be taken not to use a single tokenizer instance to process multiple inputs simultaneously.

To use the instance asynchronously, first append data to the instance.

```javascript
tokenizer.push('<html></html>');
```

Then read tokens out, one-by-one.

```javascript
tokenizer.nextToken(function (err, token) {
  if (err) {
    throw err;
  }

  if (token) {
    console.log('Congratulations, you got a token');
    console.log(JSON.stringify(token));
    // { type: 'tag open', value: 'html' }
  }
});
```

Matched tokens are removed from the beginning of the tokenizer's input buffer, and the input buffer can be appended to between token consumption calls. If tokens are being consumed when all input may not yet be available, the `eager` option can be supplied which prevents consumption of the final token. Instead a `null` token is provided to the callback, and should be ignored. To ensure the final token is consumed when the end of input is reached, a `nextToken` call should be made omitting the `eager` option.

## Streaming API

Rather than setting up the async interaction with the tokenzier manually, it can be operated as a transform stream. The input to the stream is a string stream and the output is an stream of token objects.

See the html2tokens.js demo for an example of setting up and using the tokenizer stream.

```
❯ echo -n '<html></html>' | node ./demo/html2tokens.js
[
{"type":"tag open","value":"html"}
,
{"type":"tag close","value":"html"}
]
```
