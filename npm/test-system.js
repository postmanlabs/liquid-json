#!/usr/bin/env node
/* eslint-env node, es6 */

require('shelljs/global');

var async = require('async'),
    chalk = require('chalk'),
    fs = require('fs'),
    path = require('path'),
    Mocha = require('mocha'),

    SPEC_SOURCE_DIR = path.join(__dirname, '..', 'test', 'system');

module.exports = function (exit) {
    // banner line
    console.info(chalk.yellow.bold('\nRunning system tests using mocha and nsp...'));

    async.series([
        // run test specs using mocha
        function (next) {
            var mocha = new Mocha();

            fs.readdir(SPEC_SOURCE_DIR, function (err, files) {
                if (err) {
                    return next(err);
                }

                files.filter(function (file) {
                    return (file.substr(-8) === '.test.js');
                }).forEach(function (file) {
                    mocha.addFile(path.join(SPEC_SOURCE_DIR, file));
                });

                // start the mocha run
                mocha.run(next);
                mocha = null; // cleanup
            });
        }
    ], exit);
};

// ensure we run this script exports if this is a direct stdin.tty run
!module.parent && module.exports(exit);
