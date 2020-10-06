/* global describe, it */
var expect = require('chai').expect;

describe('travis.yml', function () {
    var fs = require('fs'),
        yaml = require('js-yaml'),
        travisYAML,
        travisYAMLError;

    try {
        travisYAML = yaml.safeLoad(fs.readFileSync('.travis.yml').toString());
    }
    catch (e) {
        travisYAMLError = e;
    }

    it('must exist', function (done) {
        fs.stat('.travis.yml', done);
    });

    it('must be a valid yml', function () {
        expect(travisYAMLError && travisYAMLError.message || travisYAMLError).to.not.be.ok;
    });

    describe('structure', function () {
        it('should use the trusty Ubuntu distribution', function () {
            expect(travisYAML.dist).to.equal('trusty');
        });

        it('language must be set to node', function () {
            expect(travisYAML.language).to.equal('node_js');
            expect(travisYAML.node_js).to.eql(['10', '12', '14']);
        });

        it('should have a valid Slack notification token', function () {
            expect(travisYAML.notifications.slack.secure).to.be.ok;
        });
    });
});
