# liquid-json

Implementation of `JSON` which ignores BOM and shows more detailed error messages on parse failures.

## usage

```terminal
$ npm install liquid-json --save;
```

```javascript
var LJSON = require('liquid-json');
LJSON.parse('{ "hello": "world" }');
LJSON.stringify({ hello: 'world' });
```

`LJSON.parse` accepts `reviver` function as second parameter and `LJSON.stringify` accepts standard JSON parameters.
All errors raised from this module has error name as `JSONError`.

### asynchronous flavour

```javascript
var LJSON = require('liquid-json').async;

LJSON.parse('{ "hello": "world" }', function (err, obj) {
    console.log(obj); // logs the object
});
LJSON.stringify({ hello: 'world' }, function (err, text) {
    console.log(text); // logs '{"hello":"world"}'
});
```


## attributions

- https://github.com/rlidwka/jju
- https://github.com/ariya/esprima
