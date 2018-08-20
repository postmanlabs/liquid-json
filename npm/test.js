#!/usr/bin/env node
require('shelljs/global');

var chalk = require('chalk'),
    prettyms = require('pretty-ms'),
    startedAt = Date.now();

require('async').series([
    require('./test-lint'),
    require('./test-system'),
    require('./test-unit'),
    require('./test-browser')
], function (code) {
    console.info(chalk[code ?
        // eslint-disable-next-line max-len
        'red' : 'green'](`\nliquid-json: duration ${prettyms(Date.now() - startedAt)}\nliquid-json: ${code ? 'not ok' : 'ok'}!`));
    exit(code && (typeof code === 'number' ? code : 1) || 0);
});
