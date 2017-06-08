var expect = require('expect.js'),
    LJSON = require('../../');

describe('json.stringify', function () {
    it('should stringify a simple', function () {
        expect(LJSON.stringify({
            'one-key': true
        })).to.eql('{"one-key":true}');
    });

    describe('async variant', function () {
        it('should stringify a simple object', function (done) {
            LJSON.async.stringify({
                'one-key': true
            }, function (err, json) {
                if (err) { return done(err); }

                expect(json).to.eql('{"one-key":true}');
                done();
            });
        });
    });

});
